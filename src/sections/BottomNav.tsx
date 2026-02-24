import { LayoutDashboard, PlusCircle, History, User } from 'lucide-react';
import type { View } from '@/types';

interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const navItems: { id: View; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'add', label: 'Add', icon: PlusCircle },
  { id: 'history', label: 'History', icon: History },
  { id: 'account', label: 'Account', icon: User },
];

export function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe"
      style={{
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(200, 240, 0, 0.1)',
      }}
    >
      <div className="max-w-md mx-auto flex items-center justify-around py-3">
        {navItems.map(item => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive ? 'scale-105' : 'hover:scale-105'
              }`}
            >
              <div
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isActive ? 'text-black' : 'text-zinc-500'
                }`}
                style={{
                  background: isActive ? '#c8f000' : 'transparent',
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-medium transition-colors duration-200 ${
                  isActive ? 'text-[#c8f000]' : 'text-zinc-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
