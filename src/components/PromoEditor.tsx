import React, { useState, useEffect } from 'react';
import { WalletTier } from '../types';
import { BottomDrawer } from './BottomDrawer';

interface PromoEditorProps {
  isOpen: boolean;
  onClose: () => void;
  tier: WalletTier | null;
  onSave: (tier: WalletTier) => void;
}

export function PromoEditor({ isOpen, onClose, tier, onSave }: PromoEditorProps) {
  const [bonus, setBonus] = useState<number>(0);

  useEffect(() => {
    if (tier) {
      setBonus(tier.bonusPercentage);
    }
  }, [tier]);

  const handleSave = () => {
    if (tier) {
      onSave({ ...tier, bonusPercentage: bonus });
      onClose();
    }
  };

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title={`Edit Bonus (R$ ${tier?.amount})`}>
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Bonus Percentage (%)</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="50"
              value={bonus}
              onChange={(e) => setBonus(parseInt(e.target.value))}
              className="flex-1 accent-white"
            />
            <span className="text-2xl font-bold w-16 text-right">{bonus}%</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-white/90 transition-all active:scale-95 mt-4"
        >
          Save Changes
        </button>
      </div>
    </BottomDrawer>
  );
}
