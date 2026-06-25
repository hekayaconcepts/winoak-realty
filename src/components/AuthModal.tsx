import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError('');
    setMessage('');
  };

  const sendSignupConfirmationEmail = async (userEmail: string, userName: string) => {
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'signup_confirmation',
          email: userEmail,
          name: userName,
        },
      });
    } catch (err) {
      console.error('Failed to send signup confirmation email:', err);
    }
  };

  const createDefaultNotificationPreferences = async (userId: string) => {
    try {
      await supabase.from('user_notification_preferences').upsert({
        user_id: userId,
        email_new_listings: true,
        email_new_articles: true,
        email_weekly_digest: true,
        preferred_property_types: [],
        preferred_cities: [],
        preferred_categories: [],
      });
    } catch (err) {
      console.error('Failed to create notification preferences:', err);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      onAuthSuccess();
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Send signup confirmation email
      sendSignupConfirmationEmail(email, fullName);

      // Create default notification preferences if user was created
      if (data.user) {
        createDefaultNotificationPreferences(data.user.id);
      }
      
      setMessage('Account created successfully. Check your email to confirm your account.');
      setMode('signin');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      setMessage('Check your email for a password reset link.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#5c090f] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-8 pb-0">
          <div className="flex justify-center mb-6">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/696a15fcf7f37ab46f03b95f_1768560149377_0263ab94.png" 
              alt="WinOak Realty" 
              className="h-12 w-auto"
            />
          </div>
          
          <h2 
            className="text-white text-2xl font-bold text-center mb-2"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          
          <p 
            className="text-white/60 text-center text-sm"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            {mode === 'signin' && 'Sign in to access your dashboard'}
            {mode === 'signup' && 'Join our community of investors'}
            {mode === 'forgot' && 'Enter your email to receive a reset link'}
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 text-green-400 text-sm text-center">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={
            mode === 'signin' ? handleSignIn : 
            mode === 'signup' ? handleSignUp : 
            handleForgotPassword
          }>
            {mode === 'signup' && (
              <div className="mb-4">
                <label 
                  className="block text-white/60 text-sm mb-2"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#febd14] transition-colors"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                    required
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label 
                className="block text-white/60 text-sm mb-2"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#febd14] transition-colors"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="mb-6">
                <label 
                  className="block text-white/60 text-sm mb-2"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#febd14] transition-colors"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setError('');
                    setMessage('');
                  }}
                  className="text-[#febd14] text-sm hover:underline"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#febd14] text-[#5c090f] font-semibold rounded-lg hover:bg-[#febd14]/90 transition-colors disabled:opacity-50"
              style={{ fontFamily: 'Kaisei Opti, serif' }}
            >
              {loading ? (
                'Please wait...'
              ) : (
                <>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Link'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            {mode === 'signin' && (
              <p 
                className="text-white/60 text-sm"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signup');
                    setError('');
                    setMessage('');
                  }}
                  className="text-[#febd14] hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}
            {(mode === 'signup' || mode === 'forgot') && (
              <p 
                className="text-white/60 text-sm"
                style={{ fontFamily: 'Kaisei Opti, serif' }}
              >
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signin');
                    setError('');
                    setMessage('');
                  }}
                  className="text-[#febd14] hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
