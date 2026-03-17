import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Difficulty, Verse } from './types';
import { verses } from './data/verses';
import { Dashboard } from './components/Dashboard';
import { DifficultySelector } from './components/DifficultySelector';
import { ProgressHeader } from './components/ProgressHeader';
import { VersePuzzleBoard } from './components/VersePuzzleBoard';
import { ResultScreen } from './components/ResultScreen';
import { FeedbackToast } from './components/FeedbackToast';
import { BibleSelector } from './components/BibleSelector';
import { ModeSelector } from './components/ModeSelector';
import { ReadingScreen } from './components/ReadingScreen';
import { MemorizeScreen } from './components/MemorizeScreen';
import { ChevronLeft } from 'lucide-react';
import { useUserProgress } from './hooks/useUserProgress';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('home');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [currentVerses, setCurrentVerses] = useState<Verse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedCustomVerse, setSelectedCustomVerse] = useState<Verse | null>(null);

  const { progress, toggleFavorite, markCompleted, addRecent, updateStreak } = useUserProgress();

  // Update streak on app load
  useEffect(() => {
    updateStreak();
  }, []);

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
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setCurrentVerses(shuffled);
    setCurrentIndex(0);
    setStars(0);
    setGameState('playing');
  };

  const handleCorrect = () => {
    setShowFeedback(true);
    setStars(prev => prev + 1);
    
    if (gameState === 'custom-playing' && selectedCustomVerse) {
      markCompleted(selectedCustomVerse);
    } else if (currentVerses[currentIndex]) {
      markCompleted(currentVerses[currentIndex]);
    }
    
    setTimeout(() => {
      setShowFeedback(false);
      if (gameState === 'custom-playing') {
        // Just show success and stay or go back to mode select
        setGameState('select-mode');
      } else if (currentIndex < currentVerses.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setGameState('result');
      }
    }, 2000);
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

  return (
    <div className="min-h-screen w-full overflow-hidden relative font-sans">
      <AnimatePresence mode="wait">
        {gameState === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Dashboard 
              progress={progress} 
              onStartExplore={startExplore} 
              onStartPreset={startPreset}
              onSelectVerse={handleBibleSelect} 
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
            />
          </motion.div>
        )}

        {gameState === 'select-mode' && selectedCustomVerse && (
          <motion.div key="select-mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModeSelector 
              verse={selectedCustomVerse} 
              onSelectMode={handleModeSelect} 
              onBack={() => setGameState('home')} 
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
                className="p-3 bg-white rounded-full shadow-md hover:bg-gray-50 border-2 border-gray-100"
              >
                <ChevronLeft size={32} className="text-gray-600" />
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
      </AnimatePresence>

      <FeedbackToast show={showFeedback} />
    </div>
  );
}

