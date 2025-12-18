
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { motion } from 'framer-motion';
import { Check, Star, Crown, ChevronRight, Loader2 } from 'lucide-react';

const Upgrade: React.FC = () => {
  const { user, submitUpgradeRequest, requests } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Check if there's already a pending request
  const hasPending = requests.some(r => r.userId === user?.id && r.status === 'PENDING');

  const handleRequest = async (role: UserRole) => {
    setIsSubmitting(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1200));
    submitUpgradeRequest(role);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const roles = [
    {
      role: UserRole.FULL,
      name: 'Full Member',
      icon: Star,
      benefits: ['All Courses Unlocked', 'Advanced Resources', 'Priority Support', 'Access to Strategy Library'],
      color: 'bg-indigo-600'
    },
    {
      role: UserRole.LEADERSHIP,
      name: 'Leadership Team',
      icon: Crown,
      benefits: ['Admin Controls', 'Organization Management', 'Strategic Decision Making', 'Approve Member Promotions'],
      color: 'bg-amber-600'
    }
  ];

  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Check size={40} />
        </motion.div>
        <h1 className="text-3xl font-bold">Request Submitted!</h1>
        <p className="text-slate-400">Your upgrade request has been logged. Our leadership team will review your activity and profile shortly.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="px-8 py-3 bg-slate-800 rounded-xl font-bold hover:bg-slate-700 transition-colors"
        >
          Back to Promotions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">Membership Promotion</h1>
        <p className="text-slate-400 max-w-xl mx-auto">Elevate your access and responsibilities within the MemberHub community.</p>
        
        {hasPending && (
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl inline-block">
            <p className="text-amber-400 text-sm font-medium">You currently have a pending request awaiting review.</p>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {roles.map((r) => {
          const isCurrent = user?.role === r.role;
          const alreadyHigher = user?.role === UserRole.LEADERSHIP && r.role === UserRole.FULL;
          const currentIsFull = user?.role === UserRole.FULL;
          
          return (
            <motion.div 
              key={r.role}
              whileHover={{ y: -5 }}
              className={`p-8 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col transition-all ${isCurrent || alreadyHigher ? 'opacity-60' : 'hover:border-indigo-500/30'}`}
            >
              <div className={`p-4 ${r.color} w-fit rounded-2xl mb-6 shadow-xl`}>
                <r.icon size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{r.name}</h3>
              <ul className="space-y-4 mb-10 flex-grow">
                {r.benefits.map(benefit => (
                  <li key={benefit} className="flex items-center gap-3 text-slate-400 text-sm">
                    <Check size={16} className="text-indigo-400 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <button
                disabled={isCurrent || alreadyHigher || isSubmitting || hasPending}
                onClick={() => handleRequest(r.role)}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  isCurrent ? 'bg-slate-800 text-slate-500' : 
                  hasPending ? 'bg-slate-800 text-amber-500/50 cursor-not-allowed' :
                  'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/10'
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : isCurrent ? (
                  'Already Achieved'
                ) : hasPending ? (
                  'Request Pending'
                ) : (
                  <>
                    Request Promotion
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
