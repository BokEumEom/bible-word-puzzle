import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, RefreshCw } from 'lucide-react';
import { animations } from '../design/tokens';

interface Props {
  readonly type: 'correct' | 'wrong';
  readonly show: boolean;
  readonly correctCount?: number;
  readonly totalCount?: number;
  readonly onContinue: () => void;
}

export function BottomFeedbackSheet({ type, show, correctCount, totalCount, onContinue }: Props) {
  const isCorrect = type === 'correct';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={animations.fast}
          className="fixed bottom-0 left-0 right-0 z-40"
        >
          <div
            className={`px-6 pt-5 pb-8 ${
              isCorrect
                ? 'bg-emerald-100 border-t-4 border-emerald-300'
                : 'bg-amber-50 border-t-4 border-amber-200'
            }`}
            style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
          >
            <div className="max-w-md mx-auto">
              {/* Status message */}
              <div className="flex items-center gap-3 mb-4">
                {isCorrect ? (
                  <div className="bg-emerald-500 p-1.5 rounded-full">
                    <Check size={20} className="text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="bg-amber-400 p-1.5 rounded-full">
                    <RefreshCw size={20} className="text-white" strokeWidth={3} />
                  </div>
                )}
                <h3
                  className={`text-xl font-black ${
                    isCorrect ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {isCorrect
                    ? '정답이에요!'
                    : correctCount !== undefined && totalCount !== undefined && correctCount > 0
                      ? `${correctCount}/${totalCount}개가 맞는 자리에!`
                      : '다시 배치해 볼까요?'}
                </h3>
              </div>

              {/* Sub-message for wrong */}
              {!isCorrect && (
                <p className="text-sm font-bold text-amber-600 mb-4 ml-10">
                  거의 다 왔어요, 한 걸음씩 가까이!
                </p>
              )}

              {/* Continue / Retry button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onContinue}
                className={`w-full py-4 text-lg font-black flex items-center justify-center gap-2 ${
                  isCorrect ? 'btn-success' : 'btn-warning'
                }`}
              >
                {isCorrect ? (
                  <>
                    계속하기
                    <ChevronRight size={22} strokeWidth={3} />
                  </>
                ) : (
                  <>
                    다시 도전
                    <RefreshCw size={20} strokeWidth={3} />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
