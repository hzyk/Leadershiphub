
import React from 'react';
import { 
  Users, 
  BookOpen, 
  ArrowUpCircle, 
  TrendingUp,
  Activity,
  UserCheck
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

const data = [
  { name: 'Mon', users: 400, courses: 240 },
  { name: 'Tue', users: 300, courses: 139 },
  { name: 'Wed', users: 200, courses: 980 },
  { name: 'Thu', users: 278, courses: 390 },
  { name: 'Fri', users: 189, courses: 480 },
  { name: 'Sat', users: 239, courses: 380 },
  { name: 'Sun', users: 349, courses: 430 },
];

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Members', value: '1,284', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active Courses', value: '24', icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Upgrade Requests', value: '12', icon: ArrowUpCircle, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Daily Activity', value: '+14%', icon: Activity, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Admin Center</h1>
        <p className="text-slate-400">Overview of organizational growth and performance.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className={`p-3 ${s.bg} ${s.color} w-fit rounded-xl mb-4`}>
              <s.icon size={24} />
            </div>
            <p className="text-slate-400 text-sm mb-1">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Chart */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl h-[400px]">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-400" />
            User Engagement
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
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

        {/* Course Completion Chart */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl h-[400px]">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <UserCheck size={20} className="text-emerald-400" />
            Course Progress
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
