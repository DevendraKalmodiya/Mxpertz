import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FileUpload({ onResults }) {
  const [jd, setJd] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jd || files.length === 0) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('jd', jd);
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      const response = await axios.post('http://localhost:8000/screen', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onResults(response.data.results);
    } catch (err) {
      console.error("Screening failed", err);
      alert("Failed to analyze resumes. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onSubmit={handleSubmit} 
      className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Job Description Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Job Description
          </label>
          <textarea 
            placeholder="Paste the core requirements and responsibilities here..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none h-48 text-slate-700"
            onChange={(e) => setJd(e.target.value)}
            required
          />
        </div>

        {/* File Upload Area */}
        <div className="flex flex-col">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Candidate Resumes (PDF)
          </label>
          <div className="relative flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group cursor-pointer h-48">
            <input 
              type="file" 
              multiple 
              accept=".pdf"
              onChange={(e) => setFiles(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="text-center pointer-events-none">
              <UploadCloud className="mx-auto h-12 w-12 text-slate-400 group-hover:text-blue-500 transition-colors mb-3" />
              <p className="text-sm font-medium text-slate-700">
                {files.length > 0 ? `${files.length} file(s) selected` : 'Click or drag PDFs here'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Maximum 10 MB per file</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button 
          type="submit" 
          disabled={loading || !jd || files.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analyzing with AI...
            </>
          ) : (
            <>
              <FileText size={20} />
              Run Smart Screen
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}