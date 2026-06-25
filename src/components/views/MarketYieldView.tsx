import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Minus, MapPin, Filter, ArrowUpDown,
  BarChart3, Globe, Building2, AlertTriangle, ChevronDown, ChevronUp,
  Info, Download, RefreshCw, Search, ArrowRight, Shield, Zap, Target
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { MarketYieldData, MarketSummary, ViewType } from '@/types';

interface MarketYieldViewProps {
  onNavigate: (view: ViewType) => void;
}

// Yield bar component
const YieldBar: React.FC<{ value: number; max: number; color: string; label: string }> = ({ value, max, color, label }) => (
  <div className="flex items-center gap-3">
    <span className="text-white/50 text-xs w-20 text-right" style={{ fontFamily: 'Kaisei Opti, serif' }}>{label}</span>
    <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden relative">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-semibold">
        {value.toFixed(1)}%
      </span>
    </div>
  </div>
);

// Score indicator
const ScoreIndicator: React.FC<{ value: number; max?: number; label: string; inverted?: boolean }> = ({ value, max = 100, label, inverted }) => {
  const pct = (value / max) * 100;
  const effectivePct = inverted ? 100 - pct : pct;
  const color = effectivePct >= 70 ? '#22c55e' : effectivePct >= 40 ? '#febd14' : '#ef4444';
  return (
    <div className="text-center">
      <div className="relative w-14 h-14 mx-auto mb-1">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
          <circle
            cx="28" cy="28" r="24" fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={`${(effectivePct / 100) * 150.8} 150.8`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
          {value}
        </span>
      </div>
      <span className="text-white/40 text-[10px]" style={{ fontFamily: 'Kaisei Opti, serif' }}>{label}</span>
    </div>
  );
};

// Trend badge
const TrendBadge: React.FC<{ trend: string }> = ({ trend }) => {
  const config = {
    rising: { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Rising' },
    stable: { icon: Minus, color: 'text-[#febd14]', bg: 'bg-[#febd14]/10', label: 'Stable' },
    declining: { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Declining' },
  }[trend] || { icon: Minus, color: 'text-white/40', bg: 'bg-white/5', label: trend };

  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color} ${config.bg}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const MarketYieldView: React.FC<MarketYieldViewProps> = ({ onNavigate }) => {
  const [data, setData] = useState<MarketYieldData[]>([]);
  const [summary, setSummary] = useState<MarketSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedTrend, setSelectedTrend] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('avg_rental_yield');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke('fetch-market-data', {
        body: {}
      });

      if (fnError) throw fnError;
      if (result?.data) {
        setData(result.data);
        setSummary(result.summary);
      }
    } catch (err: any) {
      console.error('Error fetching market data:', err);
      setError('Failed to load market data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Derived filter options
  const countries = useMemo(() => [...new Set(data.map(d => d.country))].sort(), [data]);
  const cities = useMemo(() => {
    const filtered = selectedCountry ? data.filter(d => d.country === selectedCountry) : data;
    return [...new Set(filtered.map(d => d.city))].sort();
  }, [data, selectedCountry]);
  const propertyTypes = useMemo(() => [...new Set(data.map(d => d.property_type))].sort(), [data]);

  // Filtered & sorted data
  const filteredData = useMemo(() => {
    let result = [...data];
    if (selectedCountry) result = result.filter(d => d.country === selectedCountry);
    if (selectedCity) result = result.filter(d => d.city === selectedCity);
    if (selectedType) result = result.filter(d => d.property_type === selectedType);
    if (selectedTrend) result = result.filter(d => d.trend === selectedTrend);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.area_name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.notes?.toLowerCase().includes(q)
      );
    }
    result.sort((a: any, b: any) => {
      const aVal = Number(a[sortBy]) || 0;
      const bVal = Number(b[sortBy]) || 0;
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
    return result;
  }, [data, selectedCountry, selectedCity, selectedType, selectedTrend, searchQuery, sortBy, sortOrder]);

  // Top picks
  const topYield = useMemo(() => [...filteredData].sort((a, b) => Number(b.avg_rental_yield) - Number(a.avg_rental_yield)).slice(0, 3), [filteredData]);
  const topAppreciation = useMemo(() => [...filteredData].sort((a, b) => Number(b.avg_capital_appreciation) - Number(a.avg_capital_appreciation)).slice(0, 3), [filteredData]);
  const lowestRisk = useMemo(() => [...filteredData].sort((a, b) => Number(a.risk_score) - Number(b.risk_score)).slice(0, 3), [filteredData]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setSelectedCountry('');
    setSelectedCity('');
    setSelectedType('');
    setSelectedTrend('');
    setSearchQuery('');
  };

  const hasFilters = selectedCountry || selectedCity || selectedType || selectedTrend || searchQuery;

  const maxYield = useMemo(() => Math.max(...data.map(d => Number(d.avg_rental_yield)), 12), [data]);
  const maxAppreciation = useMemo(() => Math.max(...data.map(d => Number(d.avg_capital_appreciation)), 15), [data]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 md:pt-24 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#febd14] mx-auto mb-4 animate-spin" />
          <p className="text-white/60" style={{ fontFamily: 'Kaisei Opti, serif' }}>Loading market intelligence...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 md:pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2" style={{ fontFamily: 'Kaisei Opti, serif' }}>Data Unavailable</h2>
          <p className="text-white/60 mb-6" style={{ fontFamily: 'Kaisei Opti, serif' }}>{error}</p>
          <button onClick={fetchMarketData} className="px-6 py-3 bg-[#febd14] text-[#5c090f] rounded-lg font-semibold hover:bg-[#febd14]/90 transition-colors" style={{ fontFamily: 'Kaisei Opti, serif' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5c090f] via-[#5c090f] to-[#5c090f]" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(234,174,49,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#febd14]/10 text-[#febd14] text-sm mb-6">
              <BarChart3 className="w-4 h-4" />
              <span style={{ fontFamily: 'Kaisei Opti, serif' }}>Live Market Intelligence</span>
            </div>
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Kaisei Opti, serif' }}>
              African Property{' '}
              <span className="text-[#febd14]">Yield Dashboard</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl" style={{ fontFamily: 'Kaisei Opti, serif', lineHeight: 1.7 }}>
              Data-driven analysis of rental yields, capital appreciation, and risk metrics across {summary?.total_areas || 0} areas in {summary?.countries?.length || 0} African markets. Updated quarterly from institutional-grade research.
            </p>
          </div>

          {/* Summary Stats */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <p className="text-white/50 text-xs mb-1" style={{ fontFamily: 'Kaisei Opti, serif' }}>Avg. Rental Yield</p>
                <p className="text-[#febd14] text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Kaisei Opti, serif' }}>{summary.avg_rental_yield}%</p>
                <p className="text-white/40 text-xs mt-1">Across all markets</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <p className="text-white/50 text-xs mb-1" style={{ fontFamily: 'Kaisei Opti, serif' }}>Avg. Capital Growth</p>
                <p className="text-green-400 text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Kaisei Opti, serif' }}>{summary.avg_capital_appreciation}%</p>
                <p className="text-white/40 text-xs mt-1">Year-on-year</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <p className="text-white/50 text-xs mb-1" style={{ fontFamily: 'Kaisei Opti, serif' }}>Rising Markets</p>
                <p className="text-white text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Kaisei Opti, serif' }}>{summary.rising_markets}</p>
                <p className="text-white/40 text-xs mt-1">of {summary.total_areas} areas tracked</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <p className="text-white/50 text-xs mb-1" style={{ fontFamily: 'Kaisei Opti, serif' }}>Markets Covered</p>
                <p className="text-white text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Kaisei Opti, serif' }}>{summary.cities?.length || 0}</p>
                <p className="text-white/40 text-xs mt-1">Cities in {summary.countries?.length || 0} countries</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Top Picks Section */}
      <section className="py-12 bg-[#5c090f] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Highest Yield */}
            <div className="bg-[#5c090f] rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#febd14]/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-[#febd14]" />
                </div>
                <h3 className="text-white font-semibold text-sm" style={{ fontFamily: 'Kaisei Opti, serif' }}>Highest Yield</h3>
              </div>
              {topYield.map((item, i) => (
                <div key={item.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[#febd14] text-xs font-bold w-5">{i + 1}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{item.area_name}</p>
                      <p className="text-white/40 text-xs">{item.city}, {item.country}</p>
                    </div>
                  </div>
                  <span className="text-[#febd14] font-bold text-sm">{Number(item.avg_rental_yield).toFixed(1)}%</span>
                </div>
              ))}
            </div>

            {/* Highest Appreciation */}
            <div className="bg-[#5c090f] rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="text-white font-semibold text-sm" style={{ fontFamily: 'Kaisei Opti, serif' }}>Fastest Growing</h3>
              </div>
              {topAppreciation.map((item, i) => (
                <div key={item.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-xs font-bold w-5">{i + 1}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{item.area_name}</p>
                      <p className="text-white/40 text-xs">{item.city}, {item.country}</p>
                    </div>
                  </div>
                  <span className="text-green-400 font-bold text-sm">{Number(item.avg_capital_appreciation).toFixed(1)}%</span>
                </div>
              ))}
            </div>

            {/* Lowest Risk */}
            <div className="bg-[#5c090f] rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-sm" style={{ fontFamily: 'Kaisei Opti, serif' }}>Lowest Risk</h3>
              </div>
              {lowestRisk.map((item, i) => (
                <div key={item.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400 text-xs font-bold w-5">{i + 1}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{item.area_name}</p>
                      <p className="text-white/40 text-xs">{item.city}, {item.country}</p>
                    </div>
                  </div>
                  <span className="text-blue-400 font-bold text-sm">{Number(item.risk_score).toFixed(0)}/100</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Data Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters Bar */}
          <div className="bg-[#5c090f] rounded-xl p-4 md:p-6 border border-white/10 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#febd14]" />
                <h3 className="text-white font-semibold text-sm" style={{ fontFamily: 'Kaisei Opti, serif' }}>Filter Markets</h3>
              </div>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search areas, cities, or notes..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#febd14]/50 transition-colors"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                />
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="text-[#febd14] text-sm hover:underline whitespace-nowrap" style={{ fontFamily: 'Kaisei Opti, serif' }}>
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <select
                value={selectedCountry}
                onChange={(e) => { setSelectedCountry(e.target.value); setSelectedCity(''); }}
                className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#febd14]/50 transition-colors appearance-none cursor-pointer"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <option value="" className="bg-[#5c090f]">All Countries</option>
                {countries.map(c => <option key={c} value={c} className="bg-[#5c090f]">{c}</option>)}
              </select>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#febd14]/50 transition-colors appearance-none cursor-pointer"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <option value="" className="bg-[#5c090f]">All Cities</option>
                {cities.map(c => <option key={c} value={c} className="bg-[#5c090f]">{c}</option>)}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#febd14]/50 transition-colors appearance-none cursor-pointer"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <option value="" className="bg-[#5c090f]">All Types</option>
                {propertyTypes.map(t => <option key={t} value={t} className="bg-[#5c090f]">{t}</option>)}
              </select>

              <select
                value={selectedTrend}
                onChange={(e) => setSelectedTrend(e.target.value)}
                className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#febd14]/50 transition-colors appearance-none cursor-pointer"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <option value="" className="bg-[#5c090f]">All Trends</option>
                <option value="rising" className="bg-[#5c090f]">Rising</option>
                <option value="stable" className="bg-[#5c090f]">Stable</option>
                <option value="declining" className="bg-[#5c090f]">Declining</option>
              </select>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p className="text-white/60 text-sm" style={{ fontFamily: 'Kaisei Opti, serif' }}>
              Showing <span className="text-white font-semibold">{filteredData.length}</span> of {data.length} areas
            </p>
            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#febd14]/50 appearance-none cursor-pointer"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                <option value="avg_rental_yield" className="bg-[#5c090f]">Sort: Rental Yield</option>
                <option value="avg_capital_appreciation" className="bg-[#5c090f]">Sort: Capital Growth</option>
                <option value="avg_price_per_sqm" className="bg-[#5c090f]">Sort: Price/sqm</option>
                <option value="risk_score" className="bg-[#5c090f]">Sort: Risk Score</option>
                <option value="demand_index" className="bg-[#5c090f]">Sort: Demand Index</option>
                <option value="vacancy_rate" className="bg-[#5c090f]">Sort: Vacancy Rate</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
              {/* View toggle */}
              <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 text-xs transition-colors ${viewMode === 'cards' ? 'bg-[#febd14] text-[#5c090f]' : 'text-white/60 hover:text-white'}`}
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-xs transition-colors ${viewMode === 'table' ? 'bg-[#febd14] text-[#5c090f]' : 'text-white/60 hover:text-white'}`}
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Table
                </button>
              </div>
            </div>
          </div>

          {/* Card View */}
          {viewMode === 'cards' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#5c090f] rounded-xl border border-white/10 hover:border-[#febd14]/30 transition-all group overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-5 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold text-base" style={{ fontFamily: 'Kaisei Opti, serif' }}>
                          {item.area_name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3 h-3 text-white/40" />
                          <span className="text-white/50 text-xs">{item.city}, {item.country}</span>
                        </div>
                      </div>
                      <TrendBadge trend={item.trend} />
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-0.5 bg-white/5 rounded text-white/60 text-xs">{item.property_type}</span>
                      <span className="text-white/30 text-xs">Q{item.quarter} {item.year}</span>
                    </div>

                    {/* Yield Bars */}
                    <div className="space-y-2.5 mb-4">
                      <YieldBar value={Number(item.avg_rental_yield)} max={maxYield} color="#febd14" label="Yield" />
                      <YieldBar value={Number(item.avg_capital_appreciation)} max={maxAppreciation} color="#22c55e" label="Growth" />
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-4 gap-2">
                      <ScoreIndicator value={Number(item.demand_index)} label="Demand" />
                      <ScoreIndicator value={Number(item.infrastructure_score)} label="Infra" />
                      <ScoreIndicator value={Number(item.risk_score)} label="Risk" inverted />
                      <div className="text-center">
                        <p className="text-white text-sm font-bold mt-2">${Number(item.avg_price_per_sqm).toLocaleString()}</p>
                        <span className="text-white/40 text-[10px]" style={{ fontFamily: 'Kaisei Opti, serif' }}>/sqm</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5">
                    <button
                      onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                      className="flex items-center gap-1.5 text-[#febd14] text-xs hover:underline"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      <Info className="w-3 h-3" />
                      {expandedRow === item.id ? 'Hide Analysis' : 'View Analysis'}
                    </button>
                    {expandedRow === item.id && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-white/60 text-xs leading-relaxed mb-3" style={{ fontFamily: 'Kaisei Opti, serif' }}>
                          {item.notes}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-white/40">Vacancy:</span>
                            <span className="text-white ml-1">{Number(item.vacancy_rate).toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-white/40">Pop. Growth:</span>
                            <span className="text-white ml-1">{Number(item.population_growth).toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-white/40">GDP Growth:</span>
                            <span className="text-white ml-1">{Number(item.gdp_growth).toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-white/40">Source:</span>
                            <span className="text-white ml-1">{item.data_source}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-[#5c090f] rounded-xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      {[
                        { key: 'area_name', label: 'Area' },
                        { key: 'city', label: 'City' },
                        { key: 'property_type', label: 'Type' },
                        { key: 'avg_rental_yield', label: 'Yield' },
                        { key: 'avg_capital_appreciation', label: 'Growth' },
                        { key: 'avg_price_per_sqm', label: 'Price/sqm' },
                        { key: 'vacancy_rate', label: 'Vacancy' },
                        { key: 'demand_index', label: 'Demand' },
                        { key: 'risk_score', label: 'Risk' },
                        { key: 'trend', label: 'Trend' },
                      ].map(col => (
                        <th
                          key={col.key}
                          onClick={() => handleSort(col.key)}
                          className="px-4 py-3 text-left text-xs text-white/50 font-medium cursor-pointer hover:text-white/80 transition-colors select-none"
                          style={{ fontFamily: 'Kaisei Opti, serif' }}
                        >
                          <div className="flex items-center gap-1">
                            {col.label}
                            {sortBy === col.key && (
                              sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <tr
                          onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                          className={`border-b border-white/5 cursor-pointer hover:bg-white/[0.03] transition-colors ${index % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                        >
                          <td className="px-4 py-3 text-white text-sm font-medium">{item.area_name}</td>
                          <td className="px-4 py-3 text-white/70 text-sm">{item.city}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 bg-white/5 rounded text-white/60 text-xs">{item.property_type}</span>
                          </td>
                          <td className="px-4 py-3 text-[#febd14] text-sm font-semibold">{Number(item.avg_rental_yield).toFixed(1)}%</td>
                          <td className="px-4 py-3 text-green-400 text-sm font-semibold">{Number(item.avg_capital_appreciation).toFixed(1)}%</td>
                          <td className="px-4 py-3 text-white text-sm">${Number(item.avg_price_per_sqm).toLocaleString()}</td>
                          <td className="px-4 py-3 text-white/70 text-sm">{Number(item.vacancy_rate).toFixed(1)}%</td>
                          <td className="px-4 py-3 text-white/70 text-sm">{Number(item.demand_index)}/100</td>
                          <td className="px-4 py-3 text-white/70 text-sm">{Number(item.risk_score)}/100</td>
                          <td className="px-4 py-3"><TrendBadge trend={item.trend} /></td>
                        </tr>
                        {expandedRow === item.id && (
                          <tr className="bg-white/[0.02]">
                            <td colSpan={10} className="px-4 py-4">
                              <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                  <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: 'Kaisei Opti, serif' }}>{item.notes}</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-xs md:w-72">
                                  <div>
                                    <span className="text-white/40 block">Infrastructure</span>
                                    <span className="text-white font-semibold">{Number(item.infrastructure_score)}/100</span>
                                  </div>
                                  <div>
                                    <span className="text-white/40 block">Pop. Growth</span>
                                    <span className="text-white font-semibold">{Number(item.population_growth).toFixed(1)}%</span>
                                  </div>
                                  <div>
                                    <span className="text-white/40 block">GDP Growth</span>
                                    <span className="text-white font-semibold">{Number(item.gdp_growth).toFixed(1)}%</span>
                                  </div>
                                  <div className="col-span-3">
                                    <span className="text-white/40 block">Source</span>
                                    <span className="text-white font-semibold">{item.data_source}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredData.length === 0 && (
            <div className="text-center py-16">
              <BarChart3 className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2" style={{ fontFamily: 'Kaisei Opti, serif' }}>No Markets Found</h3>
              <p className="text-white/50 text-sm mb-4" style={{ fontFamily: 'Kaisei Opti, serif' }}>Try adjusting your filters to see more results.</p>
              <button onClick={clearFilters} className="text-[#febd14] text-sm hover:underline" style={{ fontFamily: 'Kaisei Opti, serif' }}>Clear all filters</button>
            </div>
          )}
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-16 bg-[#5c090f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'Kaisei Opti, serif' }}>
              Our Methodology
            </h2>
            <p className="text-white/60 text-base leading-relaxed" style={{ fontFamily: 'Kaisei Opti, serif' }}>
              Our yield data is compiled from institutional-grade research reports, verified transaction data, and on-the-ground market intelligence across African property markets.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#5c090f] rounded-xl p-6 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-[#febd14]/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5 text-[#febd14]" />
              </div>
              <h3 className="text-white font-semibold mb-2" style={{ fontFamily: 'Kaisei Opti, serif' }}>Data Sources</h3>
              <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: 'Kaisei Opti, serif' }}>
                We aggregate data from HassConsult, Knight Frank Africa, Cytonn Research, SAPOA, and proprietary transaction records. All figures are cross-referenced for accuracy.
              </p>
            </div>
            <div className="bg-[#5c090f] rounded-xl p-6 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-green-400/10 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2" style={{ fontFamily: 'Kaisei Opti, serif' }}>Risk Scoring</h3>
              <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: 'Kaisei Opti, serif' }}>
                Risk scores (0-100) factor in regulatory environment, currency stability, market liquidity, title security, and political risk. Lower scores indicate lower risk.
              </p>
            </div>
            <div className="bg-[#5c090f] rounded-xl p-6 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2" style={{ fontFamily: 'Kaisei Opti, serif' }}>Update Frequency</h3>
              <p className="text-white/60 text-sm leading-relaxed" style={{ fontFamily: 'Kaisei Opti, serif' }}>
                Data is updated quarterly with interim adjustments for significant market events. Trend indicators reflect 12-month directional movement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'Kaisei Opti, serif' }}>
            Get Notified When Markets Move
          </h2>
          <p className="text-white/60 text-base mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Kaisei Opti, serif' }}>
            Set up your notification preferences to receive alerts when new data is published or when markets matching your investment criteria show significant changes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#febd14] text-[#5c090f] font-semibold rounded-lg hover:bg-[#febd14]/90 transition-colors"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Set Up Alerts
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('listings')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              View Listings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketYieldView;
