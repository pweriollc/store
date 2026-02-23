import React from 'react';
import { Home, Wallet, Award, ShieldCheck } from 'lucide-react';
import { View, UserProfile } from '../types';
import { cn } from '../utils';
import { motion } from 'motion/react';

interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
  profile: UserProfile;
  onProfileClick: () => void;
}

export function BottomNav({ currentView, onViewChange, profile, onProfileClick }: BottomNavProps) {
  const isAdmin = profile.id === '6903ddff-f8b5-4aaa-8da3-8fcba142b27d';
  const ringColor = isAdmin ? '#22c55e' : '#3b82f6'; // Green for Admin, Blue for others

  const tabs = [
    { id: 'catalog', label: 'Cakes', icon: Home },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'loyalty', label: 'Loyalty', icon: Award },
  ];

  const initials = profile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

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

      {/* Profile Avatar */}
      <button
        onClick={onProfileClick}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="relative">
          <motion.div
            className="absolute -inset-1 rounded-full opacity-75 blur-[2px]"
            animate={{
              boxShadow: [`0 0 0px ${ringColor}`, `0 0 8px ${ringColor}`, `0 0 0px ${ringColor}`],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ border: `2px solid ${ringColor}` }}
          />
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold border border-white/20 relative z-10 overflow-hidden">
            {initials}
          </div>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Profile</span>
      </button>
      
      {/* Subtle Admin Access - Only if Admin */}
      {isAdmin && (
        <button
          onClick={() => onViewChange('admin')}
          className={cn(
            "absolute -top-12 right-4 glass p-2 rounded-full transition-all",
            currentView === 'admin' ? "text-white bg-white/20" : "text-white/20"
          )}
        >
          <ShieldCheck size={16} />
        </button>
      )}
    </nav>
  );
}
