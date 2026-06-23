import React from 'react';
import { ArrowRight, TrendingUp, Shield, Globe, FileText, Building2, Users } from 'lucide-react';
import { Property, Article, Podcast, ViewType } from '@/types';
import PropertyCard from '@/components/PropertyCard';
import ArticleCard from '@/components/ArticleCard';
import PodcastCard from '@/components/PodcastCard';
import NewsletterSection from '@/components/NewsletterSection';

interface HomeViewProps {
  properties: Property[];
  articles: Article[];
  podcasts: Podcast[];
  onNavigate: (view: ViewType) => void;
  onViewProperty: (property: Property) => void;
  onReadArticle: (article: Article) => void;
  onPlayPodcast: (podcast: Podcast) => void;
}

const HomeView: React.FC<HomeViewProps> = ({
  properties,
  articles,
  podcasts,
  onNavigate,
  onViewProperty,
  onReadArticle,
  onPlayPodcast,
}) => {
  const featuredProperties = properties.filter(p => p.featured).slice(0, 3);
  const featuredArticles = articles.filter(a => a.featured).slice(0, 4);
  const latestPodcast = podcasts[0];

  const stats = [
    { label: 'Properties Analyzed', value: '500+' },
    { label: 'Countries Covered', value: '12' },
    { label: 'Investors Served', value: '15K+' },
    { label: 'Deal Volume', value: '$2.5B' },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Market Intelligence',
      description: 'Data-driven analysis of African property markets with actionable insights for informed decision-making.',
    },
    {
      icon: Shield,
      title: 'Vetted Opportunities',
      description: 'Every listing undergoes rigorous due diligence. We only present opportunities we would invest in ourselves.',
    },
    {
      icon: Globe,
      title: 'Diaspora-Focused',
      description: 'Built for international investors and diaspora buyers navigating African real estate from abroad.',
    },
    {
      icon: FileText,
      title: 'Deal Analysis',
      description: 'Comprehensive breakdowns of investment opportunities including risk assessment and return projections.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1920"
            alt="Nairobi Skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a4347]/95 via-[#2a4347]/80 to-[#2a4347]/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eaae31]/10 text-[#eaae31] text-sm mb-6">
              <Building2 className="w-4 h-4" />
              <span style={{ fontFamily: 'Kaisei Opti, serif' }}>Investor-Grade Intelligence</span>
            </div>

            <h1 
              className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              African Real Estate,{' '}
              <span className="text-[#eaae31]">Decoded.</span>
            </h1>

            <p 
              className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed max-w-2xl"
              style={{ fontFamily: 'Kaisei Opti, serif', lineHeight: 1.7 }}
            >
              Research-driven analysis and vetted property opportunities for international investors, 
              diaspora buyers, and global real estate advisors. No hype. Just intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('listings')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#eaae31] text-[#2a4347] font-semibold rounded-lg hover:bg-[#eaae31]/90 transition-colors"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <span>Explore Listings</span>
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
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[#1e3235] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p 
                  className="text-[#eaae31] text-3xl md:text-4xl font-bold mb-1"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {stat.value}
                </p>
                <p 
                  className="text-white/60 text-sm"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-white text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Why The African Property Brief?
            </h2>
            <p 
              className="text-white/60 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              We're not a marketplace. We're your research partner for African real estate investment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-[#1e3235] rounded-xl border border-white/5 hover:border-[#eaae31]/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#eaae31]/10 flex items-center justify-center mb-4 group-hover:bg-[#eaae31]/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-[#eaae31]" />
                </div>
                <h3 
                  className="text-white text-lg font-semibold mb-2"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-white/60 text-sm leading-relaxed"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section className="py-20 md:py-28 bg-[#1e3235]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <h2 
                  className="text-white text-3xl md:text-4xl font-bold mb-2"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Featured Listings
                </h2>
                <p 
                  className="text-white/60 text-lg"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Vetted opportunities from trusted developers
                </p>
              </div>
              <button
                onClick={() => onNavigate('listings')}
                className="inline-flex items-center gap-2 text-[#eaae31] font-medium hover:gap-3 transition-all"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <span>View All Listings</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onViewDetails={onViewProperty}
                  showSaveButton={false}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Insights */}
      {featuredArticles.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <h2 
                  className="text-white text-3xl md:text-4xl font-bold mb-2"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Latest Insights
                </h2>
                <p 
                  className="text-white/60 text-lg"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Analysis, research, and market intelligence
                </p>
              </div>
              <button
                onClick={() => onNavigate('blog')}
                className="inline-flex items-center gap-2 text-[#eaae31] font-medium hover:gap-3 transition-all"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <span>View All Articles</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Featured Article */}
              {featuredArticles[0] && (
                <ArticleCard
                  article={featuredArticles[0]}
                  onReadMore={onReadArticle}
                  variant="featured"
                  showSaveButton={false}
                />
              )}

              {/* Other Articles */}
              <div className="grid gap-6">
                {featuredArticles.slice(1, 4).map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onReadMore={onReadArticle}
                    variant="compact"
                    showSaveButton={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Podcast */}
      {latestPodcast && (
        <section className="py-20 md:py-28 bg-[#1e3235]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <h2 
                  className="text-white text-3xl md:text-4xl font-bold mb-2"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  The Podcast
                </h2>
                <p 
                  className="text-white/60 text-lg"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Deep dives into African real estate
                </p>
              </div>
              <button
                onClick={() => onNavigate('podcast')}
                className="inline-flex items-center gap-2 text-[#eaae31] font-medium hover:gap-3 transition-all"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <span>All Episodes</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <PodcastCard
              podcast={latestPodcast}
              onPlay={onPlayPodcast}
              variant="featured"
            />
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <NewsletterSection variant="hero" />

      {/* Trust Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="w-12 h-12 text-[#eaae31] mx-auto mb-6" />
          <h2 
            className="text-white text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Built for Serious Investors
          </h2>
          <p 
            className="text-white/70 text-lg leading-relaxed mb-8"
            style={{ fontFamily: 'Kaisei Opti, serif', lineHeight: 1.7 }}
          >
            The African Property Brief serves international investors, diaspora buyers, global real estate agents, 
            and high-end property advisors. We earn through commissions when deals close, not listing fees. 
            This aligns our interests with yours.
          </p>
          <button
            onClick={() => onNavigate('about')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            <span>Learn More About Us</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
