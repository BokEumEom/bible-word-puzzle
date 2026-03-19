import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export function InstallPrompt() {
  const { canInstall, isIOS, isStandalone, isDismissedByUser, promptInstall, dismiss } = useInstallPrompt();

  if (isStandalone || isDismissedByUser) return null;

  const showAndroid = canInstall;
  const showIOS = isIOS && !canInstall;

  if (!showAndroid && !showIOS) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white/90 backdrop-blur-sm p-4 rounded-[2rem] shadow-sm border-b-4 border-violet-100 mb-6"
      >
        <div className="flex items-start gap-3">
          <div className="bg-violet-100 p-2.5 rounded-xl shrink-0 mt-0.5">
            {showIOS ? <Share size={20} className="text-violet-500" /> : <Download size={20} className="text-violet-500" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-stone-800 mb-1">
              홈 화면에 추가하세요!
            </p>
            {showIOS ? (
              <p className="text-xs font-bold text-stone-400 leading-relaxed">
                Safari 하단의 <span className="inline-flex items-center align-middle"><Share size={12} className="text-violet-500 mx-0.5" /></span> 공유 버튼 → "홈 화면에 추가"를 눌러주세요
              </p>
            ) : (
              <p className="text-xs font-bold text-stone-400">
                앱처럼 빠르게 시작할 수 있어요
              </p>
            )}
          </div>
          <button
            onClick={dismiss}
            className="p-1.5 text-stone-300 hover:text-stone-500 transition-colors shrink-0"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>
        {showAndroid && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={promptInstall}
            className="w-full mt-3 bg-violet-500 text-white text-sm font-black py-2.5 rounded-xl hover:bg-violet-600 transition-colors"
          >
            설치하기
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
