
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_COURSES } from '../constants';
import { BookOpen, Lock, Search, Filter, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserRole } from '../types';
import { motion } from 'framer-motion';

const Courses: React.FC = () => {
  const { user, completedLessons } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const canAccess = (minRole: UserRole) => {
    if (!user) return false;
    const roles = [UserRole.BASIC, UserRole.FULL, UserRole.LEADERSHIP];
    return roles.indexOf(user.role) >= roles.indexOf(minRole);
  };

  const filteredCourses = MOCK_COURSES.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Organization Curriculum</h1>
        <p className="text-slate-400">Expand your knowledge with our structured learning paths.</p>
      </header>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl text-sm font-medium hover:bg-slate-700">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map(course => {
          const locked = !canAccess(course.minRole);
          const courseCompletedCount = course.lessons.filter(l => completedLessons.includes(l.id)).length;
          const isFullComplete = courseCompletedCount === course.lessons.length;
          const progressPercent = (courseCompletedCount / course.lessons.length) * 100;

          return (
            <motion.div 
              key={course.id} 
              layout
              className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group shadow-lg"
            >
              <div className="relative overflow-hidden aspect-video">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                {locked && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[4px] flex flex-col items-center justify-center p-6 text-center">
                    <Lock className="text-indigo-400 mb-3" size={32} />
                    <p className="text-white font-bold text-sm tracking-wide">Requires {course.minRole} Tier</p>
                    <Link to="/upgrade" className="mt-4 text-[10px] uppercase bg-white text-slate-950 px-4 py-1.5 rounded-full font-black hover:bg-indigo-400 transition-colors">
                      Upgrade to Unlock
                    </Link>
                  </div>
                )}
                {!locked && isFullComplete && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg z-10">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded border border-indigo-400/20">
                    {course.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {course.lessons.length} Lessons
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">{course.description}</p>
                
                {!locked && (
                  <div className="mb-6">
                     <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                       <span>Progress</span>
                       <span>{Math.round(progressPercent)}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        className="h-full bg-indigo-500" 
                       />
                     </div>
                  </div>
                )}

                {locked ? (
                  <button disabled className="w-full py-2.5 bg-slate-800 text-slate-500 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                    <Lock size={16} />
                    Locked Access
                  </button>
                ) : (
                  <Link 
                    to={`/courses/${course.id}`} 
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/10"
                  >
                    <BookOpen size={16} />
                    {progressPercent > 0 ? 'Continue Learning' : 'Start Course'}
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;
