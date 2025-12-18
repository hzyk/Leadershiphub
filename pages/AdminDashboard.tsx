
import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  ArrowUpCircle, 
  TrendingUp,
  Activity,
  UserCheck,
  Check,
  X,
  BellPlus,
  Send,
  Trash2,
  Edit,
  Plus,
  Mail,
  ShieldAlert,
  Search,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { MOCK_COURSES } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

const analyticsData = [
  { name: 'Mon', users: 400, courses: 240 },
  { name: 'Tue', users: 300, courses: 139 },
  { name: 'Wed', users: 200, courses: 980 },
  { name: 'Thu', users: 278, courses: 390 },
  { name: 'Fri', users: 189, courses: 480 },
  { name: 'Sat', users: 239, courses: 380 },
  { name: 'Sun', users: 349, courses: 430 },
];

const AdminDashboard: React.FC = () => {
  const { users, requests, resolveUpgradeRequest, addAnnouncement, deleteUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'requests' | 'members' | 'curriculum' | 'announcements'>('analytics');
  
  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Search/Filter states
  const [memberSearch, setMemberSearch] = useState('');

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const filteredMembers = users.filter(u => 
    u.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const stats = [
    { label: 'Total Members', value: users.length.toString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active Courses', value: MOCK_COURSES.length.toString(), icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Pending Upgrades', value: pendingRequests.length.toString(), icon: ArrowUpCircle, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Daily Activity', value: '+14%', icon: Activity, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  ];

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    addAnnouncement({ title: annTitle, content: annContent, priority: annPriority });
    setAnnTitle('');
    setAnnContent('');
    alert("Announcement broadcast successfully!");
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Command Center</h1>
          <p className="text-slate-400 mt-1">Manage members, curriculum, and organization operations.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto whitespace-nowrap custom-scrollbar">
          {[
            { id: 'analytics', label: 'Analytics' },
            { id: 'requests', label: 'Requests', count: pendingRequests.length },
            { id: 'members', label: 'Members' },
            { id: 'curriculum', label: 'Curriculum' },
            { id: 'announcements', label: 'Broadcast' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white text-indigo-600' : 'bg-indigo-500/20 text-indigo-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <s.icon size={64} />
            </div>
            <div className={`p-3 ${s.bg} ${s.color} w-fit rounded-xl mb-4`}>
              <s.icon size={24} />
            </div>
            <p className="text-slate-400 text-sm mb-1">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'analytics' && (
          <motion.div 
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl h-[400px]">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-400" />
                User Engagement Trends
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#6366f1" fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl h-[400px]">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <UserCheck size={20} className="text-emerald-400" />
                Course Completion Rates
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Bar dataKey="courses" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {activeTab === 'requests' && (
          <motion.div 
            key="requests"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold">Tier Promotion Requests</h3>
              <span className="text-sm text-slate-500">{pendingRequests.length} awaiting action</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-950/50">
                    <th className="px-6 py-4">Member</th>
                    <th className="px-6 py-4">Target Tier</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">No promotion history found.</td>
                    </tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.userName}`} alt="" className="w-8 h-8 rounded-full" />
                            <div>
                              <div className="font-bold text-sm">{req.userName}</div>
                              <div className="text-[10px] text-slate-500 uppercase font-bold">From {req.currentRole}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${req.requestedRole === 'LEADERSHIP' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' : 'border-indigo-500/20 text-indigo-500 bg-indigo-500/5'}`}>
                            {req.requestedRole}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold ${req.status === 'PENDING' ? 'text-amber-500' : req.status === 'APPROVED' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {req.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => resolveUpgradeRequest(req.id, 'APPROVED')} className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all border border-transparent hover:border-emerald-400/20"><Check size={18} /></button>
                              <button onClick={() => resolveUpgradeRequest(req.id, 'REJECTED')} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all border border-transparent hover:border-red-400/20"><X size={18} /></button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-600 font-bold uppercase">Decision Logged</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'members' && (
          <motion.div 
            key="members"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name or email..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/10">
                <Plus size={18} />
                Add New Member
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
               <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-950/50">
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredMembers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-800/20 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar} alt="" className="w-10 h-10 rounded-full bg-slate-800" />
                            <div>
                              <div className="font-bold text-sm">{u.name}</div>
                              <div className="text-xs text-slate-500 flex items-center gap-1"><Mail size={10} /> {u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full border ${u.role === 'LEADERSHIP' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' : u.role === 'FULL' ? 'border-indigo-500/20 text-indigo-500 bg-indigo-500/5' : 'border-slate-700 text-slate-400 bg-slate-800'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(u.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg"><Edit size={16} /></button>
                            <button onClick={() => deleteUser(u.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'curriculum' && (
          <motion.div 
            key="curriculum"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Course Management</h3>
              <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all">
                <Plus size={18} />
                Create Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_COURSES.map(course => (
                <div key={course.id} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl group relative hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/5 px-2 py-1 rounded border border-indigo-400/10">
                      {course.category}
                    </span>
                    <div className="flex gap-1">
                      <button className="p-1.5 text-slate-500 hover:text-white"><Edit size={14} /></button>
                      <button className="p-1.5 text-slate-500 hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <h4 className="font-bold mb-2">{course.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-6">{course.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1">
                      <ShieldAlert size={12} /> {course.minRole} Min
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">
                      {course.lessons.length} Lessons
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'announcements' && (
          <motion.div 
            key="announcements"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto"
          >
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-3 mb-8 text-indigo-400">
                <BellPlus size={24} />
                <h3 className="text-xl font-bold">Broadcast Notification</h3>
              </div>
              <form onSubmit={handleCreateAnnouncement} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 uppercase tracking-widest text-[10px] font-black">Title</label>
                  <input 
                    type="text" 
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Quarterly Review Dates"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 uppercase tracking-widest text-[10px] font-black">Priority</label>
                  <select 
                    value={annPriority}
                    onChange={(e) => setAnnPriority(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 appearance-none"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority (Urgent)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 uppercase tracking-widest text-[10px] font-black">Message Content</label>
                  <textarea 
                    required
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    placeholder="Type your message to all members..."
                    className="w-full h-40 p-4 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-sm resize-none transition-all"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Organization Broadcast
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
