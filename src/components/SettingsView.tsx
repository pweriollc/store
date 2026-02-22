import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  ChevronRight, 
  LogOut,
  Settings as SettingsIcon,
  Plus,
  Edit2
} from 'lucide-react';
import { motion } from 'motion/react';
import { PaymentMethod, UserProfile } from '../types';
import { cn } from '../utils';
import { ProfileEditor } from './ProfileEditor';

interface SettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
}

export function SettingsView({ profile, onUpdateProfile, onLogout }: SettingsViewProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col items-center text-center space-y-4 pt-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10">
            <User size={48} className="text-white/60" />
          </div>
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full shadow-lg"
          >
            <Edit2 size={14} />
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p className="text-white/40 text-sm">{profile.email}</p>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Contact Info</h3>
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="text-xs font-bold text-white/60 hover:text-white"
          >
            Edit
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Address</span>
            <span className="text-sm text-white/80">{profile.address}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">WhatsApp</span>
            <span className="text-sm text-white/80">{profile.whatsapp}</span>
          </div>
        </div>
      </div>

      <section className="space-y-2">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest px-2 mb-4">Account Settings</h3>
        <div className="glass rounded-[2rem] overflow-hidden">
          {[
            { icon: Bell, label: 'Notifications', value: 'On' },
            { icon: Shield, label: 'Privacy & Security', value: null },
            { icon: SettingsIcon, label: 'Preferences', value: 'English' },
          ].map((item, i) => (
            <button 
              key={i}
              className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="text-white/40">
                  <item.icon size={20} />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && <span className="text-sm text-white/40">{item.value}</span>}
                <ChevronRight size={16} className="text-white/20" />
              </div>
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={onLogout}
        className="w-full glass p-5 rounded-3xl flex items-center justify-center gap-3 text-red-400 font-bold hover:bg-red-400/10 transition-colors"
      >
        <LogOut size={20} />
        Log Out
      </button>

      <ProfileEditor 
        isOpen={isEditingProfile} 
        onClose={() => setIsEditingProfile(false)} 
        profile={profile} 
        onSave={onUpdateProfile} 
      />

      <div className="text-center">
        <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">
          Vó Alzira PWA v2.4.0
        </p>
      </div>
    </div>
  );
}
