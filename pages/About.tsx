
import React from 'react';
import { Target, Eye, Heart, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="space-y-24 py-12">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-6">Built on Foundation of <span className="text-indigo-500">Trust</span></h1>
        <p className="text-xl text-slate-400">
          MemberHub was established in 2021 to provide a centralized hub for community growth, leadership excellence, and high-impact learning.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-6">
            <Target size={28} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-slate-400 leading-relaxed">
            To provide every member with the tools, knowledge, and community support required to excel in their personal and professional endeavors, fostering a culture of continuous improvement.
          </p>
        </div>

        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center mb-6">
            <Eye size={28} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-slate-400 leading-relaxed">
            To become the leading organizational platform for community-driven leadership development, recognized globally for our commitment to quality, integrity, and innovation.
          </p>
        </div>
      </div>

      <section className="bg-slate-900/50 rounded-3xl p-12 border border-slate-800">
        <h2 className="text-3xl font-bold mb-12 text-center">Core Beliefs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Heart size={32} className="text-red-400 mx-auto mb-4" />
            <h3 className="font-bold mb-2 text-lg">Integrity First</h3>
            <p className="text-sm text-slate-500">We maintain the highest standards of honesty and transparency in all our interactions.</p>
          </div>
          <div className="text-center">
            <Users size={32} className="text-blue-400 mx-auto mb-4" />
            <h3 className="font-bold mb-2 text-lg">Community Focus</h3>
            <p className="text-sm text-slate-500">Our strength lies in the diversity and collaboration of our membership base.</p>
          </div>
          <div className="text-center">
            <Target size={32} className="text-emerald-400 mx-auto mb-4" />
            <h3 className="font-bold mb-2 text-lg">Excellence Always</h3>
            <p className="text-sm text-slate-500">We strive for perfection in our curriculum and organizational leadership.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
