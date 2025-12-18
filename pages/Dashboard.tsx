
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Bell, Award, BookOpen, Clock, ChevronRight, CheckCircle } from 'lucide-react';
import { MOCK_COURSES } from '../constants';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, announcements, completedLessons } = useAuth();
  
  const availableCourses = MOCK_COURSES.filter(c => {
    if (user?.role === 'LEADERSHIP') return true;
    if (user?.role === 'FULL') return c.minRole !== 'LEADERSHIP';
    return c.minRole === 'BASIC';
  });

  const totalLessons = availableCourses.reduce((acc, c) => acc + c.lessons.length, 0);
  const progressPercent = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-slate-400">Here's what's happening in your organization today.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-slate-800 rounded-full flex items-center gap-2 border border-slate-700">
            <Award className="text-amber-400" size={18} />
            <span className="text-sm font-bold uppercase tracking-wide">{user?.role} MEMBER</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Progress */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <BookOpen size={80} />
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Course Progress</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{Math.round(progressPercent)}%</p>
                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      className="h-full bg-blue-500" 
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Clock size={80} />
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Lessons Completed</p>
                <p className="text-2xl font-bold">{completedLessons.length} / {totalLessons}</p>
              </div>
            </div>
          </div>

          {/* Featured Courses */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Curriculum Overview</h2>
              <Link to="/courses" className="text-indigo-400 text-sm hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {availableCourses.slice(0, 3).map(course => {
                const courseCompletedCount = course.lessons.filter(l => completedLessons.includes(l.id)).length;
                const percent = (courseCompletedCount / course.lessons.length) * 100;
                
                return (
                  <Link 
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="group p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-indigo-500/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <img src={course.thumbnail} alt={course.title} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <h3 className="font-bold group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                           <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500" style={{ width: `${percent}%` }} />
                           </div>
                           <span className="text-[10px] text-slate-500">{courseCompletedCount}/{course.lessons.length}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-600 group-hover:text-indigo-400" />
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Announcements */}
        <div className="space-y-8">
          <section className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
            <div className="flex items-center gap-2 mb-4 text-indigo-400">
              <Bell size={20} />
              <h2 className="font-bold">Announcements</h2>
            </div>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {announcements.length > 0 ? announcements.map(ann => (
                <div key={ann.id} className="space-y-1 group">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{ann.title}</h3>
                    <span className="text-[10px] uppercase text-slate-500">{ann.date}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{ann.content}</p>
                </div>
              )) : (
                <p className="text-xs text-slate-500 italic">No recent announcements.</p>
              )}
            </div>
          </section>

          {/* Profile Quick Card */}
          <section className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center">
            <img 
              src={user?.avatar} 
              alt="Avatar" 
              className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-slate-800"
            />
            <h2 className="font-bold text-lg">{user?.name}</h2>
            <p className="text-sm text-slate-500 mb-6">{user?.email}</p>
            <Link 
              to="/profile" 
              className="block w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg transition-all"
            >
              Edit Profile
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
