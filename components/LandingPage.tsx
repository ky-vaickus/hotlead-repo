import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AgentType } from '../types';

interface LandingPageProps {
  onSelectAgent: (type: AgentType) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectAgent }) => {
  return (
    <div className="min-h-screen bg-brand-offwhite flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-purple/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-teal/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-4xl w-full text-center space-y-6 mb-16 relative z-10">
        <h1 className="text-6xl md:text-8xl font-serif text-brand-black mb-6 tracking-tight text-balance">
          What's your mission?
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 font-light font-serif italic">
          Choose your path to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4 relative z-10">
        {/* Sales Agent Card */}
        <div 
          onClick={() => onSelectAgent(AgentType.SALES)}
          className="group relative bg-white rounded-[2rem] p-10 md:p-14 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-1"
        >
          {/* Hover Border Gradient */}
          <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-brand-purple/20 transition-all duration-500 pointer-events-none" />

          <div className="space-y-8 relative z-10">
            <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-brand-purple to-[#7a4aff] text-white text-sm font-medium shadow-lg shadow-brand-purple/20">
              Sales
            </span>
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-black mb-4">Sales Agent</h2>
              <p className="text-gray-500 text-lg leading-relaxed font-light">
                Discover companies and decision makers ready to buy
              </p>
            </div>
            
            <div className="pt-8">
              <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-brand-purple text-white font-medium shadow-xl shadow-brand-purple/20 group-hover:scale-105 transition-transform duration-300">
                Get started <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Recruiting Agent Card */}
        <div 
          onClick={() => onSelectAgent(AgentType.RECRUITING)}
          className="group relative bg-white rounded-[2rem] p-10 md:p-14 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-1"
        >
          <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-brand-teal/30 transition-all duration-500 pointer-events-none" />

          <div className="space-y-8 relative z-10">
            <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-brand-teal to-[#4bd1b6] text-white text-sm font-medium shadow-lg shadow-brand-teal/20">
              Recruiting
            </span>
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-black mb-4">Recruiting Agent</h2>
              <p className="text-gray-500 text-lg leading-relaxed font-light">
                Source qualified candidates from top companies
              </p>
            </div>
            
            <div className="pt-8">
              <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-teal to-[#3dbca1] text-white font-medium shadow-xl shadow-brand-teal/20 group-hover:scale-105 transition-transform duration-300">
                Get started <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;