import React, { useState } from 'react';
import { Menu, X, User, ChevronDown, BarChart3 } from 'lucide-react';
import { ViewType } from '@/types';

interface HeaderProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  isAuthenticated: boolean;
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, isAuthenticated, onAuthClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: 'home' as ViewType },
    { label: 'About', view: 'about' as ViewType },
    { label: 'Insights', view: 'blog' as ViewType },
    { label: 'Listings', view: 'listings' as ViewType },
    { label: 'Market Yields', view: 'market-yields' as ViewType },
    { label: 'Podcast', view: 'podcast' as ViewType },
    { label: 'Contact', view: 'contact' as ViewType },
  ];

  const authenticatedNavItems = [
    { label: 'Dashboard', view: 'dashboard' as ViewType },
    { label: 'Saved Listings', view: 'saved-listings' as ViewType },
    { label: 'Saved Articles', view: 'saved-articles' as ViewType },
    { label: 'Audio Library', view: 'audio-library' as ViewType },
    { label: 'Profile', view: 'profile' as ViewType },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#5c090f] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#edbf6d' }}>
                <span className="text-lg font-bold" style={{ fontFamily: 'Kaisei Opti, serif' }}>W</span>
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: 'Kaisei Opti, serif' }}>WinOak</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  currentView === item.view
                    ? 'text-[#febd14]'
                    : 'text-white/90 hover:text-white'
                }`}
                style={{ fontFamily: 'Kaisei Opti, serif', color: currentView === item.view ? '#febd14' : '#ffffff' }}
              >
                {item.view === 'market-yields' ? (
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5" />
                    {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </button>
            ))}
          </nav>

          {/* Desktop Auth/User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#edbf6d] flex items-center justify-center">
                    <User className="w-4 h-4 text-[#5c090f]" />
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-[#5c090f] border border-white/10 rounded-lg shadow-xl py-2 z-50">
                      {authenticatedNavItems.map((item) => (
                        <button
                          key={item.view}
                          onClick={() => {
                            onNavigate(item.view);
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                          style={{ fontFamily: 'Kaisei Opti, serif' }}
                        >
                          {item.label}
                        </button>
                      ))}
                      <hr className="my-2 border-white/10" />
                      <button
                        onClick={() => {
                          onAuthClick();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                        style={{ fontFamily: 'Kaisei Opti, serif' }}
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-4 py-2 text-sm font-medium text-[#0f0f0f] bg-[#edbf6d] rounded-lg hover:bg-[#edbf6d]/90 transition-colors"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#5c090f] border-t border-white/10">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.view
                    ? 'text-[#febd14] bg-white/5'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
                style={{ fontFamily: 'Kaisei Opti, serif', color: currentView === item.view ? '#febd14' : '#ffffff' }}
              >
                {item.view === 'market-yields' ? (
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </button>
            ))}
            
            {isAuthenticated && (
              <>
                <hr className="my-4 border-white/10" />
                {authenticatedNavItems.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => {
                      onNavigate(item.view);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      currentView === item.view
                        ? 'text-[#febd14] bg-white/5'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            )}
            
            <hr className="my-4 border-white/10" />
            <button
              onClick={() => {
                onAuthClick();
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 text-sm font-medium text-[#0f0f0f] bg-[#edbf6d] rounded-lg hover:bg-[#edbf6d]/90 transition-colors"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              {isAuthenticated ? 'Sign Out' : 'Sign In'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
