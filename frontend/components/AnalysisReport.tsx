import React from 'react';
import { AnalysisResult, PerformanceMetric, AtsChecklistItem } from '../types';
import { ThumbsUpIcon, ZapIcon, BarChartIcon, CheckBadgeIcon, TagsIcon, CheckIcon, XIcon } from './icons';

interface AnalysisReportProps {
  result: AnalysisResult;
  onReset: () => void;
}

const getScoreColor = (score: number): string => {
  if (score >= 8) return 'text-green-600';
  if (score >= 5) return 'text-yellow-600';
  return 'text-red-600';
};

const ReportCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">{icon}</div>
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            </div>
            <div className="space-y-4 text-gray-600">{children}</div>
        </div>
    );
};


const AnalysisReport: React.FC<AnalysisReportProps> = ({ result, onReset }) => {

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
        <div className="text-center p-8 bg-white shadow-lg rounded-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Analysis is Complete!</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{result.executiveSummary}</p>
            <div className="my-6">
                 <p className="text-2xl font-bold text-gray-700">Overall Score: <span className={`text-6xl font-bold ${getScoreColor(result.overallScore)}`}>{result.overallScore}</span><span className="text-2xl">/10</span></p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <ReportCard title="Top Strengths" icon={<ThumbsUpIcon />}>
              <ul className="space-y-3">
                {result.topStrengths.map((item, i) => <li key={i} className="flex items-start gap-3"><div className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-500"><CheckIcon /></div> <span>{item}</span></li>)}
              </ul>
            </ReportCard>
            <ReportCard title="Areas for Improvement" icon={<ZapIcon />}>
              <ul className="space-y-3">
                {result.mainImprovements.map((item, i) => <li key={i} className="flex items-start gap-3 "><div className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500"><XIcon /></div> <span>{item}</span></li>)}
              </ul>
            </ReportCard>
        </div>

        <ReportCard title="Performance Metrics" icon={<BarChartIcon />}>
            <>
                {result.performanceMetrics.map((metric: PerformanceMetric, i: number) => (
                <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                    <span className="font-semibold text-gray-800">{metric.metricName}</span>
                    <span className={`font-bold text-lg ${getScoreColor(metric.score)}`}>{metric.score}<span className="text-sm text-gray-500">/10</span></span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${getScoreColor(metric.score).replace('text-', 'bg-')}`} style={{ width: `${metric.score * 10}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1.5">{metric.explanation}</p>
                </div>
                ))}
            </>
        </ReportCard>

        <ReportCard title="ATS Compatibility Checklist" icon={<CheckBadgeIcon />}>
        <ul className="space-y-2">
            {result.atsCompatibilityChecklist.map((item: AtsChecklistItem, i: number) => (
            <li key={i} className={`flex items-start gap-3 p-3 rounded-lg ${item.isCompatible ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className={`flex-shrink-0 w-6 h-6 ${item.isCompatible ? 'text-green-500' : 'text-red-500'}`}>{item.isCompatible ? <CheckIcon /> : <XIcon />}</div>
                <div>
                <span className="font-semibold text-gray-800">{item.checklistItem}</span>
                <p className="text-sm text-gray-600">{item.reasoning}</p>
                </div>
            </li>
            ))}
        </ul>
        </ReportCard>
        
        <ReportCard title="Recommended Keywords" icon={<TagsIcon />}>
        <div className="flex flex-wrap gap-3">
            {result.recommendedKeywords.map((keyword, i) => <span key={i} className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">{keyword}</span>)}
        </div>
        </ReportCard>
        
        <div className="text-center pt-4">
            <button
                onClick={onReset}
                className="px-8 py-3 text-md font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                Analyze Another Document
                </button>
        </div>
    </div>
  );
};

export default AnalysisReport;
