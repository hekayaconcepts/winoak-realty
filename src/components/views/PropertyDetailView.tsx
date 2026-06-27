import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, MapPin, Building2, Calendar, Eye, Download, FileText,
  Bookmark, BookmarkCheck, Share2, ChevronLeft, ChevronRight,
  Check, Phone, Mail, Loader2
} from 'lucide-react';
import { Property, ViewType } from '@/types';

interface PropertyDetailViewProps {
  property: Property;
  onBack: () => void;
  onSave?: (property: Property) => void;
  isSaved?: boolean;
  isAuthenticated: boolean;
  userId?: string;
}

const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  property,
  onBack,
  onSave,
  isSaved = false,
  isAuthenticated,
  userId,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [memoStatus, setMemoStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const images = property.images?.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200'];

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'KES') {
      return `KES ${price.toLocaleString()}`;
    }
    return `${currency} ${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'ongoing':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'complete':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus('loading');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setInquiryStatus('success');
  };

  const handleDownloadMemo = async () => {
    setMemoStatus('loading');
    try {
      const { data, error } = await supabase.functions.invoke('generate-deal-memo', {
        body: { property_id: property.id, user_id: userId || null },
      });
      if (error || !data?.pdf_base64) throw new Error('Failed to generate memo');

      // Convert base64 -> Blob -> download
      const byteChars = atob(data.pdf_base64);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
      const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename || 'deal-memo.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMemoStatus('idle');
    } catch (err) {
      console.error('Deal memo error:', err);
      setMemoStatus('error');
      setTimeout(() => setMemoStatus('idle'), 4000);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          style={{ fontFamily: 'Kaisei Opti, serif' }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Listings</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#5c090f]">
              <img
                src={images[currentImageIndex]}
                alt={property.name}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span 
                  className={`px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide border ${getStatusColor(property.status)}`}
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {property.status}
                </span>
              </div>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {isAuthenticated && onSave && (
                  <button
                    onClick={() => onSave(property)}
                    className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-[#febd14]" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                )}
                <button
                  className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Property Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span 
                  className="px-3 py-1 rounded-full bg-[#febd14]/10 text-[#febd14] text-sm"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  {property.property_type}
                </span>
                {property.featured && (
                  <span 
                    className="px-3 py-1 rounded-full bg-[#febd14] text-[#5c090f] text-sm font-medium"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    Featured
                  </span>
                )}
              </div>

              <h1 
                className="text-white text-2xl md:text-3xl font-bold mb-4"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                {property.name}
              </h1>

              <div className="flex items-center gap-2 text-white/60 mb-6">
                <MapPin className="w-5 h-5" />
                <span style={{ fontFamily: 'Kaisei Opti, serif' }}>{property.location}</span>
              </div>

              <p 
                className="text-[#febd14] text-3xl font-bold mb-8"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                {formatPrice(property.price, property.price_currency)}
              </p>

              {/* Description */}
              <div className="mb-8">
                <h2 
                  className="text-white text-xl font-semibold mb-4"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  About This Property
                </h2>
                <p 
                  className="text-white/70 leading-relaxed"
                  style={{ fontFamily: 'Kaisei Opti, serif', lineHeight: 1.8 }}
                >
                  {property.description || 'No description available.'}
                </p>
              </div>

              {/* Key Features */}
              {property.key_features && property.key_features.length > 0 && (
                <div>
                  <h2 
                    className="text-white text-xl font-semibold mb-4"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    Key Features
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {property.key_features.map((feature, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-3 bg-[#5c090f] rounded-lg"
                      >
                        <Check className="w-5 h-5 text-[#febd14] flex-shrink-0" />
                        <span 
                          className="text-white/80 text-sm"
                          style={{ fontFamily: 'Kaisei Opti, serif' }}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Inquiry Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-[#5c090f] rounded-xl p-6 border border-white/5">
                <h3 
                  className="text-white text-lg font-semibold mb-4"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Interested in this property?
                </h3>

                {inquiryStatus === 'success' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-400" />
                    </div>
                    <h4 
                      className="text-white font-semibold mb-2"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      Inquiry Sent!
                    </h4>
                    <p 
                      className="text-white/60 text-sm"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      We'll be in touch within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInquiry} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#febd14] transition-colors"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#febd14] transition-colors"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#febd14] transition-colors"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    />
                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#febd14] transition-colors resize-none"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                      defaultValue={`I'm interested in ${property.name}. Please send me more information.`}
                    />
                    <button
                      type="submit"
                      disabled={inquiryStatus === 'loading'}
                      className="w-full px-6 py-4 bg-[#febd14] text-[#5c090f] font-semibold rounded-lg hover:bg-[#febd14]/90 transition-colors disabled:opacity-50"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      {inquiryStatus === 'loading' ? 'Sending...' : 'Send Inquiry'}
                    </button>
                  </form>
                )}
                {/* Download Deal Memo */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={handleDownloadMemo}
                    disabled={memoStatus === 'loading'}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#febd14] text-[#5c090f] font-semibold rounded-lg hover:bg-[#febd14]/90 transition-colors disabled:opacity-60"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    {memoStatus === 'loading' ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /><span>Generating PDF...</span></>
                    ) : (
                      <><FileText className="w-5 h-5" /><span>Download Deal Memo</span></>
                    )}
                  </button>
                  {memoStatus === 'error' && (
                    <p className="text-red-400 text-xs mt-2 text-center" style={{ fontFamily: 'Kaisei Opti, serif' }}>
                      Could not generate the memo. Please try again.
                    </p>
                  )}
                  <p className="text-white/40 text-xs mt-2 text-center" style={{ fontFamily: 'Kaisei Opti, serif' }}>
                    Full deal analysis with market yields, comparables & risk assessment.
                  </p>
                </div>

                {/* PDF Brochure Download */}
                {property.pdf_url && (
                  <div className="mt-4">
                    <a
                      href={property.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Brochure</span>
                    </a>
                  </div>
                )}


                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                  <a
                    href="mailto:HELLENAWINI@GMAIL.COM"
                    className="flex items-center gap-3 text-white/60 hover:text-white transition-colors text-sm"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    <Mail className="w-4 h-4" />
                    <span>HELLENAWINI@GMAIL.COM</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailView;
