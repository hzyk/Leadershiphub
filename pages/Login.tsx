
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.BASIC);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    await login(email, role);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-slate-500">Log in to your member account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Select Role (Demo only)</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 appearance-none"
            >
              <option value={UserRole.BASIC}>Basic Member</option>
              <option value={UserRole.FULL}>Full Member</option>
              <option value={UserRole.LEADERSHIP}>Leadership / Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login to Dashboard'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Don't have an account? <Link to="/register" className="text-indigo-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
