import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { User, Calendar, LogOut, Edit2, Check, X } from 'lucide-react';
import type { User as UserType } from '@/types';

interface AccountProps {
  user: UserType;
  onSignOut: () => void;
  onUpdateUser: (updates: Partial<UserType>) => Promise<boolean>;
}

export function Account({ user, onSignOut, onUpdateUser }: AccountProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  const handleSave = async () => {
    if (!editName.trim()) return;
    
    setIsUpdating(true);
    const success = await onUpdateUser({ name: editName.trim() });
    if (success) {
      setIsEditing(false);
    }
    setIsUpdating(false);
  };

  const handleCancel = () => {
    setEditName(user.name);
    setIsEditing(false);
  };

  const joinedDate = new Date(user.joinedAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div ref={cardRef} className="space-y-4">
      {/* Profile Card */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'rgba(20, 20, 20, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(200, 240, 0, 0.2)',
        }}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #c8f000, #9bc400)',
              color: '#0a0a0a',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-2 w-full max-w-xs">
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg py-2 px-3 text-white text-center focus:border-[#c8f000] transition-colors"
                autoFocus
              />
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="p-2 rounded-lg bg-[#c8f000] text-black hover:opacity-90 transition-opacity"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-[#c8f000] hover:bg-zinc-800 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <p className="text-zinc-500 text-sm mt-1">{user.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-zinc-900/50 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-2" style={{ color: '#c8f000' }} />
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Member Since</p>
            <p className="text-sm font-medium text-white">{joinedDate}</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/50 text-center">
            <User className="w-5 h-5 mx-auto mb-2" style={{ color: '#c8f000' }} />
            <p className="text-xs text-zinc-500 uppercase tracking-wider">User ID</p>
            <p className="text-sm font-medium text-white font-mono">{user.id.slice(-8)}</p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onSignOut}
          className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      {/* About Card */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(20, 20, 20, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h3 className="font-semibold text-white mb-3">About KAKK HEAN</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          KAKK HEAN is a personal finance tracker designed with a cinematic aesthetic. 
          Your data is stored locally on your device for maximum privacy.
        </p>
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-500">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
