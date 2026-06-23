// Type definitions for The African Property Brief

export interface Property {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  property_type: string;
  price: number;
  price_currency: string;
  key_features: string[];
  description: string;
  commission_percentage?: number;
  commission_notes?: string;
  pdf_url?: string;
  images: string[];
  status: 'upcoming' | 'ongoing' | 'complete';
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string;
  category?: Category;
  author: string;
  featured_image: string;
  audio_url?: string;
  read_time: number;
  published: boolean;
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  duration: number;
  episode_number: number;
  featured_image: string;
  article_id?: string;
  published: boolean;
  plays: number;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  source: string;
  subscribed_at: string;
  confirmed: boolean;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'editor';
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SavedListing {
  user_id: string;
  property_id: string;
  saved_at: string;
}

export interface SavedArticle {
  user_id: string;
  article_id: string;
  saved_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  resource_type?: string;
  resource_id?: string;
  user_id?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface MarketYieldData {
  id: string;
  area_name: string;
  city: string;
  country: string;
  property_type: string;
  avg_rental_yield: number;
  avg_capital_appreciation: number;
  avg_price_per_sqm: number;
  vacancy_rate: number;
  demand_index: number;
  infrastructure_score: number;
  risk_score: number;
  population_growth: number;
  gdp_growth: number;
  data_source: string;
  report_period: string;
  year: number;
  quarter: number;
  trend: 'rising' | 'stable' | 'declining';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface MarketSummary {
  total_areas: number;
  avg_rental_yield: number;
  avg_capital_appreciation: number;
  top_yield_area: MarketYieldData | null;
  top_appreciation_area: MarketYieldData | null;
  lowest_risk_area: MarketYieldData | null;
  countries: string[];
  cities: string[];
  property_types: string[];
  rising_markets: number;
  stable_markets: number;
  declining_markets: number;
}

export interface UserNotificationPreferences {
  user_id: string;
  email_new_listings: boolean;
  email_new_articles: boolean;
  email_weekly_digest: boolean;
  preferred_property_types: string[];
  preferred_cities: string[];
  preferred_categories: string[];
  min_price?: number;
  max_price?: number;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  recipient_email: string;
  email_type: 'welcome' | 'signup_confirmation' | 'new_listing' | 'new_article' | 'digest' | 'custom';
  subject: string;
  status: 'pending' | 'sent' | 'failed' | 'bounced';
  metadata: Record<string, any>;
  error_message?: string;
  sent_at?: string;
  created_at: string;
}

// View/Page types
export type ViewType = 
  | 'home' 
  | 'about' 
  | 'blog' 
  | 'article' 
  | 'listings' 
  | 'listing' 
  | 'podcast' 
  | 'contact'
  | 'dashboard'
  | 'saved-listings'
  | 'saved-articles'
  | 'audio-library'
  | 'profile'
  | 'admin'
  | 'admin-listings'
  | 'admin-articles'
  | 'admin-podcasts'
  | 'admin-users'
  | 'admin-analytics'
  | 'market-yields'
  | 'pricing';

// Filter types
export interface PropertyFilters {
  propertyType?: string;
  city?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface ArticleFilters {
  category?: string;
  tag?: string;
  search?: string;
}
