import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Difficulty, Verse, OnboardingProfile } from './types';
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
import { BibleSelector } from './components/BibleSelector';
import { ModeSelector } from './components/ModeSelector';
import { ReadingScreen } from './components/ReadingScreen';
import { MemorizeScreen } from './components/MemorizeScreen';
import { ChevronLeft } from 'lucide-react';
import { useUserProgress } from './hooks/useUserProgress';

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

  const { progress, toggleFavorite, markCompleted, addRecent, updateStreak, setDailyGoal, saveOnboarding, isDailyGoalMet } = useUserProgress();

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

  const startExplore = () => {
    setGameState('select-bible');
  };

  const selectDifficulty = (diff: Difficulty) => {
    setDifficulty(diff);
    // Filter verses by difficulty and take up to 5 for a quick session, or all available
    const filtered = verses.filter(v => v.difficulty === diff);
    // Shuffle them
    const shuffled = shuffle(filtered);
    setCurrentVerses(shuffled);
    setCurrentIndex(0);
    setStars(0);
    setGameState('playing');
  };

  // Show celebration when daily goal is first met
  useEffect(() => {
    if (isDailyGoalMet && !showGoalCelebration) {
      setShowGoalCelebration(true);
    }
  }, [isDailyGoalMet]);

  const handleCorrect = () => {
    setStars(prev => prev + 1);

    if (gameState === 'custom-playing' && selectedCustomVerse) {
      markCompleted(selectedCustomVerse);
      // Compute next verse from cached chapters
      const parsed = selectedCustomVerse.id.split('-');
      const bookId = parsed.slice(0, parsed.length - 2).join('-');
      loadBookChapters(bookId)
        .then(chapters => setNextVerse(getNextVerse(selectedCustomVerse.id, chapters)))
        .catch(() => setNextVerse(null));
      setGameState('custom-complete');
    } else if (currentVerses[currentIndex]) {
      markCompleted(currentVerses[currentIndex]);
      if (currentIndex < currentVerses.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setGameState('result');
      }
    }

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
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Dashboard
              progress={progress}
              isDailyGoalMet={isDailyGoalMet}
              onStartExplore={startExplore}
              onStartPreset={startPreset}
              onSelectVerse={handleBibleSelect}
              onResetOnboarding={handleResetOnboarding}
            />
          </motion.div>
        )}

        {gameState === 'difficulty' && (
          <motion.div key="diff" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DifficultySelector onSelect={selectDifficulty} onBack={goHome} />
          </motion.div>
        )}

        {gameState === 'playing' && currentVerses.length > 0 && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col min-h-screen p-4 max-w-2xl mx-auto pt-8">
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
                onToggleFavorite={() => toggleFavorite(currentVerses[currentIndex])}
              />
            </div>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ResultScreen
              stars={stars}
              total={currentVerses.length}
              onHome={goHome}
              onRetry={retry}
              onChangeDifficulty={() => setGameState('difficulty')}
            />
          </motion.div>
        )}

        {/* New Bible Exploration States */}
        {gameState === 'select-bible' && (
          <motion.div key="select-bible" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BibleSelector
              onSelect={handleBibleSelect}
              onBack={goHome}
              completedVerses={progress.completedVerses}
              interests={progress.onboarding.interests}
            />
          </motion.div>
        )}

        {gameState === 'select-mode' && selectedCustomVerse && (
          <motion.div key="select-mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModeSelector
              verse={selectedCustomVerse}
              onSelectMode={handleModeSelect}
              onBack={() => setGameState('select-bible')}
            />
          </motion.div>
        )}

        {gameState === 'reading' && selectedCustomVerse && (
          <motion.div key="reading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ReadingScreen verse={selectedCustomVerse} onBack={() => setGameState('select-mode')} />
          </motion.div>
        )}

        {gameState === 'memorizing' && selectedCustomVerse && (
          <motion.div key="memorizing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MemorizeScreen verse={selectedCustomVerse} onBack={() => setGameState('select-mode')} />
          </motion.div>
        )}

        {gameState === 'custom-playing' && selectedCustomVerse && (
          <motion.div key="custom-playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col min-h-screen p-4 max-w-2xl mx-auto pt-8">
            <div className="flex items-center mb-8">
              <button 
                onClick={() => setGameState('select-mode')}
                className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white border-2 border-orange-100 transition-colors"
              >
                <ChevronLeft size={32} className="text-orange-500" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <VersePuzzleBoard 
                verse={selectedCustomVerse} 
                onCorrect={handleCorrect} 
                isFavorite={progress.favoriteVerses.some(v => v.id === selectedCustomVerse.id)}
                onToggleFavorite={() => toggleFavorite(selectedCustomVerse)}
              />
            </div>
          </motion.div>
        )}

        {gameState === 'custom-complete' && selectedCustomVerse && (
          <motion.div key="custom-complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CompletionScreen
              verse={selectedCustomVerse}
              nextVerse={nextVerse}
              onNextVerse={handleNextVerse}
              onBackToModes={() => setGameState('select-mode')}
              onHome={goHome}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <DailyGoalCelebration
        show={showGoalCelebration}
        onDismiss={() => setShowGoalCelebration(false)}
      />
    </div>
  );
}

