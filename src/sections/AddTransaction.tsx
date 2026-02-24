import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Plus, DollarSign, Calendar, FileText, Tag } from 'lucide-react';
import type { TransactionType } from '@/types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types';

interface AddTransactionProps {
  onAdd: (transaction: {
    type: TransactionType;
    amount: number;
    description: string;
    category: string;
    date: string;
  }) => Promise<void>;
}

export function AddTransaction({ onAdd }: AddTransactionProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const formRef = useRef<HTMLDivElement>(null);
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  // Reset category when type changes
  useEffect(() => {
    setCategory('');
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }
    if (!category) {
      setError('Please select a category');
      return;
    }

    setIsSubmitting(true);

    try {
      await onAdd({
        type,
        amount: parseFloat(amount),
        description: description.trim(),
        category,
        date,
      });

      // Reset form
      setAmount('');
      setDescription('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (err) {
      setError('Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={formRef}
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(20, 20, 20, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <h2 className="text-xl font-bold text-white mb-5">Add Transaction</h2>

      {/* Type Toggle */}
      <div className="flex gap-2 mb-6 p-1 rounded-xl bg-zinc-800/50">
        <button
          type="button"
          onClick={() => setType('income')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            type === 'income'
              ? 'text-white'
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
          style={{
            background:
              type === 'income'
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.1))'
                : 'transparent',
            border:
              type === 'income' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid transparent',
          }}
        >
          Income
        </button>
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            type === 'expense'
              ? 'text-white'
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
          style={{
            background:
              type === 'expense'
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1))'
                : 'transparent',
            border:
              type === 'expense' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent',
          }}
        >
          Expense
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider mb-2">
            <DollarSign className="w-4 h-4" />
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl py-3 pl-8 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f000] transition-colors"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4" />
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What was this for?"
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f000] transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider mb-2">
            <Tag className="w-4 h-4" />
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.name)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 ${
                  category === cat.name
                    ? 'scale-105'
                    : 'hover:bg-zinc-800/50'
                }`}
                style={{
                  background:
                    category === cat.name
                      ? 'linear-gradient(135deg, rgba(200, 240, 0, 0.2), rgba(200, 240, 0, 0.05))'
                      : 'rgba(39, 39, 42, 0.5)',
                  border:
                    category === cat.name
                      ? '1px solid rgba(200, 240, 0, 0.5)'
                      : '1px solid rgba(63, 63, 70, 0.5)',
                }}
              >
                <span className="text-xl">{cat.emoji}</span>
                <span className="text-xs text-zinc-300">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider mb-2">
            <Calendar className="w-4 h-4" />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#c8f000] transition-colors"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="cinematic-btn w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          {isSubmitting ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}
