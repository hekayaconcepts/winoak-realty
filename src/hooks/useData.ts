import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Property, Article, Podcast, Category, Tag } from '@/types';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProperties(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  return { properties, loading, error };
}

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*, category:categories(*)')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setArticles(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  return { articles, loading, error };
}

export function usePodcasts() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPodcasts() {
      try {
        const { data, error } = await supabase
          .from('podcasts')
          .select('*')
          .eq('published', true)
          .order('episode_number', { ascending: false });

        if (error) throw error;
        setPodcasts(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPodcasts();
  }, []);

  return { podcasts, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading };
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const { data, error } = await supabase
          .from('tags')
          .select('*')
          .order('name');

        if (error) throw error;
        setTags(data || []);
      } catch (err) {
        console.error('Error fetching tags:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  return { tags, loading };
}

export async function subscribeToNewsletter(email: string, name?: string, source: string = 'website') {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert([{ email, name, source }]);

  if (error) {
    if (error.code === '23505') {
      throw new Error('This email is already subscribed.');
    }
    throw error;
  }

  return data;
}

export async function trackAnalytics(
  eventType: string,
  resourceType?: string,
  resourceId?: string,
  metadata?: Record<string, any>
) {
  try {
    await supabase.from('analytics_events').insert([{
      event_type: eventType,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata: metadata || {},
    }]);
  } catch (err) {
    console.error('Analytics error:', err);
  }
}
