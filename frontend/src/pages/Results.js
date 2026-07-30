import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import ScoreCard from '../components/ScoreCard';
import SkillBadge from '../components/SkillBadge';
import RewriteCard from '../components/RewriteCard';
import RoadmapItem from '../components/RoadmapItem';
import CoverLetterCard from '../components/CoverLetterCard';

const Results = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResult = sessionStorage.getItem('analysisResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!result) {
    return null;
  }
  console.log("RESULT FROM SESSION STORAGE:");
console.log(result);

const coreMatch = result?.core_match || {
  overall_score: 0,
  section_scores: {},
  matched_skills: [],
  missing_skills: [],
  improvement_tips: [],
  keyword_gaps: [],
  summary: 'No analysis available'
};
const ats = result?.ats || {
  ats_score: 0,
  parsing_issues: [],
  detected_sections: [],
  missing_sections: [],
  keyword_density: {},
  formatting_warnings: [],
  ats_verdict: 'No ATS analysis available'
};
const gaps = result?.gaps || {
  readiness_percentage: 0,
  gap_summary: 'No gap analysis available',
  skill_gaps: [],
  milestones: []
};
const rewrites = result?.rewrites || {
  rewrites: []
};
const coverLetter = result?.cover_letter || {
  subject_line: '',
  cover_letter: '',
  highlights_used: [],
  tone: ''
};

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'ats', label: 'ATS Check' },
    { id: 'rewrites', label: 'Rewrite Suggestions' },
    { id: 'roadmap', label: 'Gap Roadmap' },
    { id: 'coverletter', label: 'Cover Letter' },
  ];

  const handleCopyAllRewrites = () => {
    const allRewrites = rewrites.rewrites
      .map(r => r.improved)
      .join('\n');
    navigator.clipboard.writeText(allRewrites);
    toast.success('All improved bullets copied!');
  };

  const renderOverview = () => (
    <div className="space-y-6 fade-in">
      {/* Overall Score */}
      <div className="bg-navy-800 rounded-xl p-8 border border-navy-700 text-center">
        <h2 className="text-2xl font-heading font-bold mb-4">Overall Match Score</h2>
        <div className="w-48 h-48 mx-auto relative">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="#1E293B"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="#6366F1"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - ((coreMatch?.overall_score || 0) / 100))}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold">{Math.round(coreMatch?.overall_score || 0)}%</span>
          </div>
        </div>
      </div>

      {/* Section Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard title="Skills" score={coreMatch?.section_scores?.skills || 0} color="indigo" />
        <ScoreCard title="Experience" score={coreMatch?.section_scores?.experience || 0} color="green" />
        <ScoreCard title="Education" score={coreMatch?.section_scores?.education || 0} color="yellow" />
        <ScoreCard title="Keywords" score={coreMatch?.section_scores?.keywords || 0} color="red" />
      </div>

      {/* Summary */}
      <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
        <h3 className="text-xl font-semibold mb-4">Summary</h3>
        <p className="text-gray-300">{coreMatch?.summary || "No analysis available"}</p>
      </div>

      {/* Matched and Missing Skills */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
          <h3 className="text-xl font-semibold mb-4 text-green-400">Matched Skills</h3>
          <div className="flex flex-wrap gap-2">
            {coreMatch?.matched_skills?.map((skill, index) => (
              <SkillBadge key={index} skill={skill} type="matched" />
            ))}
          </div>
        </div>
        <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
          <h3 className="text-xl font-semibold mb-4 text-red-400">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {coreMatch?.missing_skills?.map((skill, index) => (
              <SkillBadge key={index} skill={skill} type="missing" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderATS = () => (
    <div className="space-y-6 fade-in">
      {/* ATS Score */}
      <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-heading font-bold">ATS Score</h2>
          <span className={`px-4 py-2 rounded-full font-semibold ${
            ats.ats_verdict === 'Likely to Pass' ? 'bg-green-500/20 text-green-400' :
            ats.ats_verdict === 'Borderline' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {ats.ats_verdict}
          </span>
        </div>
        <div className="w-full h-4 bg-navy-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${ats.ats_score}%` }}
          />
        </div>
        <p className="text-gray-400 mt-2">{Math.round(ats.ats_score)}% ATS Compatibility</p>
      </div>

      {/* Detected Sections */}
      <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
        <h3 className="text-xl font-semibold mb-4">Detected Sections</h3>
        <ul className="space-y-2">
          {ats.detected_sections?.map((section, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              {section}
            </li>
          ))}
        </ul>
      </div>

      {/* Missing Sections */}
      {ats.missing_sections?.length > 0 && (
        <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
          <h3 className="text-xl font-semibold mb-4 text-yellow-400">Missing Sections</h3>
          <ul className="space-y-2">
            {ats.missing_sections.map((section, index) => (
              <li key={index} className="flex items-center text-gray-300">
                <span className="text-yellow-500 mr-3">⚠</span>
                {section}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Formatting Warnings */}
      {ats.formatting_warnings?.length > 0 && (
        <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
          <h3 className="text-xl font-semibold mb-4 text-red-400">Formatting Warnings</h3>
          <ul className="space-y-2">
            {ats.formatting_warnings.map((warning, index) => (
              <li key={index} className="text-gray-300">• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Keyword Density */}
      <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
        <h3 className="text-xl font-semibold mb-4">Keyword Density</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-3">High Match</th>
                <th className="pb-3">Partial Match</th>
                <th className="pb-3">Missing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">
                  <div className="flex flex-wrap gap-1">
                    {ats.keyword_density?.high_match?.map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex flex-wrap gap-1">
                    {ats.keyword_density?.partial_match?.map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex flex-wrap gap-1">
                    {ats.keyword_density?.missing?.map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRewrites = () => (
    <div className="space-y-4 fade-in">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCopyAllRewrites}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
        >
          <Copy className="w-4 h-4" />
          <span>Copy All Improved Bullets</span>
        </button>
      </div>
      {rewrites.rewrites?.map((rewrite, index) => (
        <RewriteCard key={index} rewrite={rewrite} />
      ))}
    </div>
  );

  const renderRoadmap = () => (
    <div className="space-y-6 fade-in">
      {/* Readiness */}
      <div className="bg-navy-800 rounded-xl p-8 border border-navy-700 text-center">
        <h2 className="text-2xl font-heading font-bold mb-4">Job Readiness</h2>
        <div className="text-6xl font-bold text-indigo-500 mb-2">
          {Math.round(gaps.readiness_percentage)}%
        </div>
        <p className="text-gray-400">{gaps.gap_summary}</p>
      </div>

      {/* Milestones */}
      <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
        <h3 className="text-xl font-semibold mb-4">Milestones</h3>
        <div className="space-y-4">
          {gaps.milestones?.map((milestone, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-300">{milestone.label}</span>
                <span className="text-gray-400">{milestone.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-navy-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500"
                  style={{ width: `${milestone.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Gaps */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Skill Gaps</h3>
        {gaps.skill_gaps?.map((gap, index) => (
          <RoadmapItem key={index} gap={gap} />
        ))}
      </div>
    </div>
  );

  const renderCoverLetter = () => (
    <div className="fade-in">
      <CoverLetterCard coverLetter={coverLetter} />
    </div>
  );

  return (
    <div className="min-h-screen bg-navy-900 pt-8 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-heading font-bold ml-4">Analysis Results</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-navy-800 rounded-lg p-1 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'ats' && renderATS()}
          {activeTab === 'rewrites' && renderRewrites()}
          {activeTab === 'roadmap' && renderRoadmap()}
          {activeTab === 'coverletter' && renderCoverLetter()}
        </div>
      </div>
    </div>
  );
};

export default Results;
