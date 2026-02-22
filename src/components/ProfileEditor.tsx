import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { BottomDrawer } from './BottomDrawer';

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export function ProfileEditor({ isOpen, onClose, profile, onSave }: ProfileEditorProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full glass bg-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 ring-white/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Address Details</label>
          <textarea
            rows={3}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full glass bg-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 ring-white/20 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">WhatsApp Number</label>
          <input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            className="w-full glass bg-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 ring-white/20"
          />
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
