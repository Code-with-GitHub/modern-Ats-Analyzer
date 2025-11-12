import React, { useState, useCallback, useRef } from 'react';
import { AnalysisResult, AppStatus } from '../types';
import { analyzeResume } from '../services/geminiService';
import AnalysisReport from './AnalysisReport';

interface ResumeAnalyzerPageProps {
  user: { name: string };
  onLogout: () => void;
}

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
            <h2 className="text-2xl font-semibold text-gray-700">Analyzing Your Resume...</h2>
        </div>
    );
};


const ResumeAnalyzerPage: React.FC<ResumeAnalyzerPageProps> = ({ user, onLogout }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const processFile = useCallback((file: File | undefined) => {
    if (file) {
      setError(null);
      setResumeText('');

      if (file.type !== 'text/plain') {
        setError('File type not supported. Please upload a .txt file, or copy and paste your resume content directly.');
        setFileName(null);
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text);
      };

      reader.onerror = () => {
        setError('Failed to read the file.');
        setFileName(null);
      };

      reader.readAsText(file);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
    if(e.target) e.target.value = ''; // Allow re-uploading the same file
  }, [processFile]);

  const handleAnalysis = useCallback(async () => {
    if (!resumeText.trim()) {
      setError('Please add your resume content before analyzing.');
      return;
    }

    setError(null);
    setStatus(AppStatus.ANALYZING);
    try {
      const result = await analyzeResume(resumeText, jobDescription);
      setAnalysisResult(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setStatus(AppStatus.ERROR);
    }
  }, [resumeText, jobDescription]);

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setAnalysisResult(null);
    setError(null);
    setResumeText('');
    setJobDescription('');
    setFileName(null);
  };

  const renderContent = () => {
    switch (status) {
      case AppStatus.ANALYZING:
        return <div className="flex justify-center items-center py-20"><LoadingSpinner /></div>;
      case AppStatus.SUCCESS:
        return analysisResult && <AnalysisReport result={analysisResult} onReset={handleReset} />;
      case AppStatus.IDLE:
      case AppStatus.ERROR:
      default:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
                AI ATS Resume Analyzer
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Paste your resume and a job description to get instant feedback.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow">
                <label className="block text-lg font-semibold text-gray-800 mb-2">
                  Your Resume
                </label>
                 <p className="text-sm text-gray-500 mb-4">
                      You can upload a <strong>.txt</strong> file or simply paste your resume content below. For PDF or Word documents, please copy and paste the text.
                </p>
                <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-2"
                      accept=".txt"
                />
                {fileName && (
                    <div className="mt-2 text-sm text-gray-600">
                        File: {fileName}
                    </div>
                )}
                <textarea
                    rows={15}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste your resume here..."
                    value={resumeText}
                    onChange={(e) => {
                        setResumeText(e.target.value);
                        setFileName(null);
                    }}
                />
              </div>

              <div className="bg-white p-8 rounded-lg shadow">
                    <label htmlFor="job-description" className="block text-lg font-semibold text-gray-800 mb-3">
                      Job Description (Optional)
                    </label>
                    <textarea
                      id="job-description"
                      rows={8}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Paste the job description for a targeted analysis..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                </div>

              {error && <p className="text-center text-red-500">{error}</p>}
              
              <div className="text-center pt-4">
                <button
                  onClick={handleAnalysis}
                  disabled={!resumeText.trim()}
                  className="px-10 py-4 text-lg font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze Resume
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="max-w-7xl mx-auto pb-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-gray-800">
                ATS Analyzer
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                Logout
                </button>
            </div>
        </div>
      </header>
      <main className="mt-12">
        {renderContent()}
      </main>
    </div>
  );
};

export default ResumeAnalyzerPage;
