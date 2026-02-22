import React from 'react';
import { Award, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../utils';

interface LoyaltyViewProps {
  stamps: number;
  points: number;
}

export function LoyaltyView({ stamps, points }: LoyaltyViewProps) {
  const totalSlots = 10;

  return (
    <div className="space-y-8 pb-24">
      <div className="text-center space-y-2">
        <div className="inline-flex bg-white/10 p-3 rounded-2xl mb-2">
          <Award size={32} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Loyalty Card</h2>
        <p className="text-white/50 text-sm">Collect 10 stamps to earn a free slice!</p>
      </div>

      <div className="glass rounded-[2.5rem] p-8 grid grid-cols-5 gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
        {Array.from({ length: totalSlots }).map((_, i) => {
          const isFilled = i < stamps;
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: isFilled ? [1, 1.2, 1] : 1,
                rotate: isFilled ? [0, 10, 0] : 0,
              }}
              className={cn(
                "aspect-square rounded-2xl flex items-center justify-center transition-all duration-500",
                isFilled ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "bg-white/5 text-white/10 border border-white/5"
              )}
            >
              <Star size={24} fill={isFilled ? "currentColor" : "none"} />
            </motion.div>
          );
        })}
      </div>

      <div className="glass rounded-3xl p-6 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Available Points</span>
          <div className="text-2xl font-bold">{points} pts</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/50">Next stamp at</div>
          <div className="font-semibold">{100 - (points % 100)} pts</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold px-2">How it works</h3>
        <div className="grid gap-3">
          {[
            "Every R$ 1 spent = 1 point",
            "100 points = 1 Stamp",
            "10 Stamps = 1 Free Slice (R$ 15 credit)"
          ].map((text, i) => (
            <div key={i} className="glass px-5 py-4 rounded-2xl flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-white" />
              <span className="text-sm text-white/80">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
