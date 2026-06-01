import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, getAnalysis } from '../api/client';
import { Eye, Calendar, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setAnalyses(data);
    } catch (error) {
      toast.error('Failed to load history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const analysis = await getAnalysis(id);
      sessionStorage.setItem('analysisResult', JSON.stringify(analysis));
      navigate('/results');
    } catch (error) {
      toast.error('Failed to load analysis');
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-gray-400">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 pt-8 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-8">Analysis History</h1>

        {analyses.length === 0 ? (
          <div className="bg-navy-800 rounded-xl p-12 border border-navy-700 text-center">
            <p className="text-gray-400 text-lg">No analyses yet</p>
            <p className="text-gray-500 mt-2">Upload a resume to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="bg-navy-800 rounded-lg p-6 border border-navy-700 hover:border-indigo-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <Briefcase className="w-5 h-5 text-indigo-500" />
                      <h3 className="font-semibold text-lg">{analysis.job_title}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-400 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(analysis.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Match Score</p>
                      <p className={`text-2xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                        {Math.round(analysis.overall_score)}%
                      </p>
                    </div>
                    <button
                      onClick={() => handleView(analysis.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
