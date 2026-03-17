import { motion, AnimatePresence } from 'motion/react';
import { PartyPopper } from 'lucide-react';

interface Props {
  show: boolean;
  message?: string;
}

export function FeedbackToast({ show, message = "정답이에요! 참 잘했어요!" }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none px-4"
        >
          <div className="bg-green-500 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 border-4 border-green-300">
            <PartyPopper size={32} className="text-yellow-300" />
            <span className="text-2xl font-bold">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
