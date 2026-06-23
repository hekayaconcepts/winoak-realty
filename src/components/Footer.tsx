import React, { useState } from 'react';
import { Mail, MapPin, Phone, Linkedin, Twitter } from 'lucide-react';
import { ViewType } from '@/types';
import { subscribeToNewsletter } from '@/hooks/useData';

interface FooterProps {
  onNavigate: (view: ViewType) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribeStatus('loading');
    try {
      await subscribeToNewsletter(email, undefined, 'footer');
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 5000);
    } catch (err: any) {
      setSubscribeStatus('error');
      setErrorMessage(err.message || 'Failed to subscribe. Please try again.');
      setTimeout(() => setSubscribeStatus('idle'), 5000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1e3235] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/696a15fcf7f37ab46f03b95f_1768560149377_0263ab94.png" 
              alt="The African Property Brief" 
              className="h-12 w-auto mb-4"
            />
            <p 
              className="text-white/60 text-sm leading-relaxed mb-6"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Investor-grade real estate intelligence for Kenya and emerging African property markets.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-[#eaae31] hover:bg-white/10 transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-[#eaae31] hover:bg-white/10 transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 
              className="text-[#eaae31] text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', view: 'home' as ViewType },
                { label: 'About Us', view: 'about' as ViewType },
                { label: 'Insights', view: 'blog' as ViewType },
                { label: 'Listings', view: 'listings' as ViewType },
                { label: 'Market Yields', view: 'market-yields' as ViewType },
                { label: 'Podcast', view: 'podcast' as ViewType },
                { label: 'Contact', view: 'contact' as ViewType },
              ].map((item) => (
                <li key={item.view}>
                  <button
                    onClick={() => onNavigate(item.view)}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>


          {/* Categories */}
          <div>
            <h4 
              className="text-[#eaae31] text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Categories
            </h4>
            <ul className="space-y-3">
              {[
                'Deal Analysis',
                'Legal Insights',
                'Market Intelligence',
                'Capital Behavior',
              ].map((category) => (
                <li key={category}>
                  <button
                    onClick={() => onNavigate('blog')}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 
              className="text-[#eaae31] text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Newsletter
            </h4>
            <p 
              className="text-white/60 text-sm mb-4"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Get weekly insights delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#eaae31] transition-colors"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              />
              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="w-full px-4 py-3 bg-[#eaae31] text-[#2a4347] text-sm font-semibold rounded-lg hover:bg-[#eaae31]/90 transition-colors disabled:opacity-50"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
              {subscribeStatus === 'success' && (
                <p className="text-green-400 text-xs">Successfully subscribed!</p>
              )}
              {subscribeStatus === 'error' && (
                <p className="text-red-400 text-xs">{errorMessage}</p>
              )}
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span style={{ fontFamily: 'Kaisei Opti, serif' }}>Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span style={{ fontFamily: 'Kaisei Opti, serif' }}>hello@africanpropertybrief.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p 
            className="text-white/40 text-sm"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            © {currentYear} The African Property Brief. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button 
              className="text-white/40 hover:text-white/60 text-sm transition-colors"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Privacy Policy
            </button>
            <button 
              className="text-white/40 hover:text-white/60 text-sm transition-colors"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
