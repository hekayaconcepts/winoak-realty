import React from 'react';
import { Clock, Bookmark, BookmarkCheck, Headphones, ArrowRight } from 'lucide-react';
import { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
  onReadMore: (article: Article) => void;
  onSave?: (article: Article) => void;
  isSaved?: boolean;
  showSaveButton?: boolean;
  variant?: 'default' | 'featured' | 'compact';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  onReadMore, 
  onSave, 
  isSaved = false,
  showSaveButton = true,
  variant = 'default'
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (variant === 'featured') {
    return (
      <div 
        className="group relative h-[400px] md:h-[500px] rounded-xl overflow-hidden cursor-pointer"
        onClick={() => onReadMore(article)}
      >
        <img
          src={article.featured_image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Save Button */}
        {showSaveButton && onSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(article);
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-[#febd14]" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {/* Category */}
          {article.category && (
            <span 
              className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#febd14] text-[#5c090f] uppercase tracking-wide mb-4"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              {article.category.name}
            </span>
          )}

          <h2 
            className="text-white text-2xl md:text-3xl font-bold mb-3 group-hover:text-[#febd14] transition-colors line-clamp-2"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            {article.title}
          </h2>

          <p 
            className="text-white/70 text-sm md:text-base mb-4 line-clamp-2"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            {article.excerpt}
          </p>

          <div className="flex items-center gap-4 text-white/60 text-sm">
            <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{formatDate(article.created_at)}</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{article.read_time} min read</span>
            </div>
            {article.audio_url && (
              <div className="flex items-center gap-1 text-[#febd14]">
                <Headphones className="w-4 h-4" />
                <span style={{ fontFamily: 'Kaisei Opti, serif' }}>Audio</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        className="group flex gap-4 cursor-pointer"
        onClick={() => onReadMore(article)}
      >
        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
          <img
            src={article.featured_image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 
            className="text-white text-sm font-medium line-clamp-2 group-hover:text-[#febd14] transition-colors mb-1"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            {article.title}
          </h4>
          <div className="flex items-center gap-2 text-white/50 text-xs">
            <Clock className="w-3 h-3" />
            <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{article.read_time} min</span>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="group bg-[#5c090f] rounded-xl overflow-hidden border border-white/5 hover:border-[#febd14]/30 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={article.featured_image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Category Badge */}
        {article.category && (
          <div className="absolute top-4 left-4">
            <span 
              className="px-3 py-1 rounded-full text-xs font-medium bg-[#febd14]/90 text-[#5c090f] uppercase tracking-wide"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              {article.category.name}
            </span>
          </div>
        )}

        {/* Save Button */}
        {showSaveButton && onSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(article);
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-[#febd14]" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Audio Badge */}
        {article.audio_url && (
          <div className="absolute bottom-4 right-4">
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[#febd14] text-xs">
              <Headphones className="w-3 h-3" />
              <span style={{ fontFamily: 'Kaisei Opti, serif' }}>Audio</span>
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-3 text-white/50 text-xs mb-3">
          <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{formatDate(article.created_at)}</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{article.read_time} min read</span>
          </div>
        </div>

        <h3 
          className="text-white text-lg font-semibold mb-2 line-clamp-2 group-hover:text-[#febd14] transition-colors cursor-pointer"
          style={{ fontFamily: 'Kaisei Opti, serif' }}
          onClick={() => onReadMore(article)}
        >
          {article.title}
        </h3>

        <p 
          className="text-white/60 text-sm line-clamp-2 mb-4"
          style={{ fontFamily: 'Kaisei Opti, serif' }}
        >
          {article.excerpt}
        </p>

        <button
          onClick={() => onReadMore(article)}
          className="flex items-center gap-2 text-[#febd14] text-sm font-medium hover:gap-3 transition-all"
          style={{ fontFamily: 'Kaisei Opti, serif' }}
        >
          <span>Read More</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
