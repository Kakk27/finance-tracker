import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronRight } from 'lucide-react';
import type { Transaction } from '@/types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onViewAll: () => void;
  onDelete: (id: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

function getCategoryEmoji(categoryName: string, type: 'income' | 'expense'): string {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const category = categories.find(c => c.name === categoryName);
  return category?.emoji || '📌';
}

export function RecentTransactions({ transactions, onViewAll, onDelete }: RecentTransactionsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (itemsRef.current.length > 0) {
      gsap.fromTo(
        itemsRef.current.filter(Boolean),
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: 'power2.out',
          stagger: 0.05,
        }
      );
    }
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: 'rgba(20, 20, 20, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <p className="text-zinc-500 text-sm">No transactions yet</p>
        <p className="text-zinc-600 text-xs mt-1">Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(20, 20, 20, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Recent</h2>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-[#c8f000]"
          style={{ color: '#c8f000' }}
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      <div ref={listRef} className="space-y-3">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            ref={el => {
              if (el) itemsRef.current[index] = el;
            }}
            className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-zinc-800/50 group"
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(200, 240, 0, 0.3), rgba(200, 240, 0, 0.1))',
              }}
            >
              {getCategoryEmoji(transaction.category, transaction.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{transaction.description}</p>
              <p className="text-xs text-zinc-500">
                {transaction.category} • {formatDate(transaction.date)}
              </p>
            </div>

            {/* Amount */}
            <div className="text-right">
              <p
                className={`text-sm font-semibold ${
                  transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
            </div>

            {/* Delete Button (visible on hover) */}
            <button
              onClick={() => onDelete(transaction.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-500/20"
            >
              <span className="text-red-400 text-xs">Delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
