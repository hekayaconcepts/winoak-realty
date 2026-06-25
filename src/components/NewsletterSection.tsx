import React, { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { subscribeToNewsletter } from '@/hooks/useData';

interface NewsletterSectionProps {
  variant?: 'default' | 'minimal' | 'hero';
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({ variant = 'default' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      await subscribeToNewsletter(email, undefined, 'newsletter-section');
      setStatus('success');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to subscribe. Please try again.');
    }
  };

  if (variant === 'minimal') {
    return (
      <div className="bg-[#5c090f] rounded-xl p-6 border border-white/5">
        <h3 
          className="text-white text-lg font-semibold mb-2"
          style={{ fontFamily: 'Kaisei Opti, serif' }}
        >
          Stay Informed
        </h3>
        <p 
          className="text-white/60 text-sm mb-4"
          style={{ fontFamily: 'Kaisei Opti, serif' }}
        >
          Weekly insights delivered to your inbox.
        </p>
        
        {status === 'success' ? (
          <div className="flex items-center gap-2 text-green-400">
            <Check className="w-5 h-5" />
            <span style={{ fontFamily: 'Kaisei Opti, serif' }}>Subscribed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#febd14] transition-colors"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 bg-[#febd14] text-[#5c090f] rounded-lg hover:bg-[#febd14]/90 transition-colors disabled:opacity-50"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-xs mt-2">{errorMessage}</p>
        )}
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <section className="py-20 md:py-28 bg-gradient-to-br from-[#5c090f] via-[#5c090f] to-[#5c090f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#febd14]/10 text-[#febd14] text-sm mb-6">
            <Mail className="w-4 h-4" />
            <span style={{ fontFamily: 'Kaisei Opti, serif' }}>Join 15,000+ investors</span>
          </div>

          <h2 
            className="text-white text-3xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            The Weekly Brief
          </h2>
          
          <p 
            className="text-white/70 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: 'Kaisei Opti, serif', lineHeight: 1.7 }}
          >
            Investor-grade analysis of African real estate markets, delivered every Thursday. 
            No hype. No spam. Just intelligence.
          </p>

          {status === 'success' ? (
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-green-500/10 text-green-400">
              <Check className="w-6 h-6" />
              <span 
                className="text-lg font-medium"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                You're subscribed! Check your inbox.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-base focus:outline-none focus:border-[#febd14] transition-colors"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-4 bg-[#febd14] text-[#5c090f] text-base font-semibold rounded-xl hover:bg-[#febd14]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                {status !== 'loading' && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          )}
          
          {status === 'error' && (
            <p className="text-red-400 text-sm mt-4">{errorMessage}</p>
          )}

          <p 
            className="text-white/40 text-sm mt-6"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Unsubscribe anytime. We respect your inbox.
          </p>
        </div>
      </section>
    );
  }

  // Default variant
  return (
    <section className="py-16 md:py-20 bg-[#5c090f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 
              className="text-white text-2xl md:text-3xl font-bold mb-4"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Get The Weekly Brief
            </h2>
            <p 
              className="text-white/70 text-base md:text-lg"
              style={{ fontFamily: 'Kaisei Opti, serif', lineHeight: 1.7 }}
            >
              Join thousands of investors receiving our weekly analysis of African property markets. 
              Data-driven insights, no fluff.
            </p>
          </div>
          
          <div>
            {status === 'success' ? (
              <div className="flex items-center gap-3 p-6 rounded-xl bg-green-500/10 text-green-400">
                <Check className="w-6 h-6" />
                <span 
                  className="text-lg font-medium"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Successfully subscribed!
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-base focus:outline-none focus:border-[#febd14] transition-colors"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-8 py-4 bg-[#febd14] text-[#5c090f] text-base font-semibold rounded-xl hover:bg-[#febd14]/90 transition-colors disabled:opacity-50"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-sm mt-3">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
