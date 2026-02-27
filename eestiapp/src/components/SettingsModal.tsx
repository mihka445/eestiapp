import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserProfile } from '@/contexts/UserProfileContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useUserProfile();
  const [formData, setFormData] = useState(profile);

  const handleChange = (field: keyof typeof profile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#1a3a5c] to-[#0f2847] text-white sticky top-0">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-bold">Muuda andmeid</h2>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-xs font-semibold text-[#0073e6] uppercase tracking-widest mb-2">
              Eesnimi
            </label>
            <Input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="h-9 text-sm"
              placeholder="Eesnimi"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-semibold text-[#0073e6] uppercase tracking-widest mb-2">
              Perekonnanimi
            </label>
            <Input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="h-9 text-sm"
              placeholder="Perekonnanimi"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-xs font-semibold text-[#0073e6] uppercase tracking-widest mb-2">
              Sünniaeg
            </label>
            <Input
              type="text"
              value={formData.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              className="h-9 text-sm"
              placeholder="DD.MM.YYYY"
            />
          </div>

          {/* Personal Code */}
          <div>
            <label className="block text-xs font-semibold text-[#0073e6] uppercase tracking-widest mb-2">
              Isikukood
            </label>
            <Input
              type="text"
              value={formData.personalCode}
              onChange={(e) => handleChange('personalCode', e.target.value)}
              className="h-9 text-sm"
              placeholder="Isikukood"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-[#0073e6] uppercase tracking-widest mb-2">
              Sugu
            </label>
            <Input
              type="text"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="h-9 text-sm"
              placeholder="Sugu"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-10"
            >
              Tühista
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 h-10 bg-[#0073e6] hover:bg-[#0056b3] text-white"
            >
              Salvesta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
