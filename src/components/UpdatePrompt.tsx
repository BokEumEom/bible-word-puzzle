import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, X } from 'lucide-react';

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setNeedRefresh(false);
  };

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          className="fixed bottom-6 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-white p-4 rounded-2xl shadow-[0_4px_0_var(--color-orange-200)] flex items-center gap-3">
            <div className="bg-orange-100 p-2.5 rounded-xl shrink-0">
              <RefreshCw size={20} className="text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-stone-800">새로운 버전이 있어요!</p>
              <p className="text-xs font-bold text-stone-400">업데이트하면 더 좋아져요</p>
            </div>
            <button
              onClick={handleUpdate}
              className="bg-orange-500 text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors shrink-0"
            >
              업데이트
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-stone-300 hover:text-stone-500 transition-colors shrink-0"
              aria-label="닫기"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
