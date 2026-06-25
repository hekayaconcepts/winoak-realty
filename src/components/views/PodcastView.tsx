import React, { useState } from 'react';
import { Play, Pause, Headphones, Clock, Volume2 } from 'lucide-react';
import { Podcast } from '@/types';
import PodcastCard from '@/components/PodcastCard';
import NewsletterSection from '@/components/NewsletterSection';

interface PodcastViewProps {
  podcasts: Podcast[];
  onPlayPodcast: (podcast: Podcast) => void;
  currentlyPlaying?: string | null;
}

const PodcastView: React.FC<PodcastViewProps> = ({
  podcasts,
  onPlayPodcast,
  currentlyPlaying,
}) => {
  const latestEpisode = podcasts[0];
  const olderEpisodes = podcasts.slice(1);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Header */}
      <section className="py-12 md:py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#febd14]/10 flex items-center justify-center">
              <Headphones className="w-6 h-6 text-[#febd14]" />
            </div>
            <h1 
              className="text-white text-3xl md:text-4xl font-bold"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              The Podcast
            </h1>
          </div>
          <p 
            className="text-white/60 text-lg max-w-2xl"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Deep dives into African real estate investing. Market analysis, legal frameworks, 
            investment strategies, and conversations with industry experts.
          </p>
        </div>
      </section>

      {/* Latest Episode */}
      {latestEpisode && (
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 
              className="text-white text-xl font-semibold mb-6"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Latest Episode
            </h2>
            <PodcastCard
              podcast={latestEpisode}
              onPlay={onPlayPodcast}
              isPlaying={currentlyPlaying === latestEpisode.id}
              variant="featured"
            />
          </div>
        </section>
      )}

      {/* All Episodes */}
      {olderEpisodes.length > 0 && (
        <section className="py-8 md:py-12 bg-[#5c090f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 
              className="text-white text-xl font-semibold mb-6"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              All Episodes
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {olderEpisodes.map((podcast) => (
                <PodcastCard
                  key={podcast.id}
                  podcast={podcast}
                  onPlay={onPlayPodcast}
                  isPlaying={currentlyPlaying === podcast.id}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subscribe Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Volume2 className="w-12 h-12 text-[#febd14] mx-auto mb-6" />
          <h2 
            className="text-white text-2xl md:text-3xl font-bold mb-4"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Listen Anywhere
          </h2>
          <p 
            className="text-white/60 text-lg mb-8"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Subscribe to WinOak Realty podcast on your favorite platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Apple Podcasts', 'Spotify', 'Google Podcasts', 'RSS Feed'].map((platform) => (
              <button
                key={platform}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-medium hover:bg-white/10 transition-colors"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
};

export default PodcastView;
