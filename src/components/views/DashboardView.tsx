import React, { useState } from 'react';
import { 
  Building2, BookOpen, Headphones, Bookmark, TrendingUp, 
  ArrowRight, Clock, MapPin, Bell, BarChart3, Settings
} from 'lucide-react';
import { Property, Article, Podcast, Category, ViewType } from '@/types';
import PropertyCard from '@/components/PropertyCard';
import ArticleCard from '@/components/ArticleCard';
import NotificationPreferences from '@/components/NotificationPreferences';

interface DashboardViewProps {
  properties: Property[];
  articles: Article[];
  podcasts: Podcast[];
  categories: Category[];
  savedPropertyIds: string[];
  savedArticleIds: string[];
  onNavigate: (view: ViewType) => void;
  onViewProperty: (property: Property) => void;
  onReadArticle: (article: Article) => void;
  onSaveProperty: (property: Property) => void;
  onSaveArticle: (article: Article) => void;
  userName?: string;
  userId?: string;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  properties,
  articles,
  podcasts,
  categories,
  savedPropertyIds,
  savedArticleIds,
  onNavigate,
  onViewProperty,
  onReadArticle,
  onSaveProperty,
  onSaveArticle,
  userName,
  userId,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notifications'>('overview');
  const savedProperties = properties.filter(p => savedPropertyIds.includes(p.id));
  const savedArticles = articles.filter(a => savedArticleIds.includes(a.id));
  const recentProperties = properties.slice(0, 3);
  const recentArticles = articles.slice(0, 3);

  const stats = [
    { label: 'Saved Listings', value: savedPropertyIds.length, icon: Building2, color: 'text-blue-400', action: () => onNavigate('saved-listings') },
    { label: 'Saved Articles', value: savedArticleIds.length, icon: BookOpen, color: 'text-green-400', action: () => onNavigate('saved-articles') },
    { label: 'Podcast Episodes', value: podcasts.length, icon: Headphones, color: 'text-purple-400', action: () => onNavigate('audio-library') },
    { label: 'Market Areas', value: '27+', icon: BarChart3, color: 'text-[#febd14]', action: () => onNavigate('market-yields') },
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Header */}
      <section className="py-8 md:py-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 
                className="text-white text-2xl md:text-3xl font-bold mb-2"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Welcome back{userName ? `, ${userName}` : ''}
              </h1>
              <p 
                className="text-white/60"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Your personalized real estate intelligence dashboard
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-[#febd14] text-[#5c090f]' 
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                }`}
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'notifications' 
                    ? 'bg-[#febd14] text-[#5c090f]' 
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                }`}
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <Bell className="w-4 h-4" />
                Notifications
              </button>
            </div>
          </div>
        </div>
      </section>

      {activeTab === 'notifications' && userId ? (
        <section className="py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <NotificationPreferences userId={userId} categories={categories} />
          </div>
        </section>
      ) : (
        <>
          {/* Stats */}
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    onClick={stat.action}
                    className="p-5 md:p-6 bg-[#5c090f] rounded-xl border border-white/5 cursor-pointer hover:border-[#febd14]/30 transition-all group"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/5 flex items-center justify-center ${stat.color} group-hover:bg-white/10 transition-colors`}>
                        <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <p 
                          className="text-white text-xl md:text-2xl font-bold"
                          style={{ fontFamily: 'Kaisei Opti, serif' }}
                        >
                          {stat.value}
                        </p>
                        <p 
                          className="text-white/60 text-xs md:text-sm"
                          style={{ fontFamily: 'Kaisei Opti, serif' }}
                        >
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => onNavigate('market-yields')}
                  className="p-4 bg-[#febd14]/10 border border-[#febd14]/20 rounded-xl hover:bg-[#febd14]/15 transition-colors text-left group"
                >
                  <BarChart3 className="w-5 h-5 text-[#febd14] mb-2" />
                  <p className="text-white text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>Market Yields</p>
                  <p className="text-white/40 text-xs mt-0.5" style={{ fontFamily: 'Kaisei Opti, serif' }}>Live dashboard</p>
                </button>
                <button
                  onClick={() => onNavigate('listings')}
                  className="p-4 bg-blue-400/10 border border-blue-400/20 rounded-xl hover:bg-blue-400/15 transition-colors text-left group"
                >
                  <Building2 className="w-5 h-5 text-blue-400 mb-2" />
                  <p className="text-white text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>Browse Listings</p>
                  <p className="text-white/40 text-xs mt-0.5" style={{ fontFamily: 'Kaisei Opti, serif' }}>New opportunities</p>
                </button>
                <button
                  onClick={() => onNavigate('blog')}
                  className="p-4 bg-green-400/10 border border-green-400/20 rounded-xl hover:bg-green-400/15 transition-colors text-left group"
                >
                  <BookOpen className="w-5 h-5 text-green-400 mb-2" />
                  <p className="text-white text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>Read Insights</p>
                  <p className="text-white/40 text-xs mt-0.5" style={{ fontFamily: 'Kaisei Opti, serif' }}>Latest research</p>
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="p-4 bg-purple-400/10 border border-purple-400/20 rounded-xl hover:bg-purple-400/15 transition-colors text-left group"
                >
                  <Settings className="w-5 h-5 text-purple-400 mb-2" />
                  <p className="text-white text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>Email Alerts</p>
                  <p className="text-white/40 text-xs mt-0.5" style={{ fontFamily: 'Kaisei Opti, serif' }}>Set preferences</p>
                </button>
              </div>
            </div>
          </section>

          {/* Saved Listings */}
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="text-white text-xl font-semibold"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Saved Listings
                </h2>
                {savedProperties.length > 0 && (
                  <button
                    onClick={() => onNavigate('saved-listings')}
                    className="flex items-center gap-2 text-[#febd14] text-sm hover:gap-3 transition-all"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {savedProperties.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedProperties.slice(0, 3).map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onViewDetails={onViewProperty}
                      onSave={onSaveProperty}
                      isSaved={true}
                      showSaveButton={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-[#5c090f] rounded-xl border border-white/5 text-center">
                  <Bookmark className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <h3 
                    className="text-white font-semibold mb-2"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    No saved listings yet
                  </h3>
                  <p 
                    className="text-white/60 text-sm mb-4"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    Browse our listings and save the ones you're interested in
                  </p>
                  <button
                    onClick={() => onNavigate('listings')}
                    className="px-6 py-3 bg-[#febd14] text-[#5c090f] font-semibold rounded-lg hover:bg-[#febd14]/90 transition-colors"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    Browse Listings
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Saved Articles */}
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 
                  className="text-white text-xl font-semibold"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Saved Articles
                </h2>
                {savedArticles.length > 0 && (
                  <button
                    onClick={() => onNavigate('saved-articles')}
                    className="flex items-center gap-2 text-[#febd14] text-sm hover:gap-3 transition-all"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {savedArticles.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedArticles.slice(0, 3).map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onReadMore={onReadArticle}
                      onSave={onSaveArticle}
                      isSaved={true}
                      showSaveButton={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-[#5c090f] rounded-xl border border-white/5 text-center">
                  <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <h3 
                    className="text-white font-semibold mb-2"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    No saved articles yet
                  </h3>
                  <p 
                    className="text-white/60 text-sm mb-4"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    Save articles to read later
                  </p>
                  <button
                    onClick={() => onNavigate('blog')}
                    className="px-6 py-3 bg-[#febd14] text-[#5c090f] font-semibold rounded-lg hover:bg-[#febd14]/90 transition-colors"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    Browse Articles
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="py-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 
                className="text-white text-xl font-semibold mb-6"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Latest on WinOak Realty
              </h2>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Listings */}
                <div className="p-6 bg-[#5c090f] rounded-xl border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 
                      className="text-white font-semibold"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      New Listings
                    </h3>
                    <button
                      onClick={() => onNavigate('listings')}
                      className="text-[#febd14] text-sm"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentProperties.map((property) => (
                      <div 
                        key={property.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                        onClick={() => onViewProperty(property)}
                      >
                        <img
                          src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200'}
                          alt={property.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 
                            className="text-white text-sm font-medium line-clamp-1"
                            style={{ fontFamily: 'Kaisei Opti, serif' }}
                          >
                            {property.name}
                          </h4>
                          <div className="flex items-center gap-1 text-white/50 text-xs mt-1">
                            <MapPin className="w-3 h-3" />
                            <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{property.city}</span>
                          </div>
                        </div>
                        <span 
                          className="text-[#febd14] text-sm font-semibold"
                          style={{ fontFamily: 'Kaisei Opti, serif' }}
                        >
                          {property.price >= 1000000 
                            ? `KES ${(property.price / 1000000).toFixed(1)}M`
                            : `KES ${property.price.toLocaleString()}`
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Articles */}
                <div className="p-6 bg-[#5c090f] rounded-xl border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 
                      className="text-white font-semibold"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      Latest Insights
                    </h3>
                    <button
                      onClick={() => onNavigate('blog')}
                      className="text-[#febd14] text-sm"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentArticles.map((article) => (
                      <div 
                        key={article.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                        onClick={() => onReadArticle(article)}
                      >
                        <img
                          src={article.featured_image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200'}
                          alt={article.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 
                            className="text-white text-sm font-medium line-clamp-2"
                            style={{ fontFamily: 'Kaisei Opti, serif' }}
                          >
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-1 text-white/50 text-xs mt-1">
                            <Clock className="w-3 h-3" />
                            <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{article.read_time} min read</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default DashboardView;
