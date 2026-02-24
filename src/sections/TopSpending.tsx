import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EXPENSE_CATEGORIES } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface TopSpendingProps {
  topSpending: { category: string; amount: number }[];
  totalExpense: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

function getCategoryEmoji(categoryName: string): string {
  const category = EXPENSE_CATEGORIES.find(c => c.name === categoryName);
  return category?.emoji || '📌';
}

export function TopSpending({ topSpending, totalExpense }: TopSpendingProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (sectionRef.current && barsRef.current.length > 0) {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 80%',
          onEnter: () => {
            barsRef.current.forEach((bar, index) => {
              if (bar) {
                const width = bar.dataset.width || '0%';
                gsap.fromTo(
                  bar,
                  { width: '0%' },
                  {
                    width,
                    duration: 0.8,
                    ease: 'power2.out',
                    delay: index * 0.1,
                  }
                );
              }
            });
          },
          once: true,
        });
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [topSpending]);

  if (topSpending.length === 0) {
    return null;
  }

  const maxAmount = Math.max(...topSpending.map(s => s.amount));

  return (
    <div
      ref={sectionRef}
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(20, 20, 20, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">Top Spending</h2>
        <span
          className="text-xs font-medium px-3 py-1 rounded-full"
          style={{
            background: 'rgba(200, 240, 0, 0.15)',
            color: '#c8f000',
          }}
        >
          This Month
        </span>
      </div>

      {/* Bars */}
      <div className="space-y-4">
        {topSpending.map((item, index) => {
          const percentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
          const percentOfTotal = totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0;

          return (
            <div key={item.category} className="group">
              {/* Label Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryEmoji(item.category)}</span>
                  <span className="text-sm font-medium text-zinc-300">{item.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-white">{formatCurrency(item.amount)}</span>
                  <span className="text-xs text-zinc-500 ml-2">({percentOfTotal.toFixed(0)}%)</span>
                </div>
              </div>

              {/* Bar */}
              <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  ref={el => {
                    if (el) barsRef.current[index] = el;
                  }}
                  data-width={`${percentage}%`}
                  className="h-full rounded-full"
                  style={{
                    width: '0%',
                    background: 'linear-gradient(90deg, #c8f000, #9bc400)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
