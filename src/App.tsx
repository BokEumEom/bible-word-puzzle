import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Difficulty, Verse, OnboardingProfile, SessionStats } from './types';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { verses } from './data/verses';
import { shuffle } from './utils/shuffle';
import { loadBookChapters } from './data/bible';
import { getNextVerse } from './utils/verseNavigation';
import { Dashboard } from './components/Dashboard';
import { DifficultySelector } from './components/DifficultySelector';
import { ProgressHeader } from './components/ProgressHeader';
import { VersePuzzleBoard } from './components/VersePuzzleBoard';
import { ResultScreen } from './components/ResultScreen';
import { CompletionScreen } from './components/CompletionScreen';
import { DailyGoalCelebration } from './components/DailyGoalCelebration';
import { XpGainAnimation } from './components/XpGainAnimation';
import { LevelUpCelebration } from './components/LevelUpCelebration';
import { BibleSelector } from './components/BibleSelector';
import { ModeSelector } from './components/ModeSelector';
import { ReadingScreen } from './components/ReadingScreen';
import { MemorizeScreen } from './components/MemorizeScreen';
import { AchievementUnlock } from './components/AchievementUnlock';
import { ProfileScreen } from './components/ProfileScreen';
import { CollectionList } from './components/CollectionList';
import { CollectionDetail } from './components/CollectionDetail';
import { CollectionCompleteScreen } from './components/CollectionCompleteScreen';
import { UpdatePrompt } from './components/UpdatePrompt';
import { BottomTabBar, getTabIndex } from './components/ui/BottomTabBar';
import { ChevronLeft } from 'lucide-react';
import { useUserProgress } from './hooks/useUserProgress';
import { XpEvent } from './utils/xp';
import { LevelInfo, getLevelForXp } from './data/levels';
import { AchievementDef, checkAchievements, buildAchievementContext } from './data/achievements';
import { Collection, CollectionVerse } from './data/collections';
import { getNextVerseInCollection, toVerseId } from './utils/collectionProgress';
import { loadCollectionVerse } from './utils/loadCollectionVerse';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => 'home' as GameState);
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [currentVerses, setCurrentVerses] = useState<Verse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [selectedCustomVerse, setSelectedCustomVerse] = useState<Verse | null>(null);
  const [nextVerse, setNextVerse] = useState<Verse | null>(null);
  const [showGoalCelebration, setShowGoalCelebration] = useState(false);
  const [isReOnboarding, setIsReOnboarding] = useState(false);
  const [lastXpEvent, setLastXpEvent] = useState<XpEvent | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<LevelInfo | null>(null);
  const prevLevelRef = useRef<number | null>(null);
  const [pendingAchievements, setPendingAchievements] = useState<AchievementDef[]>([]);
  const [showAchievement, setShowAchievement] = useState<AchievementDef | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionVerse, setCollectionVerse] = useState<Verse | null>(null);
  const [collectionCv, setCollectionCv] = useState<CollectionVerse | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [tabDirection, setTabDirection] = useState(0); // -1 left, 0 none, 1 right

  const { progress, toggleFavorite, markCompleted, addRecent, updateStreak, setDailyGoal, saveOnboarding, unlockAchievements, isDailyGoalMet, currentLevel } = useUserProgress();

  // Detect level-up
  useEffect(() => {
    if (prevLevelRef.current !== null && currentLevel.level > prevLevelRef.current) {
      setLevelUpInfo(currentLevel);
      setShowLevelUp(true);
    }
    prevLevelRef.current = currentLevel.level;
  }, [currentLevel.level]);

  // Update streak on app load
  useEffect(() => {
    updateStreak();
  }, []);

  // Gate: show onboarding if not completed
  useEffect(() => {
    if (!progress.onboarding.onboardingCompleted) {
      setGameState('onboarding');
    }
  }, []);

  const handleOnboardingComplete = (profile: OnboardingProfile, dailyGoal: number) => {
    saveOnboarding(profile);
    setDailyGoal(dailyGoal);
    setGameState('home');
  };

  const handleResetOnboarding = () => {
    setIsReOnboarding(true);
    saveOnboarding({ level: 'beginner', interests: [], onboardingCompleted: false });
    setGameState('onboarding');
  };

  const startPreset = () => {
    setGameState('difficulty');
  };

  const selectDifficulty = (diff: Difficulty) => {
    setDifficulty(diff);
    const filtered = verses.filter(v => v.difficulty === diff);
    const shuffled = shuffle(filtered);
    setCurrentVerses(shuffled);
    setCurrentIndex(0);
    setStars(0);
    setSessionStats({
      startedAt: Date.now(),
      totalXp: 0,
      versesCompleted: 0,
      versesTotal: shuffled.length,
      hintsUsed: 0,
      streak: progress.streak,
      dailyGoalProgress: progress.todayCompletions,
      dailyGoal: progress.dailyGoal,
      isDailyGoalJustMet: false,
    });
    setGameState('playing');
  };

  // Show celebration when daily goal is first met
  useEffect(() => {
    if (isDailyGoalMet && !showGoalCelebration) {
      setShowGoalCelebration(true);
    }
  }, [isDailyGoalMet]);

  const checkAndUnlockAchievements = (updatedProgress: typeof progress) => {
    const level = getLevelForXp(updatedProgress.xp).level;
    const context = buildAchievementContext(updatedProgress, level);
    const newlyUnlocked = checkAchievements(updatedProgress.unlockedAchievements, context);
    if (newlyUnlocked.length > 0) {
      unlockAchievements(newlyUnlocked.map(a => a.id));
      setPendingAchievements(newlyUnlocked);
      setShowAchievement(newlyUnlocked[0]);
    }
  };

  const handleCorrect = (options?: { usedHint?: boolean }) => {
    setStars(prev => prev + 1);

    if (gameState === 'custom-playing' && selectedCustomVerse) {
      const xpEvent = markCompleted(selectedCustomVerse, options);
      setLastXpEvent(xpEvent);

      // Check achievements with projected state
      const isNoHint = !(options?.usedHint ?? false);
      const today = new Date().toISOString().split('T')[0];
      const isNewDay = progress.todayCompletionDate !== today;
      const newTodayCompletions = isNewDay ? 1 : progress.todayCompletions + 1;
      const willMeetGoal = newTodayCompletions >= progress.dailyGoal;
      const alreadyMetGoal = !isNewDay && progress.todayCompletions >= progress.dailyGoal;
      checkAndUnlockAchievements({
        ...progress,
        completedVerses: { ...progress.completedVerses, [selectedCustomVerse.id]: (progress.completedVerses[selectedCustomVerse.id] || 0) + 1 },
        xp: progress.xp + xpEvent.total,
        noHintCompletions: progress.noHintCompletions + (isNoHint ? 1 : 0),
        dailyGoalMetCount: progress.dailyGoalMetCount + ((willMeetGoal && !alreadyMetGoal) ? 1 : 0),
      });

      // Build single-verse session stats (reuse today/isNewDay from above)
      setSessionStats({
        startedAt: Date.now() - 30000, // approximate
        totalXp: xpEvent.total,
        versesCompleted: 1,
        versesTotal: 1,
        hintsUsed: options?.usedHint ? 1 : 0,
        streak: progress.streak,
        dailyGoalProgress: newTodayCompletions,
        dailyGoal: progress.dailyGoal,
        isDailyGoalJustMet: willMeetGoal && !alreadyMetGoal,
      });

      // Compute next verse from cached chapters
      const parsed = selectedCustomVerse.id.split('-');
      const bookId = parsed.slice(0, parsed.length - 2).join('-');
      loadBookChapters(bookId)
        .then(chapters => setNextVerse(getNextVerse(selectedCustomVerse.id, chapters)))
        .catch(() => setNextVerse(null));
      setGameState('custom-complete');
    } else if (currentVerses[currentIndex]) {
      const verse = currentVerses[currentIndex];
      const xpEvent = markCompleted(verse, options);
      setLastXpEvent(xpEvent);

      // Check achievements with projected state
      const isNoHint = !(options?.usedHint ?? false);
      const today = new Date().toISOString().split('T')[0];
      const isNewDay = progress.todayCompletionDate !== today;
      const newTodayCompletions = isNewDay ? 1 : progress.todayCompletions + 1;
      const willMeetGoal = newTodayCompletions >= progress.dailyGoal;
      const alreadyMetGoal = !isNewDay && progress.todayCompletions >= progress.dailyGoal;
      checkAndUnlockAchievements({
        ...progress,
        completedVerses: { ...progress.completedVerses, [verse.id]: (progress.completedVerses[verse.id] || 0) + 1 },
        xp: progress.xp + xpEvent.total,
        noHintCompletions: progress.noHintCompletions + (isNoHint ? 1 : 0),
        dailyGoalMetCount: progress.dailyGoalMetCount + ((willMeetGoal && !alreadyMetGoal) ? 1 : 0),
      });

      // Accumulate session stats
      setSessionStats(prev => prev ? {
        ...prev,
        totalXp: prev.totalXp + xpEvent.total,
        versesCompleted: prev.versesCompleted + 1,
        hintsUsed: prev.hintsUsed + (options?.usedHint ? 1 : 0),
        dailyGoalProgress: newTodayCompletions,
        isDailyGoalJustMet: prev.isDailyGoalJustMet || (willMeetGoal && !alreadyMetGoal),
      } : null);

      if (currentIndex < currentVerses.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setGameState('result');
      }
    }
  };

  const handleToggleFavorite = (verse: Verse) => {
    toggleFavorite(verse);
    // Check favorite-based achievements with projected state
    const isFav = progress.favoriteVerses.some(v => v.id === verse.id);
    const newFavorites = isFav
      ? progress.favoriteVerses.filter(v => v.id !== verse.id)
      : [verse, ...progress.favoriteVerses];
    checkAndUnlockAchievements({
      ...progress,
      favoriteVerses: newFavorites,
    });
  };

  const handleAchievementDismiss = () => {
    const remaining = pendingAchievements.slice(1);
    setPendingAchievements(remaining);
    setShowAchievement(remaining[0] ?? null);
  };

  const goHome = () => {
    setGameState('home');
    setSelectedCustomVerse(null);
  };

  const retry = () => {
    selectDifficulty(difficulty);
  };

  const handleBibleSelect = (verse: Verse) => {
    setSelectedCustomVerse(verse);
    addRecent(verse);
    setGameState('select-mode');
  };

  const handleModeSelect = (mode: 'reading' | 'memorizing' | 'custom-playing') => {
    setGameState(mode);
  };

  const handleNextVerse = () => {
    if (nextVerse) {
      setSelectedCustomVerse(nextVerse);
      addRecent(nextVerse);
      setNextVerse(null);
      setGameState('custom-playing');
    }
  };

  const handleSelectCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    setGameState('collection-detail');
  };

  const handlePlayCollectionVerse = (cv: CollectionVerse) => {
    setCollectionCv(cv);
    loadCollectionVerse(cv)
      .then(verse => {
        setCollectionVerse(verse);
        addRecent(verse);
        setGameState('collection-playing');
      })
      .catch(() => {
        // Fallback: go back to detail
        setGameState('collection-detail');
      });
  };

  const handleCollectionCorrect = (options?: { usedHint?: boolean }) => {
    if (!collectionVerse || !selectedCollection) return;

    const xpEvent = markCompleted(collectionVerse, options);
    setLastXpEvent(xpEvent);

    // Check achievements
    const isNoHint = !(options?.usedHint ?? false);
    const today = new Date().toISOString().split('T')[0];
    const isNewDay = progress.todayCompletionDate !== today;
    const newTodayCompletions = isNewDay ? 1 : progress.todayCompletions + 1;
    const willMeetGoal = newTodayCompletions >= progress.dailyGoal;
    const alreadyMetGoal = !isNewDay && progress.todayCompletions >= progress.dailyGoal;
    checkAndUnlockAchievements({
      ...progress,
      completedVerses: { ...progress.completedVerses, [collectionVerse.id]: (progress.completedVerses[collectionVerse.id] || 0) + 1 },
      xp: progress.xp + xpEvent.total,
      noHintCompletions: progress.noHintCompletions + (isNoHint ? 1 : 0),
      dailyGoalMetCount: progress.dailyGoalMetCount + ((willMeetGoal && !alreadyMetGoal) ? 1 : 0),
    });

    setGameState('collection-complete');
  };

  const handleCollectionNext = () => {
    if (!selectedCollection || !collectionCv) return;

    // Find the next incomplete verse in this collection using updated completedVerses
    const updatedCompleted = {
      ...progress.completedVerses,
      [toVerseId(collectionCv)]: (progress.completedVerses[toVerseId(collectionCv)] || 0) + 1,
    };
    const nextCv = getNextVerseInCollection(selectedCollection, updatedCompleted);
    if (nextCv) {
      handlePlayCollectionVerse(nextCv);
    } else {
      // Collection complete — go back to detail
      setGameState('collection-detail');
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative font-sans">
      <AnimatePresence mode="wait">
        {gameState === 'onboarding' && (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OnboardingFlow
              onComplete={handleOnboardingComplete}
              onSkip={isReOnboarding ? () => { setIsReOnboarding(false); goHome(); } : undefined}
            />
          </motion.div>
        )}

        {gameState === 'home' && (
          <motion.div key="home" initial={{ opacity: 0, x: tabDirection * -60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: tabDirection * 60 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <Dashboard
              progress={progress}
              isDailyGoalMet={isDailyGoalMet}
              currentLevel={currentLevel}
              onStartPreset={startPreset}
              onSelectVerse={handleBibleSelect}
            />
          </motion.div>
        )}

        {gameState === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0, x: tabDirection * -60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: tabDirection * 60 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <ProfileScreen
              progress={progress}
              level={currentLevel}
              onResetOnboarding={handleResetOnboarding}
            />
          </motion.div>
        )}

        {gameState === 'difficulty' && (
          <motion.div key="diff" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <DifficultySelector onSelect={selectDifficulty} onBack={goHome} defaultLevel={progress.onboarding.level} />
          </motion.div>
        )}

        {gameState === 'playing' && currentVerses.length > 0 && (
          <motion.div key="playing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.3 }} className="flex flex-col min-h-screen p-4 max-w-2xl mx-auto pt-8">
            <ProgressHeader 
              current={currentIndex + 1} 
              total={currentVerses.length} 
              stars={stars} 
              onClose={goHome}
              onBack={() => setGameState('difficulty')}
            />
            <div className="flex-1 flex flex-col justify-center">
              <VersePuzzleBoard 
                verse={currentVerses[currentIndex]} 
                onCorrect={handleCorrect} 
                isFavorite={progress.favoriteVerses.some(v => v.id === currentVerses[currentIndex].id)}
                onToggleFavorite={() => handleToggleFavorite(currentVerses[currentIndex])}
              />
            </div>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
            <ResultScreen
              stars={stars}
              total={currentVerses.length}
              sessionStats={sessionStats}
              onHome={goHome}
              onRetry={retry}
              onChangeDifficulty={() => setGameState('difficulty')}
            />
          </motion.div>
        )}

        {/* New Bible Exploration States */}
        {gameState === 'select-bible' && (
          <motion.div key="select-bible" initial={{ opacity: 0, x: tabDirection * -60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: tabDirection * 60 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <BibleSelector
              onSelect={handleBibleSelect}
              onBack={goHome}
              completedVerses={progress.completedVerses}
              interests={progress.onboarding.interests}
            />
          </motion.div>
        )}

        {gameState === 'select-mode' && selectedCustomVerse && (
          <motion.div key="select-mode" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <ModeSelector
              verse={selectedCustomVerse}
              onSelectMode={handleModeSelect}
              onBack={() => setGameState('select-bible')}
            />
          </motion.div>
        )}

        {gameState === 'reading' && selectedCustomVerse && (
          <motion.div key="reading" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <ReadingScreen verse={selectedCustomVerse} onBack={() => setGameState('select-mode')} />
          </motion.div>
        )}

        {gameState === 'memorizing' && selectedCustomVerse && (
          <motion.div key="memorizing" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <MemorizeScreen verse={selectedCustomVerse} onBack={() => setGameState('select-mode')} />
          </motion.div>
        )}

        {gameState === 'custom-playing' && selectedCustomVerse && (
          <motion.div key="custom-playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col min-h-screen p-4 max-w-2xl mx-auto pt-8">
            <div className="flex items-center mb-8">
              <button 
                onClick={() => setGameState('select-mode')}
                className="p-3 bg-white rounded-full shadow-sm hover:bg-white border-2 border-orange-100 transition-colors"
              >
                <ChevronLeft size={32} className="text-orange-500" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <VersePuzzleBoard 
                verse={selectedCustomVerse} 
                onCorrect={handleCorrect} 
                isFavorite={progress.favoriteVerses.some(v => v.id === selectedCustomVerse.id)}
                onToggleFavorite={() => handleToggleFavorite(selectedCustomVerse)}
              />
            </div>
          </motion.div>
        )}

        {gameState === 'custom-complete' && selectedCustomVerse && (
          <motion.div key="custom-complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CompletionScreen
              verse={selectedCustomVerse}
              nextVerse={nextVerse}
              sessionStats={sessionStats}
              onNextVerse={handleNextVerse}
              onBackToModes={() => setGameState('select-mode')}
              onHome={goHome}
            />
          </motion.div>
        )}

        {/* Collection Routes */}
        {gameState === 'collection-list' && (
          <motion.div key="collection-list" initial={{ opacity: 0, x: tabDirection * -60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: tabDirection * 60 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <CollectionList
              completedVerses={progress.completedVerses}
              onSelectCollection={handleSelectCollection}
            />
          </motion.div>
        )}

        {gameState === 'collection-detail' && selectedCollection && (
          <motion.div key="collection-detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <CollectionDetail
              collection={selectedCollection}
              completedVerses={progress.completedVerses}
              onPlayVerse={handlePlayCollectionVerse}
              onBack={() => setGameState('collection-list')}
            />
          </motion.div>
        )}

        {gameState === 'collection-playing' && collectionVerse && (
          <motion.div key="collection-playing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.3 }} className="flex flex-col min-h-screen p-4 max-w-2xl mx-auto pt-8">
            <div className="flex items-center mb-8">
              <button
                onClick={() => setGameState('collection-detail')}
                className="p-3 bg-white rounded-full shadow-sm hover:bg-white border-2 border-orange-100 transition-colors"
              >
                <ChevronLeft size={32} className="text-orange-500" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <VersePuzzleBoard
                verse={collectionVerse}
                onCorrect={handleCollectionCorrect}
                isFavorite={progress.favoriteVerses.some(v => v.id === collectionVerse.id)}
                onToggleFavorite={() => handleToggleFavorite(collectionVerse)}
              />
            </div>
          </motion.div>
        )}

        {gameState === 'collection-complete' && collectionVerse && selectedCollection && (
          <motion.div key="collection-complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
            <CollectionCompleteScreen
              verse={collectionVerse}
              collection={selectedCollection}
              completedVerses={progress.completedVerses}
              onNext={handleCollectionNext}
              onBackToCollection={() => setGameState('collection-detail')}
              onHome={goHome}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomTabBar
        gameState={gameState}
        onNavigate={(target) => {
          const fromIdx = getTabIndex(gameState);
          const toIdx = getTabIndex(target);
          setTabDirection(toIdx > fromIdx ? 1 : toIdx < fromIdx ? -1 : 0);
          setGameState(target);
          setSelectedCustomVerse(null);
        }}
      />

      <XpGainAnimation
        xpEvent={lastXpEvent}
        onDone={() => setLastXpEvent(null)}
      />

      <DailyGoalCelebration
        show={showGoalCelebration}
        onDismiss={() => setShowGoalCelebration(false)}
      />

      <LevelUpCelebration
        show={showLevelUp}
        newLevel={levelUpInfo}
        onDismiss={() => setShowLevelUp(false)}
      />

      <AchievementUnlock
        show={showAchievement !== null}
        achievement={showAchievement}
        onDismiss={handleAchievementDismiss}
      />

      <UpdatePrompt />
    </div>
  );
}
