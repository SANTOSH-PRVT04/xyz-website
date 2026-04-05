import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Phone, Mail, MapPin, Clock, ArrowUp, Globe, MessageCircle, Camera, Play, Briefcase } from 'lucide-react';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/#about' },
  { name: 'QTrack Portal', path: '/qtrack' },
  { name: 'Book Appointment', path: '/appointments' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Login', path: '/auth' },
];

const deptLinks = [
  { name: 'Cardiology', path: '/departments/cardiology' },
  { name: 'Neurology', path: '/departments/neurology' },
  { name: 'Orthopedics', path: '/departments/orthopedics' },
  { name: 'Pediatrics', path: '/departments/pediatrics' },
  { name: 'Dermatology', path: '/departments/dermatology' },
  { name: 'Emergency Care', path: '/emergency' },
];

const serviceLinks = [
  { name: 'Emergency Services', path: '/emergency' },
  { name: 'Diagnostics & Lab', path: '/diagnostics' },
  { name: 'Health Packages', path: '/packages' },
  { name: 'Find a Doctor', path: '/#doctors' },
];

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 text-white text-xl font-bold mb-4 hover:opacity-90 transition-opacity">
              <Activity size={28} className="text-blue-400" strokeWidth={2.5} />
              XYZ Hospital
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Delivering world-class healthcare with compassion. Powered by QTrack smart queue technology for zero-wait patient experiences.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[Globe, MessageCircle, Camera, Play, Briefcase].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-blue-400 hover:pl-1 transition-all duration-200">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-blue-400 hover:pl-1 transition-all duration-200">{link.name}</Link>
                </li>
              ))}
            </ul>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mt-8 mb-4">Departments</h4>
            <ul className="space-y-2.5">
              {deptLinks.slice(0, 4).map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-blue-400 hover:pl-1 transition-all duration-200">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-400 mt-0.5 shrink-0" />
                <p className="text-sm leading-relaxed">123 Healthcare Blvd, Medical District, New Delhi – 110001</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-blue-400 shrink-0" />
                <div>
                  <p className="text-sm">+91 1800-123-4567</p>
                  <p className="text-xs text-slate-500">24/7 Helpline</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-blue-400 shrink-0" />
                <p className="text-sm">care@xyzhospital.com</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-blue-400 shrink-0" />
                <div>
                  <p className="text-sm">Mon – Sat: 8:00 AM – 9:00 PM</p>
                  <p className="text-xs text-slate-500">Emergency: 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} XYZ Hospital. All rights reserved. Powered by <span className="text-blue-400 font-semibold">QTrack</span>.</p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-blue-400 transition-colors group"
          >
            Back to Top <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
