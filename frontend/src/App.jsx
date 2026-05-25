import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ResultCard from './components/ResultCard';

function App() {
  const [results, setResults] = useState([]);
  
  // 1. Create a reference for our scroll target
  const resultsEndRef = useRef(null);

  // 2. Watch for changes in 'results' and scroll when data arrives
  useEffect(() => {
    if (results.length > 0 && resultsEndRef.current) {
      // Small timeout ensures the DOM has finished painting the new elements
      setTimeout(() => {
        resultsEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [results]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <header className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg mb-4 text-white"
          >
            <Briefcase size={32} />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-3">
            Mxpertz AI Resume Screener
          </h1>
          <p className=" text-slate-600 text-center">
  AI-powered semantic matching. Upload a Job Description and candidate resumes to instantly find the best fit.
</p>
        </header>

        {/* Upload Component */}
        <FileUpload onResults={setResults} />
        
        {/* 3. Invisible Anchor Point for the Auto-Scroll */}
        <div ref={resultsEndRef} className="scroll-mt-12"></div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Screening Results
              </h2>
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-semibold border border-blue-200">
                {results.length} Candidates Analyzed
              </span>
            </div>
            
            <div className="space-y-6">
              <AnimatePresence>
                {results.map((res, idx) => (
                  <ResultCard key={idx} result={res} index={idx} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;