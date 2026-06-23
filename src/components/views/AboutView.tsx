import React from 'react';
import { Target, Users, Shield, TrendingUp, Globe, Award, ArrowRight } from 'lucide-react';
import { ViewType } from '@/types';
import NewsletterSection from '@/components/NewsletterSection';

interface AboutViewProps {
  onNavigate: (view: ViewType) => void;
}

const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We only present opportunities we would invest in ourselves. Every listing undergoes rigorous due diligence.',
    },
    {
      icon: TrendingUp,
      title: 'Research-Driven',
      description: 'Our analysis is grounded in data, not hype. We provide investor-grade intelligence for informed decisions.',
    },
    {
      icon: Globe,
      title: 'Global Perspective',
      description: 'Built for international investors navigating African markets from anywhere in the world.',
    },
    {
      icon: Users,
      title: 'Aligned Interests',
      description: 'We earn through commissions when deals close, not listing fees. Our success depends on yours.',
    },
  ];

  const team = [
    {
      name: 'Editorial Team',
      role: 'Research & Analysis',
      description: 'Our editorial team brings decades of combined experience in African real estate, finance, and journalism.',
    },
    {
      name: 'Advisory Network',
      role: 'Legal & Compliance',
      description: 'A network of legal professionals across Kenya and East Africa ensuring every listing meets regulatory standards.',
    },
    {
      name: 'Partner Agents',
      role: 'On-Ground Expertise',
      description: 'Vetted real estate professionals providing local market knowledge and property verification.',
    },
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Hero */}
      <section className="py-16 md:py-24 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            className="text-white text-3xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            About The African Property Brief
          </h1>
          <p 
            className="text-white/70 text-lg md:text-xl leading-relaxed"
            style={{ fontFamily: 'Kaisei Opti, serif', lineHeight: 1.7 }}
          >
            We're not a marketplace. We're not a brokerage. We're a research-driven real estate 
            intelligence platform built for serious investors navigating African property markets.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eaae31]/10 text-[#eaae31] text-sm mb-6">
                <Target className="w-4 h-4" />
                <span style={{ fontFamily: 'Kaisei Opti, serif' }}>Our Mission</span>
              </div>
              <h2 
                className="text-white text-2xl md:text-3xl font-bold mb-6"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Democratizing Access to African Real Estate Intelligence
              </h2>
              <p 
                className="text-white/70 text-lg mb-6 leading-relaxed"
                style={{ fontFamily: 'Kaisei Opti, serif', lineHeight: 1.7 }}
              >
                For too long, quality information about African property markets has been locked away 
                in expensive reports or scattered across unreliable sources. We're changing that.
              </p>
              <p 
                className="text-white/70 text-lg leading-relaxed"
                style={{ fontFamily: 'Kaisei Opti, serif', lineHeight: 1.7 }}
              >
                The African Property Brief publishes investor-grade analysis, curates vetted property 
                opportunities, and educates investors on how African real estate actually works—from 
                capital behavior to trust structures to deal risk.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=800"
                alt="Nairobi Skyline"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#eaae31] rounded-xl p-6 shadow-xl">
                <p 
                  className="text-[#2a4347] text-3xl font-bold"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Since 2020
                </p>
                <p 
                  className="text-[#2a4347]/70 text-sm"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Serving global investors
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-16 md:py-24 bg-[#1e3235]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-white text-2xl md:text-3xl font-bold mb-4"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Who We Serve
            </h2>
            <p 
              className="text-white/60 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Our platform is built for professionals who take real estate investment seriously.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'International Investors', desc: 'Seeking exposure to African property markets with confidence.' },
              { title: 'Diaspora Buyers', desc: 'Building property portfolios back home while living abroad.' },
              { title: 'Global Real Estate Agents', desc: 'Serving clients interested in African opportunities.' },
              { title: 'High-End Property Advisors', desc: 'Requiring reliable intelligence for their clients.' },
            ].map((item, index) => (
              <div 
                key={index}
                className="p-6 bg-[#2a4347] rounded-xl border border-white/5"
              >
                <h3 
                  className="text-white text-lg font-semibold mb-2"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-white/60 text-sm"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-white text-2xl md:text-3xl font-bold mb-4"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Our Values
            </h2>
            <p 
              className="text-white/60 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="p-8 bg-[#1e3235] rounded-xl border border-white/5 hover:border-[#eaae31]/30 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-[#eaae31]/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-[#eaae31]" />
                </div>
                <h3 
                  className="text-white text-xl font-semibold mb-3"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {value.title}
                </h3>
                <p 
                  className="text-white/60 leading-relaxed"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="py-16 md:py-24 bg-[#1e3235]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-12 h-12 text-[#eaae31] mx-auto mb-6" />
          <h2 
            className="text-white text-2xl md:text-3xl font-bold mb-6"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Our Business Model
          </h2>
          <p 
            className="text-white/70 text-lg leading-relaxed mb-8"
            style={{ fontFamily: 'Kaisei Opti, serif', lineHeight: 1.7 }}
          >
            We earn through commissions when deals close, not listing fees. This means we're only 
            successful when you are. We have no incentive to push unsuitable properties—our revenue 
            depends on presenting opportunities that actually work for our readers.
          </p>
          <p 
            className="text-white/60 text-base"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            This alignment of interests is fundamental to everything we do.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-white text-2xl md:text-3xl font-bold mb-4"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Our Team
            </h2>
            <p 
              className="text-white/60 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              A distributed team of researchers, analysts, and real estate professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <div 
                key={index}
                className="p-6 bg-[#1e3235] rounded-xl border border-white/5"
              >
                <h3 
                  className="text-white text-lg font-semibold mb-1"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {member.name}
                </h3>
                <p 
                  className="text-[#eaae31] text-sm mb-3"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {member.role}
                </p>
                <p 
                  className="text-white/60 text-sm"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#2a4347] to-[#1e3235]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-white text-2xl md:text-3xl font-bold mb-6"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Ready to Explore?
          </h2>
          <p 
            className="text-white/70 text-lg mb-8"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Browse our vetted listings or dive into our research library.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => onNavigate('listings')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#eaae31] text-[#2a4347] font-semibold rounded-lg hover:bg-[#eaae31]/90 transition-colors"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              <span>View Listings</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('blog')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              <span>Read Insights</span>
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
};

export default AboutView;
