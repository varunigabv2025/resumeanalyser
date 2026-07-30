import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, Target, BookOpen, Mail } from 'lucide-react';
import { useAnalyze } from '../hooks/useAnalyze';
import LoadingScreen from '../components/LoadingScreen';

const Home = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  const { analyze, loading, progress, currentStep } = useAnalyze();

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const handleAnalyze = () => {
    if (!file) {
      alert('Please upload a resume');
      return;
    }

    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    analyze(file, jobDescription);
  };

  if (loading) {
    return (
      <LoadingScreen
        progress={progress}
        currentStep={currentStep}
      />
    );
  }

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Hero Section */}
      <div className="pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-heading font-bold mb-4">
            AI-Powered <span className="text-indigo-500">Resume Analysis</span>
          </h1>

          <p className="text-xl text-gray-400 mb-8">
            Upload your resume and get instant insights to land your dream job
          </p>
        </div>
      </div>

      {/* Input Panels */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 gap-8">

          {/* Resume Upload */}
          <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-indigo-500" />
              Upload Resume
            </h2>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-navy-600 hover:border-indigo-500'
              }`}
            >
              <input {...getInputProps()} />

              {file ? (
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="w-8 h-8 text-indigo-500" />
                  <span className="text-gray-300">{file.name}</span>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />

                  <p className="text-gray-400">
                    {isDragActive
                      ? 'Drop your resume here'
                      : 'Drag & drop or click to upload'}
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    PDF or DOCX
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-500" />
              Job Description
            </h2>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-48 bg-navy-900 border border-navy-600 rounded-lg p-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
            />

            <p className="text-gray-500 text-sm mt-2">
              {jobDescription.length} characters
            </p>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleAnalyze}
            disabled={!file || !jobDescription.trim()}
            className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-navy-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors text-lg"
          >
            Analyze Resume
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-navy-800 rounded-lg p-6 border border-navy-700 text-center">
            <CheckCircle className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">ATS Score</h3>
            <p className="text-gray-400 text-sm">
              Check if your resume passes ATS filters
            </p>
          </div>

          <div className="bg-navy-800 rounded-lg p-6 border border-navy-700 text-center">
            <Target className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Skill Match</h3>
            <p className="text-gray-400 text-sm">
              See how your skills align with the job
            </p>
          </div>

          <div className="bg-navy-800 rounded-lg p-6 border border-navy-700 text-center">
            <BookOpen className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Gap Roadmap</h3>
            <p className="text-gray-400 text-sm">
              Get a learning plan for missing skills
            </p>
          </div>

          <div className="bg-navy-800 rounded-lg p-6 border border-navy-700 text-center">
            <Mail className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Cover Letter</h3>
            <p className="text-gray-400 text-sm">
              AI-generated cover letter tailored to the job
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;