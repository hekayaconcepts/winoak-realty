import React, { useState, useEffect } from 'react';
import { 
  Building2, BookOpen, Headphones, Users, BarChart3, 
  Plus, Edit, Trash2, Eye, Search, Filter, Upload,
  ChevronLeft, ChevronRight, X, Save, Image
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Property, Article, Podcast, Category } from '@/types';

interface AdminViewProps {
  properties: Property[];
  articles: Article[];
  podcasts: Podcast[];
  categories: Category[];
  onRefresh: () => void;
}

type AdminTab = 'overview' | 'listings' | 'articles' | 'podcasts' | 'users' | 'analytics';

const AdminView: React.FC<AdminViewProps> = ({
  properties,
  articles,
  podcasts,
  categories,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'property' | 'article' | 'podcast'>('property');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: BarChart3 },
    { id: 'listings' as AdminTab, label: 'Listings', icon: Building2 },
    { id: 'articles' as AdminTab, label: 'Articles', icon: BookOpen },
    { id: 'podcasts' as AdminTab, label: 'Podcasts', icon: Headphones },
    { id: 'users' as AdminTab, label: 'Users', icon: Users },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
  ];

  const stats = [
    { label: 'Total Listings', value: properties.length, icon: Building2, color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Published Articles', value: articles.length, icon: BookOpen, color: 'bg-green-500/10 text-green-400' },
    { label: 'Podcast Episodes', value: podcasts.length, icon: Headphones, color: 'bg-purple-500/10 text-purple-400' },
    { label: 'Total Views', value: '15.2K', icon: Eye, color: 'bg-orange-500/10 text-orange-400' },
  ];

  const openCreateModal = (type: 'property' | 'article' | 'podcast') => {
    setModalType(type);
    setEditingItem(null);
    setShowModal(true);
  };

  const openEditModal = (type: 'property' | 'article' | 'podcast', item: any) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from(type === 'property' ? 'properties' : type === 'article' ? 'articles' : 'podcasts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      onRefresh();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24 bg-[#1e3235]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 
              className="text-white text-2xl md:text-3xl font-bold"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Admin Dashboard
            </h1>
            <p 
              className="text-white/60 mt-1"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Manage your content and monitor performance
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#eaae31] text-[#2a4347]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="p-6 bg-[#2a4347] rounded-xl border border-white/5"
                >
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p 
                    className="text-white text-2xl font-bold"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    {stat.value}
                  </p>
                  <p 
                    className="text-white/60 text-sm"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => openCreateModal('property')}
                className="p-6 bg-[#2a4347] rounded-xl border border-white/5 hover:border-[#eaae31]/30 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Plus className="w-6 h-6 text-blue-400" />
                </div>
                <h3 
                  className="text-white font-semibold mb-1"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Add New Listing
                </h3>
                <p 
                  className="text-white/60 text-sm"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Create a new property listing
                </p>
              </button>

              <button
                onClick={() => openCreateModal('article')}
                className="p-6 bg-[#2a4347] rounded-xl border border-white/5 hover:border-[#eaae31]/30 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                  <Plus className="w-6 h-6 text-green-400" />
                </div>
                <h3 
                  className="text-white font-semibold mb-1"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Write Article
                </h3>
                <p 
                  className="text-white/60 text-sm"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Publish a new blog post
                </p>
              </button>

              <button
                onClick={() => openCreateModal('podcast')}
                className="p-6 bg-[#2a4347] rounded-xl border border-white/5 hover:border-[#eaae31]/30 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <Plus className="w-6 h-6 text-purple-400" />
                </div>
                <h3 
                  className="text-white font-semibold mb-1"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Upload Episode
                </h3>
                <p 
                  className="text-white/60 text-sm"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Add a new podcast episode
                </p>
              </button>
            </div>

            {/* Recent Items */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Listings */}
              <div className="bg-[#2a4347] rounded-xl border border-white/5 p-6">
                <h3 
                  className="text-white font-semibold mb-4"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Recent Listings
                </h3>
                <div className="space-y-3">
                  {properties.slice(0, 5).map((property) => (
                    <div 
                      key={property.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100'}
                          alt={property.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p 
                            className="text-white text-sm font-medium line-clamp-1"
                            style={{ fontFamily: 'Kaisei Opti, serif' }}
                          >
                            {property.name}
                          </p>
                          <p 
                            className="text-white/50 text-xs"
                            style={{ fontFamily: 'Kaisei Opti, serif' }}
                          >
                            {property.city}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal('property', property)}
                          className="p-2 text-white/60 hover:text-white transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Articles */}
              <div className="bg-[#2a4347] rounded-xl border border-white/5 p-6">
                <h3 
                  className="text-white font-semibold mb-4"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Recent Articles
                </h3>
                <div className="space-y-3">
                  {articles.slice(0, 5).map((article) => (
                    <div 
                      key={article.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={article.featured_image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100'}
                          alt={article.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p 
                            className="text-white text-sm font-medium line-clamp-1"
                            style={{ fontFamily: 'Kaisei Opti, serif' }}
                          >
                            {article.title}
                          </p>
                          <p 
                            className="text-white/50 text-xs"
                            style={{ fontFamily: 'Kaisei Opti, serif' }}
                          >
                            {article.read_time} min read
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal('article', article)}
                          className="p-2 text-white/60 hover:text-white transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="text-white text-xl font-semibold"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Property Listings ({properties.length})
              </h2>
              <button
                onClick={() => openCreateModal('property')}
                className="flex items-center gap-2 px-4 py-2 bg-[#eaae31] text-[#2a4347] rounded-lg font-medium hover:bg-[#eaae31]/90 transition-colors"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <Plus className="w-4 h-4" />
                <span>Add Listing</span>
              </button>
            </div>

            <div className="bg-[#2a4347] rounded-xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-white/60 text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>Property</th>
                      <th className="text-left p-4 text-white/60 text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>Location</th>
                      <th className="text-left p-4 text-white/60 text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>Type</th>
                      <th className="text-left p-4 text-white/60 text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>Price</th>
                      <th className="text-left p-4 text-white/60 text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>Status</th>
                      <th className="text-right p-4 text-white/60 text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <tr key={property.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100'}
                              alt={property.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <span className="text-white text-sm" style={{ fontFamily: 'Kaisei Opti, serif' }}>{property.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-white/60 text-sm" style={{ fontFamily: 'Kaisei Opti, serif' }}>{property.city}</td>
                        <td className="p-4 text-white/60 text-sm" style={{ fontFamily: 'Kaisei Opti, serif' }}>{property.property_type}</td>
                        <td className="p-4 text-[#eaae31] text-sm font-medium" style={{ fontFamily: 'Kaisei Opti, serif' }}>
                          KES {(property.price / 1000000).toFixed(1)}M
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                            property.status === 'ongoing' ? 'bg-green-500/20 text-green-300' :
                            property.status === 'upcoming' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`} style={{ fontFamily: 'Kaisei Opti, serif' }}>
                            {property.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal('property', property)}
                              className="p-2 text-white/60 hover:text-white transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('property', property.id)}
                              className="p-2 text-white/60 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="text-white text-xl font-semibold"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Articles ({articles.length})
              </h2>
              <button
                onClick={() => openCreateModal('article')}
                className="flex items-center gap-2 px-4 py-2 bg-[#eaae31] text-[#2a4347] rounded-lg font-medium hover:bg-[#eaae31]/90 transition-colors"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <Plus className="w-4 h-4" />
                <span>New Article</span>
              </button>
            </div>

            <div className="grid gap-4">
              {articles.map((article) => (
                <div 
                  key={article.id}
                  className="flex items-center justify-between p-4 bg-[#2a4347] rounded-xl border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={article.featured_image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100'}
                      alt={article.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 
                        className="text-white font-medium mb-1"
                        style={{ fontFamily: 'Kaisei Opti, serif' }}
                      >
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-3 text-white/50 text-sm">
                        <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{article.category?.name}</span>
                        <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{article.read_time} min read</span>
                        <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{article.views} views</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal('article', article)}
                      className="p-2 text-white/60 hover:text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('article', article.id)}
                      className="p-2 text-white/60 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Podcasts Tab */}
        {activeTab === 'podcasts' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="text-white text-xl font-semibold"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Podcast Episodes ({podcasts.length})
              </h2>
              <button
                onClick={() => openCreateModal('podcast')}
                className="flex items-center gap-2 px-4 py-2 bg-[#eaae31] text-[#2a4347] rounded-lg font-medium hover:bg-[#eaae31]/90 transition-colors"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <Plus className="w-4 h-4" />
                <span>Upload Episode</span>
              </button>
            </div>

            <div className="grid gap-4">
              {podcasts.map((podcast) => (
                <div 
                  key={podcast.id}
                  className="flex items-center justify-between p-4 bg-[#2a4347] rounded-xl border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Headphones className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h3 
                        className="text-white font-medium mb-1"
                        style={{ fontFamily: 'Kaisei Opti, serif' }}
                      >
                        Episode {podcast.episode_number}: {podcast.title}
                      </h3>
                      <div className="flex items-center gap-3 text-white/50 text-sm">
                        <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{Math.floor(podcast.duration / 60)} min</span>
                        <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{podcast.plays} plays</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal('podcast', podcast)}
                      className="p-2 text-white/60 hover:text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('podcast', podcast.id)}
                      className="p-2 text-white/60 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users & Analytics tabs would show placeholder content */}
        {(activeTab === 'users' || activeTab === 'analytics') && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              {activeTab === 'users' ? <Users className="w-8 h-8 text-white/40" /> : <BarChart3 className="w-8 h-8 text-white/40" />}
            </div>
            <h3 
              className="text-white text-xl font-semibold mb-2"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              {activeTab === 'users' ? 'User Management' : 'Analytics Dashboard'}
            </h3>
            <p 
              className="text-white/60"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              This section is under development
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal would go here - simplified for now */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl bg-[#2a4347] rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="text-white text-xl font-semibold"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                {editingItem ? 'Edit' : 'Create'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p 
              className="text-white/60 text-center py-8"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Form editor would be implemented here with full CRUD functionality
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Cancel
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#eaae31] text-[#2a4347] rounded-lg font-medium hover:bg-[#eaae31]/90 transition-colors"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
