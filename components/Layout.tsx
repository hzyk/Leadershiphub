
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  User as UserIcon, 
  ArrowUpCircle, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import Logo from './Logo';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: [UserRole.BASIC, UserRole.FULL, UserRole.LEADERSHIP] },
    { label: 'Courses', path: '/courses', icon: BookOpen, roles: [UserRole.BASIC, UserRole.FULL, UserRole.LEADERSHIP] },
    { label: 'Profile', path: '/profile', icon: UserIcon, roles: [UserRole.BASIC, UserRole.FULL, UserRole.LEADERSHIP] },
    { label: 'Upgrade', path: '/upgrade', icon: ArrowUpCircle, roles: [UserRole.BASIC, UserRole.FULL] },
    { label: 'Admin', path: '/admin', icon: Settings, roles: [UserRole.LEADERSHIP] },
  ];

  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <Logo className="group-hover:rotate-12 transition-transform duration-300" size={32} />
                <span className="text-2xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  MEMBERHUB
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {user ? (
                  <>
                    {filteredNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          location.pathname === item.path 
                          ? 'bg-slate-800 text-white' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <item.icon size={16} />
                          {item.label}
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                    >
                      <LogOut size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/" className="text-slate-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                    <Link to="/about" className="text-slate-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</Link>
                    <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-indigo-500/20">Login</Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {user ? (
                  filteredNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} />
                        {item.label}
                      </div>
                    </Link>
                  ))
                ) : (
                  <>
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-slate-400 hover:text-white">Home</Link>
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-slate-400 hover:text-white">About</Link>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-indigo-400 font-bold">Login</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo size={24} />
              <h3 className="text-xl font-bold text-white">MemberHub</h3>
            </div>
            <p className="text-slate-500 text-sm max-w-xs">
              Empowering individuals and leaders through structured learning, membership growth, and collaborative tools.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-indigo-400">Mission & Vision</Link></li>
              <li><Link to="/courses" className="hover:text-indigo-400">Our Courses</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400">Join Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Contact Support</h4>
            <div className="flex items-center gap-3 text-slate-500 hover:text-green-400 cursor-pointer">
              <Phone size={18} />
              <a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer">
                WhatsApp: {WHATSAPP_NUMBER}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-900 text-center text-slate-600 text-xs">
          &copy; {new Date().getFullYear()} MemberHub Organization. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
