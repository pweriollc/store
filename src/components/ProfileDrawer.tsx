import React from 'react';
import { UserProfile } from '../types';
import { BottomDrawer } from './BottomDrawer';
import { LogOut, User, Mail, MapPin, Phone, Award, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onLogout: () => void;
}

export function ProfileDrawer({ isOpen, onClose, profile, onLogout }: ProfileDrawerProps) {
  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title="Seu Perfil">
      <div className="space-y-8 pt-4 pb-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold border-2 border-white/20">
            {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-white/40 text-sm">{profile.email}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 rounded-2xl flex items-center gap-4">
              <div className="bg-white/10 p-2 rounded-xl">
                <Award className="text-white" size={20} />
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Pontos</div>
                <div className="text-lg font-bold">{profile.points}</div>
              </div>
            </div>

            <div className="glass p-4 rounded-2xl flex items-center gap-4">
              <div className="bg-white/10 p-2 rounded-xl">
                <Wallet className="text-white" size={20} />
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Saldo</div>
                <div className="text-lg font-bold">{formatCurrency(profile.wallet_balance_cents / 100)}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 px-2">
              <MapPin size={16} className="text-white/40" />
              <span className="text-sm text-white/60">{profile.address}</span>
            </div>
            <div className="flex items-center gap-3 px-2">
              <Phone size={16} className="text-white/40" />
              <span className="text-sm text-white/60">{profile.whatsapp}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-500/20 transition-all active:scale-95"
        >
          <LogOut size={20} />
          <span>Sair da Conta</span>
        </button>
      </div>
    </BottomDrawer>
  );
}
