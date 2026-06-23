import React from 'react';
import { 
  ArrowLeft, Clock, Calendar, Bookmark, BookmarkCheck, 
  Share2, Headphones, Play, Pause 
} from 'lucide-react';
import { Article, ViewType } from '@/types';
import NewsletterSection from '@/components/NewsletterSection';

interface ArticleDetailViewProps {
  article: Article;
  onBack: () => void;
  onSave?: (article: Article) => void;
  isSaved?: boolean;
  isAuthenticated: boolean;
}

const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  onBack,
  onSave,
  isSaved = false,
  isAuthenticated,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          style={{ fontFamily: 'Kaisei Opti, serif' }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Insights</span>
        </button>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Category */}
        {article.category && (
          <div className="mb-6">
            <span 
              className="inline-block px-4 py-2 rounded-full bg-[#eaae31]/10 text-[#eaae31] text-sm font-medium"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              {article.category.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 
          className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
          style={{ fontFamily: 'Kaisei Opti, serif' }}
        >
          {article.title}
        </h1>

        {/* Excerpt */}
        <p 
          className="text-white/70 text-lg md:text-xl mb-8 leading-relaxed"
          style={{ fontFamily: 'Kaisei Opti, serif', lineHeight: 1.7 }}
        >
          {article.excerpt}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Calendar className="w-4 h-4" />
            <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{formatDate(article.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Clock className="w-4 h-4" />
            <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{article.read_time} min read</span>
          </div>
          <span 
            className="text-white/60 text-sm"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            By {article.author}
          </span>
          
          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {isAuthenticated && onSave && (
              <button
                onClick={() => onSave(article)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                {isSaved ? (
                  <BookmarkCheck className="w-5 h-5 text-[#eaae31]" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            )}
            <button
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audio Player */}
        {article.audio_url && (
          <div className="mb-8 p-6 bg-[#1e3235] rounded-xl border border-white/5">
            <div className="flex items-center gap-4">
              <button className="w-14 h-14 rounded-full bg-[#eaae31] flex items-center justify-center flex-shrink-0">
                <Play className="w-6 h-6 text-[#2a4347] ml-1" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[#eaae31] text-sm mb-1">
                  <Headphones className="w-4 h-4" />
                  <span style={{ fontFamily: 'Kaisei Opti, serif' }}>Audio Version Available</span>
                </div>
                <p 
                  className="text-white/60 text-sm"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Listen to this article while you work
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Featured Image */}
        {article.featured_image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-invert prose-lg max-w-none"
          style={{ fontFamily: 'Kaisei Opti, serif' }}
        >
          <div className="text-white/80 leading-relaxed space-y-6" style={{ lineHeight: 1.8 }}>
            {article.content?.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 
              className="text-white/60 text-sm uppercase tracking-wider mb-4"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span 
                  key={tag.id}
                  className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Box */}
        <div className="mt-12 p-6 bg-[#1e3235] rounded-xl border border-white/5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#eaae31]/10 flex items-center justify-center flex-shrink-0">
              <span 
                className="text-[#eaae31] text-xl font-bold"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                APB
              </span>
            </div>
            <div>
              <h4 
                className="text-white font-semibold mb-1"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                {article.author}
              </h4>
              <p 
                className="text-white/60 text-sm leading-relaxed"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                The African Property Brief publishes investor-grade real estate analysis for 
                international investors, diaspora buyers, and global real estate advisors.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
};

export default ArticleDetailView;
