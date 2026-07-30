import { useState } from 'react';
import { analyzeResume } from '../api/client';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useAnalyze = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const navigate = useNavigate();

  const steps = [
    'Parsing resume file...',
    'Running ATS compatibility check...',
    'Finding skill gaps & readiness...',
    'Generating AI bullet rewrites...',
    'Writing tailored cover letter...'
  ];

  const analyze = async (file, jobDescription) => {
    console.log('[DEBUG useAnalyze] Starting analyze workflow...');
    console.log('[DEBUG useAnalyze] Selected File:', file?.name, 'Size:', file?.size, 'Type:', file?.type);
    console.log('[DEBUG useAnalyze] Job Description Length:', jobDescription?.length);

    setLoading(true);
    setProgress(5);
    setCurrentStep(steps[0]);

    let stepIndex = 0;
    const progressInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex]);
        setProgress(((stepIndex + 1) / steps.length) * 90);
        stepIndex++;
      }
    }, 2000);

    try {
      console.log('[DEBUG useAnalyze] Triggering analyzeResume API call...');
      const result = await analyzeResume(file, jobDescription);
      console.log('[DEBUG useAnalyze] API call returned successfully:', result);

      clearInterval(progressInterval);

      if (result && result.success === false) {
        console.warn('[DEBUG useAnalyze] Server returned error state:', result.error);
        toast.error(result.error || 'Resume parsing failed.');
        return;
      }

      setProgress(100);

      // Store result in sessionStorage for Results page
      sessionStorage.setItem('analysisResult', JSON.stringify(result));
      console.log('[DEBUG useAnalyze] Stored result in sessionStorage. Navigating to /results...');

      toast.success('Analysis complete!');
      navigate('/results');
    } catch (error) {
      clearInterval(progressInterval);
      console.error('[DEBUG useAnalyze] Exception encountered during analysis:');
      console.error('  - Error Message:', error.message);
      console.error('  - Response Status:', error.response?.status);
      console.error('  - Response Data:', error.response?.data);

      const errorMessage = error.response?.data?.error || error.message || 'Analysis failed. Please try again.';
      toast.error(`Analysis failed: ${errorMessage}`);
    } finally {
      setLoading(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  return { analyze, loading, progress, currentStep };
};
