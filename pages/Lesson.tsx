
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_COURSES } from '../constants';
import { ChevronLeft, Play, Send, Sparkles, Loader2 } from 'lucide-react';
import { getLessonAssistance } from '../services/geminiService';

const Lesson: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const course = MOCK_COURSES.find(c => c.id === courseId);
  const lesson = course?.lessons.find(l => l.id === lessonId);

  if (!course || !lesson) return <div className="text-center py-20">Lesson not found.</div>;

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsAsking(true);
    const response = await getLessonAssistance(lesson.title, lesson.content, question);
    setAiResponse(response);
    setIsAsking(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Content Area */}
      <div className="lg:col-span-3 space-y-6">
        <button 
          onClick={() => navigate(`/courses/${courseId}`)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
        >
          <ChevronLeft size={18} />
          Back to Course
        </button>

        <div className="aspect-video bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center gap-4 text-slate-500">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
              <Play size={24} className="ml-1" />
            </div>
            <p className="text-sm font-medium">Video lesson would play here</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
          <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
            <p>{lesson.content}</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              In this lesson, we explore the fundamental dynamics of organizational behavior. Understanding how individuals 
              interact within a structure is crucial for any aspiring leader.
            </p>
          </div>
        </div>
      </div>

      {/* AI Assistance Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[calc(100vh-160px)] sticky top-24 flex flex-col shadow-2xl">
          <div className="flex items-center gap-2 mb-6 text-indigo-400">
            <Sparkles size={20} />
            <h2 className="font-bold">AI Tutor</h2>
          </div>

          <div className="flex-grow overflow-y-auto space-y-4 mb-4 text-sm scroll-smooth pr-2">
            {!aiResponse && !isAsking && (
              <p className="text-slate-500 italic">Have a question about this lesson? Ask me anything!</p>
            )}
            
            {isAsking && (
              <div className="flex items-center gap-2 text-indigo-400">
                <Loader2 className="animate-spin" size={16} />
                <span>Thinking...</span>
              </div>
            )}

            {aiResponse && (
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-slate-200">
                {aiResponse}
              </div>
            )}
          </div>

          <form onSubmit={handleAskAI} className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question..."
              className="w-full h-24 p-4 pr-12 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-xs resize-none"
            />
            <button 
              type="submit"
              disabled={isAsking}
              className="absolute bottom-4 right-4 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
