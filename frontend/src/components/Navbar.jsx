import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, Phone, Calendar, User, ChevronRight, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', isHash: false },
    { name: 'About', path: '#about', isHash: true },
    { name: 'Departments', path: '#departments', isHash: true },
    { name: 'Doctors', path: '#doctors', isHash: true },
    { name: 'Diagnostics', path: '/diagnostics', isHash: false },
    { name: 'QTrack', path: '/qtrack', isHash: false },
    { name: 'Contact', path: '/contact', isHash: false },
  ];

  // Smart active check: Home is only active on exact '/'
  // Other pages use startsWith so /qtrack/patient/dashboard still highlights QTrack
  // Hash links are NEVER shown as page-active (they're anchors, not routes)
  const isActive = (link) => {
    if (link.isHash) return false;
    if (link.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(link.path);
  };

  const handleNavClick = (e, link) => {
    if (link.isHash) {
      e.preventDefault();
      // If not on homepage, navigate there first then scroll
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const target = document.querySelector(link.path);
          if (target) {
            const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }
        }, 100);
      } else {
        const target = document.querySelector(link.path);
        if (target) {
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      }
      if (mobileMenuOpen) setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 z-50 w-full px-6 lg:px-10 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-[70px] bg-slate-900/95 shadow-medium border-b border-white/10 backdrop-blur-md' : 'h-[80px] bg-transparent'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-white">
          <Activity size={32} className="text-white" strokeWidth={2.5} />
          <span>XYZ Hospital</span>
        </Link>
        
        {/* Desktop Nav */}
        <ul className="hidden lg:flex gap-7 items-center list-none m-0 p-0">
          {navLinks.map((link) => (
            <li key={link.name}>
              {link.isHash ? (
                <a 
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className="cursor-pointer text-[0.95rem] font-medium relative transition-colors duration-300 group text-slate-300 hover:text-white"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 h-[2px] bg-white transition-all duration-300 w-0 group-hover:w-full"></span>
                </a>
              ) : (
                <Link 
                  to={link.path} 
                  className={`text-[0.95rem] font-medium relative transition-colors duration-300 group ${
                    isActive(link) ? 'text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-white transition-all duration-300 ${
                    isActive(link) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex gap-3 items-center">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm text-slate-300 hover:text-white font-medium flex items-center gap-1.5 transition-colors">
                <User size={16} /> My Account
              </Link>
              <button onClick={handleLogout} className="btn btn-outline text-white hover:bg-white/10 hover:border-white px-3 border-transparent cursor-pointer">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-outline text-white hover:bg-white/10 hover:border-white px-3 border-transparent cursor-pointer">
              <User size={18} /> Login
            </Link>
          )}
          <Link to="/emergency" className="btn btn-emergency cursor-pointer">
            <Phone size={18} /> Emergency
          </Link>
          <Link to="/appointments" className="btn btn-primary cursor-pointer">
            <Calendar size={18} /> Book Appointment
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden bg-transparent border-none cursor-pointer text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-[70px] left-0 right-0 bottom-0 bg-slate-900 border-t border-white/10 z-40 p-8 flex flex-col gap-6 overflow-y-auto">
          <div className="flex flex-col gap-3 border-b border-white/20 pb-6">
            {isAuthenticated ? (
              <div className="flex items-center justify-between mb-2">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-white font-bold flex items-center gap-2 hover:text-blue-400"><User size={18} /> My Account</Link>
                <button onClick={handleLogout} className="text-red-400 text-sm font-bold">Logout</button>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-outline text-white border-white/20" onClick={() => setMobileMenuOpen(false)}>Login / Register</Link>
            )}
            <Link to="/emergency" className="btn btn-emergency" onClick={() => setMobileMenuOpen(false)}>
              <Phone size={18} /> Emergency
            </Link>
            <Link to="/appointments" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
              <Calendar size={18} /> Book Appointment
            </Link>
          </div>
          <ul className="list-none p-0 m-0 flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.isHash ? (
                  <a href={link.path} className="flex items-center justify-between text-lg font-medium no-underline text-slate-400 hover:text-white"
                    onClick={(e) => handleNavClick(e, link)}>
                    {link.name}
                    <ChevronRight size={18} strokeWidth={1.5} className="text-slate-500" />
                  </a>
                ) : (
                  <Link to={link.path} className={`flex items-center justify-between text-lg font-medium no-underline ${isActive(link) ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                    onClick={() => setMobileMenuOpen(false)}>
                    {link.name}
                    <ChevronRight size={18} strokeWidth={1.5} className="text-slate-500" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
