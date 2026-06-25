import React from 'react';
import { MapPin, Home, Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  onSave?: (property: Property) => void;
  isSaved?: boolean;
  showSaveButton?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onViewDetails, 
  onSave, 
  isSaved = false,
  showSaveButton = true 
}) => {
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'KES') {
      if (price >= 1000000) {
        return `KES ${(price / 1000000).toFixed(1)}M`;
      }
      return `KES ${price.toLocaleString()}`;
    }
    return `${currency} ${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-300';
      case 'ongoing':
        return 'bg-green-500/20 text-green-300';
      case 'complete':
        return 'bg-gray-500/20 text-gray-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="group bg-[#5c090f] rounded-xl overflow-hidden border border-white/5 hover:border-[#febd14]/30 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span 
            className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(property.status)}`}
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            {property.status}
          </span>
        </div>

        {/* Save Button */}
        {showSaveButton && onSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(property);
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

        {/* Price */}
        <div className="absolute bottom-4 left-4">
          <p 
            className="text-[#febd14] text-xl font-bold"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            {formatPrice(property.price, property.price_currency)}
          </p>
        </div>

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <span 
              className="px-3 py-1 rounded-full text-xs font-medium bg-[#febd14] text-[#5c090f] uppercase tracking-wide"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 
            className="text-white text-lg font-semibold line-clamp-1 group-hover:text-[#febd14] transition-colors"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            {property.name}
          </h3>
          <span 
            className="flex-shrink-0 px-2 py-1 rounded bg-white/5 text-white/60 text-xs"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            {property.property_type}
          </span>
        </div>

        <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span 
            className="line-clamp-1"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            {property.location}
          </span>
        </div>

        {/* Key Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.key_features?.slice(0, 3).map((feature, index) => (
            <span 
              key={index}
              className="px-2 py-1 rounded bg-white/5 text-white/60 text-xs"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              {feature}
            </span>
          ))}
          {property.key_features?.length > 3 && (
            <span 
              className="px-2 py-1 rounded bg-white/5 text-white/40 text-xs"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              +{property.key_features.length - 3} more
            </span>
          )}
        </div>

        {/* View Details Button */}
        <button
          onClick={() => onViewDetails(property)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-[#febd14] text-white hover:text-[#5c090f] rounded-lg transition-all duration-300 group/btn"
          style={{ fontFamily: 'Kaisei Opti, serif' }}
        >
          <span className="text-sm font-medium">View Details</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
