import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Trash2, Calendar } from 'lucide-react';
import type { Transaction, TransactionType } from '@/types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types';

interface HistoryProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function getCategoryEmoji(categoryName: string, type: 'income' | 'expense'): string {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const category = categories.find(c => c.name === categoryName);
  return category?.emoji || '📌';
}

function groupByDate(transactions: Transaction[]): Record<string, Transaction[]> {
  return transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);
}

export function History({ transactions, onDelete }: HistoryProps) {
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  const listRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  const filteredTransactions =
    filter === 'all' ? transactions : transactions.filter(t => t.type === filter);

  const grouped = groupByDate(filteredTransactions);
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  useEffect(() => {
    if (itemsRef.current.length > 0) {
      gsap.fromTo(
        itemsRef.current.filter(Boolean),
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
          stagger: 0.03,
        }
      );
    }
  }, [filter, transactions]);

  const getDateLabel = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(200, 240, 0, 0.2), rgba(200, 240, 0, 0.05))',
          }}
        >
          <Calendar className="w-10 h-10 text-[#c8f000]" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">No transactions yet</h3>
        <p className="text-sm text-zinc-500">Start by adding your first transaction</p>
      </div>
    );
  }

  let itemIndex = 0;

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'income', 'expense'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
              filter === tab ? 'text-black' : 'text-zinc-400 hover:text-zinc-300'
            }`}
            style={{
              background:
                filter === tab
                  ? '#c8f000'
                  : 'rgba(39, 39, 42, 0.5)',
              border:
                filter === tab ? '1px solid #c8f000' : '1px solid rgba(63, 63, 70, 0.5)',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div ref={listRef} className="space-y-6">
        {sortedDates.map(date => (
          <div key={date}>
            {/* Date Header */}
            <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-sm py-2">
              {getDateLabel(date)}
            </h3>

            {/* Transactions for this date */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(20, 20, 20, 0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {grouped[date].map((transaction, idx) => {
                const currentIndex = itemIndex++;
                const isLast = idx === grouped[date].length - 1;

                return (
                  <div
                    key={transaction.id}
                    ref={el => {
                      if (el) itemsRef.current[currentIndex] = el;
                    }}
                    className={`flex items-center gap-3 p-4 transition-all duration-200 hover:bg-zinc-800/30 group ${
                      !isLast ? 'border-b border-zinc-800' : ''
                    }`}
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
                      <p className="text-sm font-medium text-white truncate">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-zinc-500">{transaction.category}</p>
                    </div>

                    {/* Amount */}
                    <div className="text-right mr-2">
                      <p
                        className={`text-sm font-semibold ${
                          transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500">No {filter} transactions found</p>
        </div>
      )}
    </div>
  );
}
