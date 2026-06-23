import React, { useState, useRef } from 'react';
import { Play, Pause, Clock, Headphones } from 'lucide-react';
import { Podcast } from '@/types';

interface PodcastCardProps {
  podcast: Podcast;
  onPlay?: (podcast: Podcast) => void;
  isPlaying?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

const PodcastCard: React.FC<PodcastCardProps> = ({ 
  podcast, 
  onPlay,
  isPlaying = false,
  variant = 'default'
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

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
      <div className="group bg-gradient-to-br from-[#2a4347] to-[#1e3235] rounded-xl overflow-hidden border border-white/5 hover:border-[#eaae31]/30 transition-all duration-300">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto overflow-hidden">
            <img
              src={podcast.featured_image || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800'}
              alt={podcast.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
            
            {/* Play Button Overlay */}
            <button
              onClick={() => onPlay?.(podcast)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="w-20 h-20 rounded-full bg-[#eaae31] flex items-center justify-center shadow-xl">
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-[#2a4347]" />
                ) : (
                  <Play className="w-8 h-8 text-[#2a4347] ml-1" />
                )}
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:py-8 md:pr-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[#eaae31] text-sm mb-3">
              <Headphones className="w-4 h-4" />
              <span style={{ fontFamily: 'Kaisei Opti, serif' }}>Episode {podcast.episode_number}</span>
            </div>

            <h3 
              className="text-white text-xl md:text-2xl font-bold mb-3 group-hover:text-[#eaae31] transition-colors"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              {podcast.title}
            </h3>

            <p 
              className="text-white/60 text-sm md:text-base mb-6 line-clamp-3"
              style={{ fontFamily: 'Kaisei Opti, serif', lineHeight: 1.7 }}
            >
              {podcast.description}
            </p>

            <div className="flex items-center gap-4 text-white/50 text-sm mb-6">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{formatDuration(podcast.duration)}</span>
              </div>
              <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{formatDate(podcast.created_at)}</span>
            </div>

            <button
              onClick={() => onPlay?.(podcast)}
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#eaae31] text-[#2a4347] rounded-lg font-semibold hover:bg-[#eaae31]/90 transition-colors w-fit"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Episode</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Play Episode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        className="group flex items-center gap-4 p-4 bg-[#1e3235] rounded-xl border border-white/5 hover:border-[#eaae31]/30 transition-all cursor-pointer"
        onClick={() => onPlay?.(podcast)}
      >
        <button
          className="flex-shrink-0 w-12 h-12 rounded-full bg-[#eaae31]/10 flex items-center justify-center text-[#eaae31] group-hover:bg-[#eaae31] group-hover:text-[#2a4347] transition-all"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <h4 
            className="text-white text-sm font-medium line-clamp-1 group-hover:text-[#eaae31] transition-colors"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            {podcast.title}
          </h4>
          <div className="flex items-center gap-2 text-white/50 text-xs mt-1">
            <span style={{ fontFamily: 'Kaisei Opti, serif' }}>Ep. {podcast.episode_number}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{formatDuration(podcast.duration)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="group bg-[#1e3235] rounded-xl overflow-hidden border border-white/5 hover:border-[#eaae31]/30 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={podcast.featured_image || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800'}
          alt={podcast.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Episode Badge */}
        <div className="absolute top-4 left-4">
          <span 
            className="px-3 py-1 rounded-full text-xs font-medium bg-[#eaae31]/90 text-[#2a4347] uppercase tracking-wide"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Episode {podcast.episode_number}
          </span>
        </div>

        {/* Play Button */}
        <button
          onClick={() => onPlay?.(podcast)}
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-[#eaae31] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-[#2a4347]" />
          ) : (
            <Play className="w-5 h-5 text-[#2a4347] ml-0.5" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 
          className="text-white text-lg font-semibold mb-2 line-clamp-2 group-hover:text-[#eaae31] transition-colors"
          style={{ fontFamily: 'Kaisei Opti, serif' }}
        >
          {podcast.title}
        </h3>

        <p 
          className="text-white/60 text-sm line-clamp-2 mb-4"
          style={{ fontFamily: 'Kaisei Opti, serif' }}
        >
          {podcast.description}
        </p>

        <div className="flex items-center gap-4 text-white/50 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{formatDuration(podcast.duration)}</span>
          </div>
          <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{formatDate(podcast.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;
