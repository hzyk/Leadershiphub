
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, User, Lock, Loader2 } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    await register(name, email);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-slate-500">Join our organization today as a Basic Member</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <p className="text-xs text-slate-500">By registering, you agree to our Terms of Service and Privacy Policy. New accounts default to Basic Membership.</p>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Basic Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
