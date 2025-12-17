
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Calendar, Award, Camera, Save, Check } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    updateUser({ name, email });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Personal Profile</h1>
        <p className="text-slate-400">Manage your identity and membership information.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center relative group">
            <div className="relative inline-block mb-4">
              <img 
                src={user?.avatar} 
                alt="Avatar" 
                className="w-32 h-32 rounded-full border-4 border-slate-800 shadow-2xl mx-auto"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg">
                <Camera size={16} />
              </button>
            </div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-400/20">
              <Award size={12} />
              {user?.role} MEMBER
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
              <Calendar size={14} />
              Joined {new Date(user?.joinDate || '').toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold border-b border-slate-800 pb-4">General Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Bio</label>
              <textarea 
                placeholder="Tell us about yourself..."
                className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm h-32 resize-none"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                  saved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/10'
                }`}
              >
                {saving ? (
                  <>Saving...</>
                ) : saved ? (
                  <>
                    <Check size={18} />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
