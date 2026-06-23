import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, MessageSquare, Building2, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    inquiryType: 'general',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // In production, this would send to an edge function or email service
      // For now, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        inquiryType: 'general',
        message: '',
      });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to send message. Please try again.');
    }
  };

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'investment', label: 'Investment Opportunity' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'media', label: 'Media & Press' },
    { value: 'support', label: 'Technical Support' },
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Header */}
      <section className="py-12 md:py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 
            className="text-white text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Contact Us
          </h1>
          <p 
            className="text-white/60 text-lg max-w-2xl"
            style={{ fontFamily: 'Kaisei Opti, serif' }}
          >
            Have questions about African real estate investment? We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#eaae31]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#eaae31]" />
                  </div>
                  <div>
                    <h3 
                      className="text-white font-semibold mb-1"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      Email
                    </h3>
                    <p 
                      className="text-white/60 text-sm"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      hello@africanpropertybrief.com
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#eaae31]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#eaae31]" />
                  </div>
                  <div>
                    <h3 
                      className="text-white font-semibold mb-1"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      Location
                    </h3>
                    <p 
                      className="text-white/60 text-sm"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      Nairobi, Kenya
                    </p>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#eaae31]/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-[#eaae31]" />
                  </div>
                  <div>
                    <h3 
                      className="text-white font-semibold mb-1"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      Response Time
                    </h3>
                    <p 
                      className="text-white/60 text-sm"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      We typically respond within 24-48 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-12 p-6 bg-[#1e3235] rounded-xl border border-white/5">
                <h3 
                  className="text-white font-semibold mb-4"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Quick Links
                </h3>
                <div className="space-y-3">
                  <a 
                    href="#" 
                    className="flex items-center gap-3 text-white/60 hover:text-[#eaae31] transition-colors text-sm"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>List Your Property</span>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center gap-3 text-white/60 hover:text-[#eaae31] transition-colors text-sm"
                    style={{ fontFamily: 'Kaisei Opti, serif' }}
                  >
                    <Users className="w-4 h-4" />
                    <span>Become a Partner Agent</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-[#1e3235] rounded-xl p-6 md:p-8 border border-white/5">
                <h2 
                  className="text-white text-xl font-semibold mb-6"
                  style={{ fontFamily: 'Kaisei Opti, serif' }}
                >
                  Send us a message
                </h2>

                {status === 'success' ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 
                      className="text-white text-xl font-semibold mb-2"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      Message Sent!
                    </h3>
                    <p 
                      className="text-white/60"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      Thank you for reaching out. We'll get back to you within 24-48 hours.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-6 px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {status === 'error' && (
                      <div className="p-4 rounded-lg bg-red-500/10 text-red-400 text-sm">
                        {errorMessage}
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label 
                          className="block text-white/60 text-sm mb-2"
                          style={{ fontFamily: 'Kaisei Opti, serif' }}
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#eaae31] transition-colors"
                          style={{ fontFamily: 'Kaisei Opti, serif' }}
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label 
                          className="block text-white/60 text-sm mb-2"
                          style={{ fontFamily: 'Kaisei Opti, serif' }}
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#eaae31] transition-colors"
                          style={{ fontFamily: 'Kaisei Opti, serif' }}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Inquiry Type */}
                      <div>
                        <label 
                          className="block text-white/60 text-sm mb-2"
                          style={{ fontFamily: 'Kaisei Opti, serif' }}
                        >
                          Inquiry Type
                        </label>
                        <select
                          value={formData.inquiryType}
                          onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#eaae31] transition-colors appearance-none cursor-pointer"
                          style={{ fontFamily: 'Kaisei Opti, serif' }}
                        >
                          {inquiryTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subject */}
                      <div>
                        <label 
                          className="block text-white/60 text-sm mb-2"
                          style={{ fontFamily: 'Kaisei Opti, serif' }}
                        >
                          Subject *
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="What's this about?"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#eaae31] transition-colors"
                          style={{ fontFamily: 'Kaisei Opti, serif' }}
                          required
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label 
                        className="block text-white/60 text-sm mb-2"
                        style={{ fontFamily: 'Kaisei Opti, serif' }}
                      >
                        Message *
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#eaae31] transition-colors resize-none"
                        style={{ fontFamily: 'Kaisei Opti, serif' }}
                        required
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#eaae31] text-[#2a4347] font-semibold rounded-lg hover:bg-[#eaae31]/90 transition-colors disabled:opacity-50"
                      style={{ fontFamily: 'Kaisei Opti, serif' }}
                    >
                      {status === 'loading' ? (
                        'Sending...'
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactView;
