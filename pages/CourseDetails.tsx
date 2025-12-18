
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_COURSES } from '../constants';
import { useAuth } from '../context/AuthContext';
import { 
  ChevronLeft, 
  Play, 
  Lock, 
  CheckCircle, 
  Clock, 
  BookOpen,
  Award,
  Circle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UserRole } from '../types';

const CourseDetails: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, completedLessons } = useAuth();

  const course = MOCK_COURSES.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Course not found.</h2>
        <button onClick={() => navigate('/courses')} className="text-indigo-400 hover:underline">Back to Curriculum</button>
      </div>
    );
  }

  const canAccess = (minRole: UserRole) => {
    if (!user) return false;
    const rolesOrder = [UserRole.BASIC, UserRole.FULL, UserRole.LEADERSHIP];
    return rolesOrder.indexOf(user.role) >= rolesOrder.indexOf(minRole);
  };

  const locked = !canAccess(course.minRole);
  const courseCompletedCount = course.lessons.filter(l => completedLessons.includes(l.id)).length;
  const progressPercent = (courseCompletedCount / course.lessons.length) * 100;

  return (
    <div className="space-y-12">
      <button 
        onClick={() => navigate('/courses')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft size={18} />
        Back to Curriculum
      </button>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-20 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative z-10 p-8 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-400/20">
                {course.category}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Clock size={14} /> {course.lessons.length * 15} mins total
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black leading-tight">{course.title}</h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              {course.description}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              {locked ? (
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 max-w-xs">
                  <div className="flex items-center gap-2 text-amber-500 mb-2">
                    <Lock size={18} />
                    <span className="font-bold">Locked Access</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Requires {course.minRole} tier. You are currently a {user?.role} member.</p>
                  <Link to="/upgrade" className="text-xs font-black uppercase bg-white text-slate-950 px-4 py-2 rounded-lg hover:bg-indigo-400 transition-colors inline-block">
                    Request Promotion
                  </Link>
                </div>
              ) : (
                <Link 
                  to={`/courses/${course.id}/lessons/${course.lessons[0].id}`}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center gap-2 shadow-xl shadow-indigo-500/20 transition-all"
                >
                  <Play size={20} fill="currentColor" />
                  {courseCompletedCount > 0 ? 'Resume Course' : 'Start Learning'}
                </Link>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-slate-950/50 backdrop-blur-md p-8 rounded-3xl border border-white/5 space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-400 uppercase tracking-widest text-xs">Overall Progress</span>
                  <span className="text-indigo-400">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-indigo-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">Lessons</div>
                  <div className="text-2xl font-black">{course.lessons.length}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">Completed</div>
                  <div className="text-2xl font-black text-emerald-400">{courseCompletedCount}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <Award size={18} className="text-amber-400" />
                <p>Earn the <strong>{course.title} Badge</strong> upon completion.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="text-indigo-400" size={24} />
          Course Curriculum
        </h2>

        <div className="space-y-4">
          {course.lessons.map((lesson, idx) => {
            const isLessonCompleted = completedLessons.includes(lesson.id);
            
            return (
              <div 
                key={lesson.id}
                className={`group p-6 rounded-2xl border transition-all flex items-center justify-between ${
                  locked 
                    ? 'bg-slate-900/50 border-slate-800/50 opacity-50 cursor-not-allowed' 
                    : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                    isLessonCompleted 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isLessonCompleted ? <CheckCircle size={20} /> : idx + 1}
                  </div>
                  <div>
                    <h3 className={`font-bold ${locked ? 'text-slate-500' : 'text-white'}`}>
                      {lesson.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={12} /> {lesson.duration}</span>
                    </div>
                  </div>
                </div>

                {!locked ? (
                  <Link 
                    to={`/courses/${course.id}/lessons/${lesson.id}`}
                    className="p-3 bg-slate-800 hover:bg-indigo-600 text-white rounded-xl transition-all"
                  >
                    <Play size={16} fill="currentColor" />
                  </Link>
                ) : (
                  <Lock size={16} className="text-slate-700" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
