import React, { useState } from 'react';
import { Check, Crown, Building2, Zap, Shield, Clock, Users, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ViewType } from '@/types';

interface PricingViewProps {
  onNavigate: (view: ViewType) => void;
  isAuthenticated: boolean;
  userEmail?: string;
  onAuthClick: () => void;
}

const PricingView: React.FC<PricingViewProps> = ({
  onNavigate,
  isAuthenticated,
  userEmail,
  onAuthClick,
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'forever',
      description: 'Basic access to public content',
      features: [
        'Browse public listings',
        'Read blog articles',
        'Weekly newsletter',
        'Podcast access',
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      id: 'investor-pro',
      name: 'Investor Pro',
      price: 49,
      interval: 'month',
      description: 'For serious individual investors',
      features: [
        'Everything in Free',
        'Full deal analysis reports',
        'Early listing notifications',
        'Monthly market briefings',
        'Save unlimited listings',
        'Priority email support',
        'Downloadable PDF reports',
      ],
      cta: 'Upgrade Now',
      popular: true,
    },
    {
      id: 'institutional',
      name: 'Institutional',
      price: 199,
      interval: 'month',
      description: 'For firms and high-volume investors',
      features: [
        'Everything in Investor Pro',
        'Direct consultation booking',
        'Custom research requests',
        'Dedicated account manager',
        'API access for data',
        'White-label reports',
        'Multi-user accounts',
        'Quarterly strategy calls',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') return;
    
    if (!isAuthenticated) {
      onAuthClick();
      return;
    }

    setLoading(planId);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          action: 'create-checkout',
          planId,
          email: userEmail,
          successUrl: `${window.location.origin}/?view=dashboard&subscription=success`,
          cancelUrl: `${window.location.origin}/?view=pricing&subscription=cancelled`,
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.message || 'Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Header */}
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#febd14]/10 text-[#febd14] text-sm mb-6">
            <Crown className="w-4 h-4" />
            <span style={{ fontFamily: 'Kaisei Opti, serif' }}>Premium Membership</span>
          </div>
          
          <h1 
            className="text-white text-3xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Invest with Confidence
          </h1>
          
          <p 
            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto"
            style={{ fontFamily: 'Kaisei Opti, serif', lineHeight: 1.7 }}
          >
            Unlock exclusive deal analysis, early access to listings, and direct consultation 
            with our research team. Choose the plan that fits your investment strategy.
          </p>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="p-4 rounded-lg bg-red-500/10 text-red-400 text-center">
            {error}
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative p-6 md:p-8 rounded-2xl border transition-all ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-[#febd14]/10 to-[#5c090f] border-[#febd14]/50 scale-105' 
                    : 'bg-[#5c090f] border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span 
                      className="px-4 py-1 rounded-full bg-[#febd14] text-[#5c090f] text-sm font-semibold"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 
                    className="text-white text-xl font-bold mb-2"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    {plan.name}
                  </h3>
                  <p 
                    className="text-white/60 text-sm"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span 
                      className="text-white text-4xl font-bold"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span 
                        className="text-white/60 text-sm"
                        style={{ fontFamily: 'Kaisei Opti, serif' }}
                      >
                        /{plan.interval}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#febd14] flex-shrink-0 mt-0.5" />
                      <span 
                        className="text-white/80 text-sm"
                        style={{ fontFamily: 'Kaisei Opti, serif' }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id || plan.id === 'free'}
                  className={`w-full py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-[#febd14] text-[#5c090f] hover:bg-[#febd14]/90'
                      : plan.id === 'free'
                      ? 'bg-white/5 text-white/40 cursor-default'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  } disabled:opacity-50`}
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {loading === plan.id ? (
                    'Processing...'
                  ) : (
                    <>
                      <span>{plan.cta}</span>
                      {plan.id !== 'free' && <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 bg-[#5c090f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-white text-2xl md:text-3xl font-bold text-center mb-12"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            What Premium Members Get
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Early Access', desc: 'Be first to know about new listings before public release' },
              { icon: Shield, title: 'Due Diligence', desc: 'Comprehensive deal analysis with risk assessments' },
              { icon: Clock, title: 'Priority Support', desc: 'Direct access to our research team within 24 hours' },
              { icon: Users, title: 'Consultations', desc: 'Book 1-on-1 calls with investment advisors' },
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-[#5c090f] rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-[#febd14]/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#febd14]" />
                </div>
                <h3 
                  className="text-white font-semibold mb-2"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-white/60 text-sm"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-white text-2xl md:text-3xl font-bold text-center mb-12"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. You\'ll retain access until the end of your billing period.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards through our secure Stripe payment processor.' },
              { q: 'Is there a free trial?', a: 'We offer a 7-day money-back guarantee on all premium plans. If you\'re not satisfied, contact us for a full refund.' },
              { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, you can change your plan at any time. Changes take effect at the start of your next billing cycle.' },
            ].map((faq, index) => (
              <div key={index} className="p-6 bg-[#5c090f] rounded-xl border border-white/5">
                <h3 
                  className="text-white font-semibold mb-2"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {faq.q}
                </h3>
                <p 
                  className="text-white/60 text-sm"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingView;
