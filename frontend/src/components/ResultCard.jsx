import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, FileBadge, BriefcaseBusiness } from 'lucide-react';

export default function ResultCard({ result, index }) {
  const { filename, score, experience, matched_skills = [], missing_skills = [], explanation } = result;

  const getScoreTheme = (score) => {
    if (score >= 80) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    if (score >= 50) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
  };

  const theme = getScoreTheme(score);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <div className="p-6 md:p-8">
        
        {/* Header & Score Component */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className={`p-3 rounded-xl ${theme.bg} ${theme.text}`}>
              <FileBadge size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 truncate max-w-md" title={filename}>
                {filename}
              </h3>
              <p className="text-sm font-medium text-slate-500">AI Compatibility Analysis</p>
            </div>
          </div>
          
          <div className={`flex flex-col items-center justify-center min-w-[100px] px-6 py-3 rounded-xl border-2 ${theme.border} ${theme.bg}`}>
            <span className={`text-3xl font-black tracking-tight ${theme.text}`}>{score}%</span>
            <span className={`text-[11px] uppercase font-bold tracking-wider mt-1 ${theme.text}`}>Match</span>
          </div>
        </div>

        {/* --- SECTION 1: AI Explanation --- */}
        <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-100 relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl"></div>
          <p className="text-slate-700 text-sm leading-relaxed font-medium">
            {explanation || "No explanation provided by the AI model."}
          </p>
        </div>

        {/* --- SECTION 2: Experience Summary --- */}
        <div className="mb-6 pb-6 border-b border-slate-100">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
            <BriefcaseBusiness className="text-blue-500" size={18} />
            Experience Extracted
          </h4>
          <p className="text-sm text-slate-600 bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
            {experience || "No specific experience metrics were extracted from this resume."}
          </p>
        </div>

        {/* --- SECTION 3: Skills Breakdown --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Matched Skills */}
          <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/50">
            <h5 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
              <CheckCircle2 className="text-emerald-500" size={18} />
              Requirements Met
            </h5>
            {matched_skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {matched_skills.map((skill, i) => (
                  <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 capitalize shadow-sm border border-emerald-200">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No exact skill matches identified.</p>
            )}
          </div>

          {/* Missing Skills */}
          <div className="bg-rose-50/30 p-4 rounded-xl border border-rose-100/50">
            <h5 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
              <XCircle className="text-rose-500" size={18} />
              Gaps Identified
            </h5>
            {missing_skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {missing_skills.map((skill, i) => (
                  <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-100 text-rose-800 capitalize shadow-sm border border-rose-200">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Candidate meets all core requirements.</p>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}
