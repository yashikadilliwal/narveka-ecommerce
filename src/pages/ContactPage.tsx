import React, { useState } from 'react';
import { BRAND } from '../config/brand';
import { useToast } from '../context/ToastContext';
import { Mail, Phone, Clock, MapPin, Send, Check } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Order & Delivery Concierge');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all fields.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your message has been sent to our atelier concierge.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pb-6 border-b border-brand-lightgrey">
        <span className="text-[11px] uppercase tracking-luxury text-brand-gold font-semibold">
          {BRAND.established} • ATELIER CONCIERGE
        </span>
        <h1 className="editorial-title text-3xl sm:text-5xl font-bold text-brand-black">
          Client Services & Contact
        </h1>
        <p className="text-xs text-brand-stone leading-relaxed">
          Our client concierge is at your service for styling inquiries, order tracking, bespoke sizing guidance, and atelier appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-brand-offwhite p-6 sm:p-8 border border-brand-lightgrey space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-luxury text-brand-black pb-3 border-b border-brand-lightgrey">
              Atelier Coordinates
            </h3>

            <div className="flex items-start gap-3 text-xs">
              <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-brand-black">Design Studio & Headquarters</p>
                <p className="text-brand-stone mt-0.5 leading-relaxed">{BRAND.contact.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <Mail className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-brand-black">Client Concierge Email</p>
                <a
                  href={`mailto:${BRAND.contact.email}`}
                  className="text-brand-charcoal hover:text-brand-gold transition-colors mt-0.5 block"
                >
                  {BRAND.contact.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <Phone className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-brand-black">VIP WhatsApp Concierge</p>
                <p className="text-brand-stone mt-0.5">{BRAND.contact.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <Clock className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-brand-black">Atelier Operating Hours</p>
                <p className="text-brand-stone mt-0.5">{BRAND.contact.hours}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-brand-charcoal text-brand-ivory border border-brand-charcoal space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-luxury text-brand-gold">
              7-Day Doorstep Returns
            </h4>
            <p className="text-xs text-brand-stone leading-relaxed">
              Need a size exchange? Simply write to concierge@narveka.com with your order number. A door-to-door courier swap will be scheduled at your convenience.
            </p>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-brand-offwhite p-6 sm:p-10 border border-brand-lightgrey shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-luxury text-brand-black pb-4 border-b border-brand-lightgrey mb-6">
            Dispatch A Message To Our Concierge
          </h3>

          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-brand-black text-brand-gold mx-auto flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="editorial-title text-xl font-bold text-brand-black">
                Message Received
              </h4>
              <p className="text-xs text-brand-stone max-w-md mx-auto">
                Thank you, {name}. A member of the NARVEKA client team will review your inquiry and respond within 24 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold uppercase tracking-wider text-brand-black underline pt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arjun Mehta"
                    className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arjun@example.com"
                    className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold cursor-pointer"
                >
                  <option value="Order & Delivery Concierge">Order Status & Delivery Inquiries</option>
                  <option value="Sizing & Fit Advice">Sizing & Silhouette Advice</option>
                  <option value="Exchange or Return Request">Size Exchange or Doorstep Return</option>
                  <option value="Press & Atelier Collabs">Press & Collaboration Inquiries</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How may our atelier assist you today?"
                  className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-black text-brand-ivory hover:bg-brand-charcoal hover:text-brand-gold text-xs font-semibold uppercase tracking-luxury transition-all flex items-center justify-center gap-2 border border-brand-black"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
