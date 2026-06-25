import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Save, Check, Loader2, MapPin, Building2, Tag, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { UserNotificationPreferences, Category } from '@/types';

interface NotificationPreferencesProps {
  userId: string;
  categories: Category[];
  onClose?: () => void;
}

const PROPERTY_TYPES = ['Residential', 'Commercial', 'Mixed Use', 'Hospitality', 'Land', 'Industrial'];
const CITIES = ['Nairobi', 'Mombasa', 'Nanyuki', 'Nakuru', 'Eldoret', 'Lagos', 'Accra', 'Kigali', 'Johannesburg', 'Dar es Salaam'];

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ userId, categories, onClose }) => {
  const [preferences, setPreferences] = useState<Partial<UserNotificationPreferences>>({
    email_new_listings: true,
    email_new_articles: true,
    email_weekly_digest: true,
    preferred_property_types: [],
    preferred_cities: [],
    preferred_categories: [],
    min_price: undefined,
    max_price: undefined,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, [userId]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        setPreferences(data);
      }
    } catch (err) {
      // No preferences yet, use defaults
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: userId,
          email_new_listings: preferences.email_new_listings,
          email_new_articles: preferences.email_new_articles,
          email_weekly_digest: preferences.email_weekly_digest,
          preferred_property_types: preferences.preferred_property_types || [],
          preferred_cities: preferences.preferred_cities || [],
          preferred_categories: preferences.preferred_categories || [],
          min_price: preferences.min_price || null,
          max_price: preferences.max_price || null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleArrayItem = (field: 'preferred_property_types' | 'preferred_cities' | 'preferred_categories', value: string) => {
    setPreferences(prev => {
      const arr = (prev[field] as string[]) || [];
      const newArr = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [field]: newArr };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-[#febd14] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#5c090f] rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#febd14]/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#febd14]" />
            </div>
            <div>
              <h3 className="text-white font-semibold" style={{ fontFamily: 'Kaisei Opti, serif' }}>
                Email Notifications
              </h3>
              <p className="text-white/50 text-sm" style={{ fontFamily: 'Kaisei Opti, serif' }}>
                Control what emails you receive
              </p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-sm">
              Close
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Email Toggle Switches */}
        <div className="space-y-4">
          <h4 className="text-white/70 text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>
            Notification Types
          </h4>

          {/* New Listings */}
          <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/[0.07] transition-colors">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-[#febd14]" />
              <div>
                <p className="text-white text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>New Property Listings</p>
                <p className="text-white/40 text-xs" style={{ fontFamily: 'Kaisei Opti, serif' }}>Get notified when new listings match your preferences</p>
              </div>
            </div>
            <button
              onClick={() => setPreferences(prev => ({ ...prev, email_new_listings: !prev.email_new_listings }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${preferences.email_new_listings ? 'bg-[#febd14]' : 'bg-white/20'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${preferences.email_new_listings ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </label>

          {/* New Articles */}
          <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/[0.07] transition-colors">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>New Articles & Insights</p>
                <p className="text-white/40 text-xs" style={{ fontFamily: 'Kaisei Opti, serif' }}>Receive alerts for new research and analysis</p>
              </div>
            </div>
            <button
              onClick={() => setPreferences(prev => ({ ...prev, email_new_articles: !prev.email_new_articles }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${preferences.email_new_articles ? 'bg-[#febd14]' : 'bg-white/20'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${preferences.email_new_articles ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </label>

          {/* Weekly Digest */}
          <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/[0.07] transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>Weekly Digest</p>
                <p className="text-white/40 text-xs" style={{ fontFamily: 'Kaisei Opti, serif' }}>A summary of the week's top opportunities and insights</p>
              </div>
            </div>
            <button
              onClick={() => setPreferences(prev => ({ ...prev, email_weekly_digest: !prev.email_weekly_digest }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${preferences.email_weekly_digest ? 'bg-[#febd14]' : 'bg-white/20'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${preferences.email_weekly_digest ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </label>
        </div>

        {/* Property Type Preferences */}
        {preferences.email_new_listings && (
          <div className="space-y-3">
            <h4 className="text-white/70 text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>
              <Building2 className="w-4 h-4 inline mr-2 text-[#febd14]" />
              Preferred Property Types
            </h4>
            <p className="text-white/40 text-xs" style={{ fontFamily: 'Kaisei Opti, serif' }}>
              Leave empty to receive all types. Select specific types to filter.
            </p>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleArrayItem('preferred_property_types', type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    (preferences.preferred_property_types || []).includes(type)
                      ? 'bg-[#febd14] text-[#5c090f]'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                  }`}
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* City Preferences */}
        {preferences.email_new_listings && (
          <div className="space-y-3">
            <h4 className="text-white/70 text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>
              <MapPin className="w-4 h-4 inline mr-2 text-[#febd14]" />
              Preferred Cities
            </h4>
            <p className="text-white/40 text-xs" style={{ fontFamily: 'Kaisei Opti, serif' }}>
              Leave empty to receive listings from all cities.
            </p>
            <div className="flex flex-wrap gap-2">
              {CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => toggleArrayItem('preferred_cities', city)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    (preferences.preferred_cities || []).includes(city)
                      ? 'bg-[#febd14] text-[#5c090f]'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                  }`}
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        {preferences.email_new_listings && (
          <div className="space-y-3">
            <h4 className="text-white/70 text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>
              <DollarSign className="w-4 h-4 inline mr-2 text-[#febd14]" />
              Price Range (KES)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/40 text-xs block mb-1" style={{ fontFamily: 'Kaisei Opti, serif' }}>Minimum</label>
                <input
                  type="number"
                  value={preferences.min_price || ''}
                  onChange={(e) => setPreferences(prev => ({ ...prev, min_price: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="No minimum"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#febd14]/50"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1" style={{ fontFamily: 'Kaisei Opti, serif' }}>Maximum</label>
                <input
                  type="number"
                  value={preferences.max_price || ''}
                  onChange={(e) => setPreferences(prev => ({ ...prev, max_price: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="No maximum"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#febd14]/50"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Category Preferences */}
        {preferences.email_new_articles && categories.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white/70 text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>
              <Tag className="w-4 h-4 inline mr-2 text-green-400" />
              Preferred Article Categories
            </h4>
            <p className="text-white/40 text-xs" style={{ fontFamily: 'Kaisei Opti, serif' }}>
              Leave empty to receive all categories.
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleArrayItem('preferred_categories', cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    (preferences.preferred_categories || []).includes(cat.id)
                      ? 'bg-green-400 text-[#5c090f]'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                  }`}
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={savePreferences}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#febd14] text-[#5c090f] font-semibold rounded-lg hover:bg-[#febd14]/90 transition-colors disabled:opacity-50"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4" />
                Preferences Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
