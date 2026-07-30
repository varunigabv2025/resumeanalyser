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
      'Parsing resume...',
      'Running ATS check...',
      'Finding skill gaps...',
      'Generating rewrites...',
      'Writing cover letter...'
    ];

    const analyze = async (file, jobDescription) => {
      setLoading(true);
      setProgress(0);
      setCurrentStep(steps[0]);

      try {
        // Simulate progress updates
        let stepIndex = 0;
        const progressInterval = setInterval(() => {
          if (stepIndex < steps.length) {
            setCurrentStep(steps[stepIndex]);
            setProgress(((stepIndex + 1) / steps.length) * 100);
            stepIndex++;
          }
        }, 2000);
        const result = await analyzeResume(file, jobDescription);
        if (result.success === false) {
  toast.error(result.error);
  return;
}


  console.log("API RESULT:");
  console.log(result);
  console.log(JSON.stringify(result, null, 2));

        

        
        clearInterval(progressInterval);
        setProgress(100);
        
        // Store result in sessionStorage for Results page
        sessionStorage.setItem('analysisResult', JSON.stringify(result));
        
        toast.success('Analysis complete!');
        navigate('/results');
      } catch (error) {
        toast.error('Analysis failed. Please try again.');
        console.error('Analysis error:', error);
      } finally {
        setLoading(false);
        setProgress(0);
        setCurrentStep('');
      }
    };

    return { analyze, loading, progress, currentStep };
  };
