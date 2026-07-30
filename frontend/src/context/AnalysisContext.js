import React, { createContext, useContext, useState, useEffect } from 'react';

const AnalysisContext = createContext(null);

export const AnalysisProvider = ({ children }) => {
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('analysisResult');
    if (stored) {
      try {
        setAnalysisData(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored analysis session:', e);
      }
    }
  }, []);

  const updateAnalysis = (data) => {
    setAnalysisData(data);
    if (data) {
      sessionStorage.setItem('analysisResult', JSON.stringify(data));
    } else {
      sessionStorage.removeItem('analysisResult');
    }
  };

  return (
    <AnalysisContext.Provider value={{ analysisData, setAnalysisData: updateAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysisContext = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    return { analysisData: null, setAnalysisData: () => {} };
  }
  return context;
};

export default AnalysisContext;
