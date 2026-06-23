import React, { useState, useMemo } from 'react';
import { Search, Filter, X, ChevronDown, Grid3X3, List, MapPin } from 'lucide-react';
import { Property, PropertyFilters } from '@/types';
import PropertyCard from '@/components/PropertyCard';

interface ListingsViewProps {
  properties: Property[];
  onViewProperty: (property: Property) => void;
  onSaveProperty?: (property: Property) => void;
  savedPropertyIds?: string[];
  isAuthenticated: boolean;
}

const ListingsView: React.FC<ListingsViewProps> = ({
  properties,
  onViewProperty,
  onSaveProperty,
  savedPropertyIds = [],
  isAuthenticated,
}) => {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique values for filters
  const propertyTypes = useMemo(() => 
    [...new Set(properties.map(p => p.property_type))].sort(),
    [properties]
  );
  
  const cities = useMemo(() => 
    [...new Set(properties.map(p => p.city))].filter(Boolean).sort(),
    [properties]
  );
  
  const statuses = ['upcoming', 'ongoing', 'complete'];

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Apply filters
    if (filters.propertyType) {
      result = result.filter(p => p.property_type === filters.propertyType);
    }
    if (filters.city) {
      result = result.filter(p => p.city === filters.city);
    }
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters.minPrice) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.location.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [properties, filters, sortBy]);

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Header */}
      <section className="py-12 md:py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 
            className="text-white text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Property Listings
          </h1>
          <p 
            className="text-white/60 text-lg max-w-2xl"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Vetted investment opportunities from trusted developers across Kenya and emerging African markets.
          </p>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="sticky top-16 md:top-20 z-30 bg-[#2a4347]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search properties..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#eaae31] transition-colors"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Property Type */}
              <select
                value={filters.propertyType || ''}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value || undefined })}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#eaae31] transition-colors appearance-none cursor-pointer"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <option value="">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* City */}
              <select
                value={filters.city || ''}
                onChange={(e) => setFilters({ ...filters, city: e.target.value || undefined })}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#eaae31] transition-colors appearance-none cursor-pointer"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              {/* Status */}
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#eaae31] transition-colors appearance-none cursor-pointer capitalize"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status} className="capitalize">{status}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#eaae31] transition-colors appearance-none cursor-pointer"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 text-[#eaae31] text-sm hover:bg-white/5 rounded-lg transition-colors"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <div className="flex lg:hidden items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="w-5 h-5 rounded-full bg-[#eaae31] text-[#2a4347] text-xs flex items-center justify-center">
                    {Object.values(filters).filter(v => v !== undefined && v !== '').length}
                  </span>
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#eaae31] transition-colors appearance-none cursor-pointer"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low</option>
                <option value="price-desc">Price: High</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="lg:hidden mt-4 p-4 bg-[#1e3235] rounded-lg border border-white/10">
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={filters.propertyType || ''}
                  onChange={(e) => setFilters({ ...filters, propertyType: e.target.value || undefined })}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#eaae31] transition-colors"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  <option value="">All Types</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <select
                  value={filters.city || ''}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value || undefined })}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#eaae31] transition-colors"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>

                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#eaae31] transition-colors capitalize"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status} className="capitalize">{status}</option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-3 text-[#eaae31] text-sm bg-white/5 rounded-lg"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p 
              className="text-white/60 text-sm"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
            </p>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onViewDetails={onViewProperty}
                  onSave={isAuthenticated ? onSaveProperty : undefined}
                  isSaved={savedPropertyIds.includes(property.id)}
                  showSaveButton={isAuthenticated}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <MapPin className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 
                className="text-white text-xl font-semibold mb-2"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                No properties found
              </h3>
              <p 
                className="text-white/60 mb-6"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Try adjusting your filters or search criteria
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-[#eaae31] text-[#2a4347] font-semibold rounded-lg hover:bg-[#eaae31]/90 transition-colors"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ListingsView;
