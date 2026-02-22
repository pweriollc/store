import React from 'react';
import { Home, Wallet, Award, Settings, ShieldCheck } from 'lucide-react';
import { View } from '../types';
import { cn } from '../utils';

interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const tabs = [
    { id: 'catalog', label: 'Cakes', icon: Home },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'loyalty', label: 'Loyalty', icon: Award },
    { id: 'settings', label: 'Profile', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-dark pb-8 pt-3 px-6 flex justify-around items-center">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id as View)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              isActive ? "text-white scale-110" : "text-white/40"
            )}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium uppercase tracking-widest">{tab.label}</span>
          </button>
        );
      })}
      
      {/* Subtle Admin Access */}
      <button
        onClick={() => onViewChange('admin')}
        className={cn(
          "absolute -top-12 right-4 glass p-2 rounded-full transition-all",
          currentView === 'admin' ? "text-white bg-white/20" : "text-white/20"
        )}
      >
        <ShieldCheck size={16} />
      </button>
    </nav>
  );
}
