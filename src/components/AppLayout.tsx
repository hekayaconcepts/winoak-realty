import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useProperties, useArticles, usePodcasts, useCategories } from '@/hooks/useData';
import { ViewType, Property, Article, Podcast } from '@/types';

// Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

// Views
import HomeView from '@/components/views/HomeView';
import ListingsView from '@/components/views/ListingsView';
import BlogView from '@/components/views/BlogView';
import PodcastView from '@/components/views/PodcastView';
import AboutView from '@/components/views/AboutView';
import ContactView from '@/components/views/ContactView';
import PropertyDetailView from '@/components/views/PropertyDetailView';
import ArticleDetailView from '@/components/views/ArticleDetailView';
import DashboardView from '@/components/views/DashboardView';
import AdminView from '@/components/views/AdminView';
import PricingView from '@/components/views/PricingView';
import MarketYieldView from '@/components/views/MarketYieldView';


const AppLayout: React.FC = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Navigation state
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Saved items state
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([]);

  // Podcast player state
  const [currentlyPlayingPodcast, setCurrentlyPlayingPodcast] = useState<string | null>(null);

  // Data hooks
  const { properties, loading: propertiesLoading } = useProperties();
  const { articles, loading: articlesLoading } = useArticles();
  const { podcasts, loading: podcastsLoading } = usePodcasts();
  const { categories } = useCategories();

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUser(session.user);
        setIsAdmin(session.user.email?.includes('admin') || false);
        loadSavedItems(session.user.id);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setUser(session.user);
        setIsAdmin(session.user.email?.includes('admin') || false);
        loadSavedItems(session.user.id);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
        setSavedPropertyIds([]);
        setSavedArticleIds([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load saved items for authenticated user
  const loadSavedItems = async (userId: string) => {
    try {
      const [{ data: savedListings }, { data: savedArticles }] = await Promise.all([
        supabase.from('saved_listings').select('property_id').eq('user_id', userId),
        supabase.from('saved_articles').select('article_id').eq('user_id', userId),
      ]);

      setSavedPropertyIds(savedListings?.map(s => s.property_id) || []);
      setSavedArticleIds(savedArticles?.map(s => s.article_id) || []);
    } catch (err) {
      console.error('Error loading saved items:', err);
    }
  };

  // Navigation handler
  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    setSelectedProperty(null);
    setSelectedArticle(null);
    window.scrollTo(0, 0);
  };

  // Auth handlers
  const handleAuthClick = async () => {
    if (isAuthenticated) {
      await supabase.auth.signOut();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  // Property handlers
  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setCurrentView('listing');
    window.scrollTo(0, 0);
  };

  const handleSaveProperty = async (property: Property) => {
    if (!user) return;

    const isSaved = savedPropertyIds.includes(property.id);

    try {
      if (isSaved) {
        await supabase
          .from('saved_listings')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', property.id);
        setSavedPropertyIds(prev => prev.filter(id => id !== property.id));
      } else {
        await supabase
          .from('saved_listings')
          .insert([{ user_id: user.id, property_id: property.id }]);
        setSavedPropertyIds(prev => [...prev, property.id]);
      }
    } catch (err) {
      console.error('Error saving property:', err);
    }
  };

  // Article handlers
  const handleReadArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article');
    window.scrollTo(0, 0);
  };

  const handleSaveArticle = async (article: Article) => {
    if (!user) return;

    const isSaved = savedArticleIds.includes(article.id);

    try {
      if (isSaved) {
        await supabase
          .from('saved_articles')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', article.id);
        setSavedArticleIds(prev => prev.filter(id => id !== article.id));
      } else {
        await supabase
          .from('saved_articles')
          .insert([{ user_id: user.id, article_id: article.id }]);
        setSavedArticleIds(prev => [...prev, article.id]);
      }
    } catch (err) {
      console.error('Error saving article:', err);
    }
  };

  // Podcast handler
  const handlePlayPodcast = (podcast: Podcast) => {
    setCurrentlyPlayingPodcast(
      currentlyPlayingPodcast === podcast.id ? null : podcast.id
    );
  };

  // Refresh data (for admin)
  const handleRefreshData = () => {
    window.location.reload();
  };

  // Render current view
  const renderView = () => {
    // Property detail view
    if (currentView === 'listing' && selectedProperty) {
      return (
        <PropertyDetailView
          property={selectedProperty}
          onBack={() => handleNavigate('listings')}
          onSave={handleSaveProperty}
          isSaved={savedPropertyIds.includes(selectedProperty.id)}
          isAuthenticated={isAuthenticated}
          userId={user?.id}
        />
      );
    }


    // Article detail view
    if (currentView === 'article' && selectedArticle) {
      return (
        <ArticleDetailView
          article={selectedArticle}
          onBack={() => handleNavigate('blog')}
          onSave={handleSaveArticle}
          isSaved={savedArticleIds.includes(selectedArticle.id)}
          isAuthenticated={isAuthenticated}
        />
      );
    }

    // Main views
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            properties={properties}
            articles={articles}
            podcasts={podcasts}
            onNavigate={handleNavigate}
            onViewProperty={handleViewProperty}
            onReadArticle={handleReadArticle}
            onPlayPodcast={handlePlayPodcast}
          />
        );

      case 'listings':
        return (
          <ListingsView
            properties={properties}
            onViewProperty={handleViewProperty}
            onSaveProperty={handleSaveProperty}
            savedPropertyIds={savedPropertyIds}
            isAuthenticated={isAuthenticated}
          />
        );

      case 'blog':
        return (
          <BlogView
            articles={articles}
            categories={categories}
            onReadArticle={handleReadArticle}
            onSaveArticle={handleSaveArticle}
            savedArticleIds={savedArticleIds}
            isAuthenticated={isAuthenticated}
          />
        );

      case 'podcast':
        return (
          <PodcastView
            podcasts={podcasts}
            onPlayPodcast={handlePlayPodcast}
            currentlyPlaying={currentlyPlayingPodcast}
          />
        );

      case 'about':
        return <AboutView onNavigate={handleNavigate} />;

      case 'contact':
        return <ContactView />;

      case 'market-yields':
        return <MarketYieldView onNavigate={handleNavigate} />;

      case 'dashboard':
        if (!isAuthenticated) {
          handleNavigate('home');
          return null;
        }
        return (
          <DashboardView
            properties={properties}
            articles={articles}
            podcasts={podcasts}
            categories={categories}
            savedPropertyIds={savedPropertyIds}
            savedArticleIds={savedArticleIds}
            onNavigate={handleNavigate}
            onViewProperty={handleViewProperty}
            onReadArticle={handleReadArticle}
            onSaveProperty={handleSaveProperty}
            onSaveArticle={handleSaveArticle}
            userName={user?.user_metadata?.full_name}
            userId={user?.id}
          />
        );

      case 'saved-listings':
        if (!isAuthenticated) {
          handleNavigate('home');
          return null;
        }
        return (
          <ListingsView
            properties={properties.filter(p => savedPropertyIds.includes(p.id))}
            onViewProperty={handleViewProperty}
            onSaveProperty={handleSaveProperty}
            savedPropertyIds={savedPropertyIds}
            isAuthenticated={isAuthenticated}
          />
        );

      case 'saved-articles':
        if (!isAuthenticated) {
          handleNavigate('home');
          return null;
        }
        return (
          <BlogView
            articles={articles.filter(a => savedArticleIds.includes(a.id))}
            categories={categories}
            onReadArticle={handleReadArticle}
            onSaveArticle={handleSaveArticle}
            savedArticleIds={savedArticleIds}
            isAuthenticated={isAuthenticated}
          />
        );

      case 'audio-library':
        if (!isAuthenticated) {
          handleNavigate('home');
          return null;
        }
        return (
          <PodcastView
            podcasts={podcasts}
            onPlayPodcast={handlePlayPodcast}
            currentlyPlaying={currentlyPlayingPodcast}
          />
        );

      case 'admin':
        if (!isAdmin) {
          handleNavigate('home');
          return null;
        }
        return (
          <AdminView
            properties={properties}
            articles={articles}
            podcasts={podcasts}
            categories={categories}
            onRefresh={handleRefreshData}
          />
        );

      case 'pricing':
        return (
          <PricingView
            onNavigate={handleNavigate}
            isAuthenticated={isAuthenticated}
            userEmail={user?.email}
            onAuthClick={() => setShowAuthModal(true)}
          />
        );

      default:
        return (
          <HomeView
            properties={properties}
            articles={articles}
            podcasts={podcasts}
            onNavigate={handleNavigate}
            onViewProperty={handleViewProperty}
            onReadArticle={handleReadArticle}
            onPlayPodcast={handlePlayPodcast}
          />
        );
    }
  };


  // Loading state
  if (propertiesLoading && articlesLoading && podcastsLoading) {
    return (
      <div className="min-h-screen bg-[#2a4347] flex items-center justify-center">
        <div className="text-center">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/696a15fcf7f37ab46f03b95f_1768560149377_0263ab94.png" 
            alt="The African Property Brief" 
            className="h-16 w-auto mx-auto mb-4 animate-pulse"
          />
          <p 
            className="text-white/60"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2a4347]">
      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        isAuthenticated={isAuthenticated}
        onAuthClick={handleAuthClick}
      />

      {/* Main Content */}
      <main>
        {renderView()}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Admin Access Button (for demo) */}
      {isAuthenticated && (
        <button
          onClick={() => handleNavigate('admin')}
          className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-[#eaae31] text-[#2a4347] shadow-lg flex items-center justify-center hover:bg-[#eaae31]/90 transition-colors z-40"
          title="Admin Panel"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AppLayout;
