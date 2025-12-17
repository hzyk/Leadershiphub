
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Star, Crown, CheckCircle2 } from 'lucide-react';

const Home: React.FC = () => {
  const tiers = [
    {
      title: 'Basic Member',
      icon: Shield,
      color: 'text-blue-400',
      price: 'Free',
      features: ['Core Lessons', 'Member Dashboard', 'Basic Profile', 'Community Access'],
      cta: 'Start Free',
      role: 'BASIC'
    },
    {
      title: 'Full Member',
      icon: Star,
      color: 'text-indigo-400',
      price: 'Professional',
      features: ['All Courses', 'Advanced Strategies', 'Resource Library', 'Mentorship Sessions'],
      cta: 'Upgrade to Full',
      role: 'FULL'
    },
    {
      title: 'Leadership',
      icon: Crown,
      color: 'text-amber-400',
      price: 'Executive',
      features: ['Admin Privileges', 'Strategic Decision Tools', 'Lead New Members', 'Exclusive Insights'],
      cta: 'Apply for Leadership',
      role: 'LEADERSHIP'
    }
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="text-center py-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6"
        >
          Elevate Your <span className="text-indigo-500">Leadership</span> Journey
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-400 max-w-2xl mx-auto mb-10"
        >
          Join a community of forward-thinking individuals dedicated to excellence, growth, and organizational mastery.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-500/20">
            Join the Organization
          </Link>
          <Link to="/about" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all">
            Learn More
          </Link>
        </motion.div>
      </section>

      {/* Tiers Section */}
      <section id="tiers" className="py-12">
        <h2 className="text-3xl font-bold text-center mb-16">Membership Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl flex flex-col hover:border-indigo-500/50 transition-all group"
            >
              <div className={`${tier.color} mb-6 group-hover:scale-110 transition-transform`}>
                <tier.icon size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-2">{tier.title}</h3>
              <p className="text-slate-400 text-sm mb-6">{tier.price}</p>
              <div className="space-y-4 mb-10 flex-grow">
                {tier.features.map(feature => (
                  <div key={feature} className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    {feature}
                  </div>
                ))}
              </div>
              <Link 
                to="/register" 
                className={`w-full py-3 rounded-xl text-center font-bold transition-all ${
                  idx === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Courses Teaser */}
      <section className="bg-slate-900/30 rounded-3xl p-12 border border-slate-800/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-4">Quality Learning for Every Stage</h2>
            <p className="text-slate-400">
              Our curriculum is designed to scale with your ambitions. From foundational principles to high-level strategic planning, we provide the resources you need to lead effectively.
            </p>
          </div>
          <img 
            src="https://picsum.photos/seed/learning/600/400" 
            alt="Learning" 
            className="rounded-2xl shadow-2xl w-full md:w-1/2 object-cover"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
