import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 py-16 px-6 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
            <p className="text-blue-100 text-lg max-w-xl mx-auto">Have questions? We're here to help. Reach out and our team will respond promptly.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Get in Touch</h2>
            {[
              { icon: MapPin, label: 'Address', value: '123 Healthcare Blvd, Medical District, New Delhi – 110001' },
              { icon: Phone, label: 'Phone', value: '+91 1800-123-4567 (Toll Free)' },
              { icon: Mail, label: 'Email', value: 'care@xyzhospital.com' },
              { icon: Clock, label: 'Hours', value: 'Mon – Sat: 8 AM – 9 PM | Emergency: 24/7' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="text-slate-700 text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="w-full h-48 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              <p className="text-slate-400 text-sm font-medium">📍 Map integration — coming soon</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle size={22} className="text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-800">Send a Message</h2>
              </div>

              {submitted ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center py-16 text-center"
                >
                  <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Message Sent!</h3>
                  <p className="text-slate-500">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">Full Name</label>
                      <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">Email</label>
                      <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none" placeholder="you@email.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">Phone</label>
                      <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none" placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">Subject</label>
                      <input type="text" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none" placeholder="How can we help?" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-1.5 block">Message</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:outline-none resize-none" placeholder="Tell us more..." />
                  </div>
                  <button type="submit" className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all">
                    <Send size={18} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
