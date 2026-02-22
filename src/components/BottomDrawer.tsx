import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function BottomDrawer({ isOpen, onClose, children, title, className }: BottomDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 glass-dark z-[110] rounded-t-[2.5rem] flex flex-col max-h-[90vh] pb-10 shadow-2xl",
              className
            )}
          >
            {/* Handle */}
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            {title && (
              <div className="px-8 pt-2 pb-4">
                <h2 className="text-2xl font-bold">{title}</h2>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-8">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
