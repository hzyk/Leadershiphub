
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { motion } from 'framer-motion';
import { Check, Star, Crown, ChevronRight, Loader2 } from 'lucide-react';

const Upgrade: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRequest = async (role: UserRole) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const roles = [
    {
      role: UserRole.FULL,
      name: 'Full Member',
      icon: Star,
      benefits: ['All Courses Unlocked', 'Advanced Resources', 'Priority Support'],
      color: 'bg-indigo-600'
    },
    {
      role: UserRole.LEADERSHIP,
      name: 'Leadership Team',
      icon: Crown,
      benefits: ['Admin Controls', 'Organization Management', 'Strategic Decision Making'],
      color: 'bg-amber-600'
    }
  ];

  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={40} />
        </div>
        <h1 className="text-3xl font-bold">Request Submitted!</h1>
        <p className="text-slate-400">Your upgrade request has been sent to the Leadership Team for review. You will be notified via dashboard once it is processed.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="px-8 py-3 bg-slate-800 rounded-xl font-bold hover:bg-slate-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">Membership Promotion</h1>
        <p className="text-slate-400 max-w-xl mx-auto">Ready to take the next step in your journey? Request an upgrade to unlock more tools and opportunities.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {roles.map((r, idx) => {
          const isCurrent = user?.role === r.role;
          const alreadyHigher = user?.role === UserRole.LEADERSHIP && r.role === UserRole.FULL;
          
          return (
            <motion.div 
              key={r.role}
              whileHover={{ y: -5 }}
              className={`p-8 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col ${isCurrent ? 'opacity-50 grayscale' : ''}`}
            >
              <div className={`p-4 ${r.color} w-fit rounded-2xl mb-6 shadow-xl`}>
                <r.icon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{r.name}</h3>
              <ul className="space-y-4 mb-10 flex-grow">
                {r.benefits.map(benefit => (
                  <li key={benefit} className="flex items-center gap-3 text-slate-400 text-sm">
                    <Check size={16} className="text-indigo-400" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <button
                disabled={isCurrent || alreadyHigher || isSubmitting}
                onClick={() => handleRequest(r.role)}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  isCurrent ? 'bg-slate-800 text-slate-600' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : isCurrent ? (
                  'Current Role'
                ) : (
                  <>
                    Request Upgrade
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Upgrade;
