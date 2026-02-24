import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Wallet, TrendingUp, Shield, Zap, ArrowRight, User, Mail } from 'lucide-react';

interface LandingPageProps {
  onSignIn: (email: string, name: string) => Promise<void>;
}

export function LandingPage({ onSignIn }: LandingPageProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 }
      );
      gsap.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.4 }
      );
      gsap.fromTo(
        '.hero-form',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.6 }
      );
      gsap.fromTo(
        '.feature-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1, delay: 0.8 }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    setIsSubmitting(true);
    await onSignIn(email.trim(), name.trim());
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: '#c8f000',
                boxShadow: '0 0 40px rgba(200, 240, 0, 0.3)',
              }}
            >
              <Wallet className="w-7 h-7 text-black" />
            </div>
            <span className="text-3xl font-bold tracking-tight">KAKK HEAN</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="hero-title text-4xl md:text-6xl font-bold text-center mb-4 max-w-2xl">
          Take Control of Your{' '}
          <span style={{ color: '#c8f000' }}>Finances</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-lg md:text-xl text-zinc-400 text-center mb-10 max-w-md">
          Track income, monitor expenses, and build wealth with our cinematic finance experience.
        </p>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="hero-form w-full max-w-sm space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-zinc-500 focus:border-[#c8f000] transition-colors"
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-zinc-500 focus:border-[#c8f000] transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="cinematic-btn w-full py-4 rounded-xl flex items-center justify-center gap-2 text-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Get Started'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Features */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 w-full max-w-3xl">
          <div className="feature-card p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <TrendingUp className="w-8 h-8 mb-3" style={{ color: '#c8f000' }} />
            <h3 className="font-semibold mb-1">Track Everything</h3>
            <p className="text-sm text-zinc-500">Income, expenses, and spending patterns</p>
          </div>
          <div className="feature-card p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <Shield className="w-8 h-8 mb-3" style={{ color: '#c8f000' }} />
            <h3 className="font-semibold mb-1">Private & Secure</h3>
            <p className="text-sm text-zinc-500">Your data stays on your device</p>
          </div>
          <div className="feature-card p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <Zap className="w-8 h-8 mb-3" style={{ color: '#c8f000' }} />
            <h3 className="font-semibold mb-1">Lightning Fast</h3>
            <p className="text-sm text-zinc-500">Add transactions in seconds</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-zinc-600 text-sm">
        <p>© 2026 KAKK HEAN. All rights reserved.</p>
      </footer>
    </div>
  );
}
