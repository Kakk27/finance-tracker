import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import gsap from 'gsap';

interface BalanceCardProps {
  netBalance: number;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function AnimatedNumber({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startValue = 0;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeOut;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{formatCurrency(displayValue)}</span>;
}

export function BalanceCard({ netBalance, totalIncome, totalExpense, transactionCount }: BalanceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-2xl p-6"
      style={{
        background: 'linear-gradient(135deg, rgba(200, 240, 0, 0.15), rgba(200, 240, 0, 0.05))',
        border: '1px solid rgba(200, 240, 0, 0.3)',
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl"
        style={{ background: '#c8f000' }}
      />

      <div className="relative z-10">
        {/* Net Balance */}
        <div className="text-center mb-6">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">
            Net Balance
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold"
            style={{ color: '#c8f000' }}
          >
            <AnimatedNumber value={netBalance} />
          </h1>
        </div>

        {/* Income & Expense Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Income */}
          <div
            className="rounded-xl p-4"
            style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-zinc-400 uppercase tracking-wider">Income</span>
            </div>
            <p className="text-lg font-semibold text-green-400">
              +{formatCurrency(totalIncome)}
            </p>
          </div>

          {/* Expense */}
          <div
            className="rounded-xl p-4"
            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-xs text-zinc-400 uppercase tracking-wider">Expense</span>
            </div>
            <p className="text-lg font-semibold text-red-400">
              -{formatCurrency(totalExpense)}
            </p>
          </div>
        </div>

        {/* Transaction Count */}
        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-zinc-800">
          <Receipt className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-400">
            {transactionCount} transaction{transactionCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
