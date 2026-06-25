import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import { Article, Category, ArticleFilters } from '@/types';
import ArticleCard from '@/components/ArticleCard';
import NewsletterSection from '@/components/NewsletterSection';

interface BlogViewProps {
  articles: Article[];
  categories: Category[];
  onReadArticle: (article: Article) => void;
  onSaveArticle?: (article: Article) => void;
  savedArticleIds?: string[];
  isAuthenticated: boolean;
}

const BlogView: React.FC<BlogViewProps> = ({
  articles,
  categories,
  onReadArticle,
  onSaveArticle,
  savedArticleIds = [],
  isAuthenticated,
}) => {
  const [filters, setFilters] = useState<ArticleFilters>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter articles
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (activeCategory) {
      result = result.filter(a => a.category_id === activeCategory);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(searchLower) ||
        a.excerpt?.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [articles, activeCategory, filters]);

  const featuredArticle = filteredArticles.find(a => a.featured);
  const otherArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id);

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Header */}
      <section className="py-12 md:py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 
            className="text-white text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Insights & Analysis
          </h1>
          <p 
            className="text-white/60 text-lg max-w-2xl"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Investor-grade research on African real estate markets. Deal analysis, legal frameworks, 
            market intelligence, and capital behavior.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 md:top-20 z-30 bg-[#5c090f]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#febd14] transition-colors"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              />
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button
                onClick={() => setActiveCategory(null)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === null
                    ? 'bg-[#febd14] text-[#5c090f]'
                    : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                }`}
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-[#febd14] text-[#5c090f]'
                      : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArticles.length > 0 ? (
            <>
              {/* Featured Article */}
              {featuredArticle && !filters.search && (
                <div className="mb-12">
                  <ArticleCard
                    article={featuredArticle}
                    onReadMore={onReadArticle}
                    onSave={isAuthenticated ? onSaveArticle : undefined}
                    isSaved={savedArticleIds.includes(featuredArticle.id)}
                    showSaveButton={isAuthenticated}
                    variant="featured"
                  />
                </div>
              )}

              {/* Articles Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onReadMore={onReadArticle}
                    onSave={isAuthenticated ? onSaveArticle : undefined}
                    isSaved={savedArticleIds.includes(article.id)}
                    showSaveButton={isAuthenticated}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 
                className="text-white text-xl font-semibold mb-2"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                No articles found
              </h3>
              <p 
                className="text-white/60 mb-6"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Try adjusting your search or category filter
              </p>
              <button
                onClick={() => {
                  setFilters({});
                  setActiveCategory(null);
                }}
                className="px-6 py-3 bg-[#febd14] text-[#5c090f] font-semibold rounded-lg hover:bg-[#febd14]/90 transition-colors"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
};

export default BlogView;
