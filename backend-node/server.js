require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./database');
const { extractResumeText } = require('./resumeParser');
const { runAllAnalyses } = require('./aiAnalyzer');
const { analyzeGithubProfile } = require('./githubAnalyzer');
const { calculateTrustScore } = require('./trustScore');
const { findMatchesForCandidate } = require('./skillMatcher');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8000',
    'https://resume-iq-jade-nu.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper functions
function extractCandidateName(resumeText) {
  const lines = resumeText.split('\n');
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.length < 50 && !/\d/.test(firstLine)) {
      return firstLine;
    }
  }
  return 'Candidate';
}

function extractJobTitle(jobDescription) {
  const lines = jobDescription.split('\n');
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (line && !/^we are|^we're|^about the|^job/i.test(line)) {
      if (line.length < 100) {
        return line;
      }
    }
  }
  return 'Position';
}

// Routes

// POST /api/analyze
app.post('/api/analyze', upload.single('resume_file'), async (req, res) => {
  try {
    const { job_description, github_url } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    if (!job_description) {
      return res.status(400).json({ error: 'Job description is required' });
    }
    
    // Extract text from resume
    const resumeText = await extractResumeText(file.buffer, file.mimetype);
    if (typeof resumeText !== "string") {
      return res.status(200).json(resumeText);
    }

    console.log("========== RESUME ==========");
    console.log(resumeText);
    console.log("============================");
    
    // Extract candidate name and job title
    const candidateName = extractCandidateName(resumeText);
    const jobTitle = extractJobTitle(job_description);
    
    // Run all AI analyses
    const analysisResults = await runAllAnalyses(resumeText, job_description, candidateName);

    // Optional GitHub Profile Analysis
    let githubAnalysis = null;
    if (github_url && typeof github_url === 'string' && github_url.trim()) {
      const username = github_url.trim().split('/').filter(Boolean).pop();
      if (username) {
        try {
          console.log(`[server.js] Analyzing GitHub profile for username: ${username}...`);
          githubAnalysis = await analyzeGithubProfile(username, analysisResults.core_match?.matched_skills || []);
        } catch (ghErr) {
          console.warn('[server.js] GitHub profile analysis skipped:', ghErr.message);
        }
      }
    }
    
    // Calculate Multi-Dimensional Trust Score & SkillSwap Matches
    const matchedSkills = analysisResults.core_match?.matched_skills || [];
    const missingSkills = analysisResults.core_match?.missing_skills || [];
    const githubSkills = githubAnalysis?.skills || [];

    const trustScoreResult = calculateTrustScore(matchedSkills, githubSkills, {
      githubAnalysis,
      overallScore: analysisResults.core_match?.overall_score,
      atsScore: analysisResults.ats?.ats_score
    });

    const skillSwapMatches = findMatchesForCandidate(matchedSkills, missingSkills, candidateName);

    // Save to database
    const insertQuery = `
      INSERT INTO resume_analyses (
        job_title, job_description, resume_text, overall_score,
        section_scores, matched_skills, missing_skills, improvement_tips,
        keyword_gaps, summary, ats_score, parsing_issues, detected_sections,
        missing_sections, keyword_density, formatting_warnings, ats_verdict,
        rewrites, readiness_percentage, gap_summary, skill_gaps, milestones,
        subject_line, cover_letter, highlights_used, tone, trust_score, skill_swap
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      jobTitle,
      job_description,
      resumeText,
      analysisResults.core_match?.overall_score || 0,
      JSON.stringify(analysisResults.core_match?.section_scores || {}),
      JSON.stringify(analysisResults.core_match?.matched_skills || []),
      JSON.stringify(analysisResults.core_match?.missing_skills || []),
      JSON.stringify(analysisResults.core_match?.improvement_tips || []),
      JSON.stringify(analysisResults.core_match?.keyword_gaps || []),
      analysisResults.core_match?.summary || '',
      analysisResults.ats?.ats_score || 0,
      JSON.stringify(analysisResults.ats?.parsing_issues || []),
      JSON.stringify(analysisResults.ats?.detected_sections || []),
      JSON.stringify(analysisResults.ats?.missing_sections || []),
      JSON.stringify(analysisResults.ats?.keyword_density || {}),
      JSON.stringify(analysisResults.ats?.formatting_warnings || []),
      analysisResults.ats?.ats_verdict || '',

      JSON.stringify(analysisResults.rewrites?.rewrites || []),

      analysisResults.gaps?.readiness_percentage || 0,
      analysisResults.gaps?.gap_summary || '',
      JSON.stringify(analysisResults.gaps?.skill_gaps || []),
      JSON.stringify(analysisResults.gaps?.milestones || []),

      analysisResults.cover_letter?.subject_line || '',
      analysisResults.cover_letter?.cover_letter || '',
      JSON.stringify(analysisResults.cover_letter?.highlights_used || []),
      analysisResults.cover_letter?.tone || '',
      JSON.stringify(trustScoreResult),
      JSON.stringify(skillSwapMatches)
    ];
    
    db.run(insertQuery, values, function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to save analysis' });
      }
      
      const response = {
        id: this.lastID,
        created_at: new Date().toISOString(),
        job_title: jobTitle,
        github_analysis: githubAnalysis,
        trust_score: trustScoreResult,
        skill_swap: skillSwapMatches,
        ...analysisResults
      };
      console.log("FINAL ANALYSIS RESPONSE GENERATED:");
      console.log(JSON.stringify(response, null, 2));
      
      res.json(response);
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/history
app.get('/api/history', (req, res) => {
  const query = `
    SELECT id, created_at, job_title, overall_score
    FROM resume_analyses
    ORDER BY created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch history' });
    }
    
    const analyses = rows.map(row => ({
      id: row.id,
      created_at: row.created_at,
      job_title: row.job_title,
      overall_score: row.overall_score
    }));
    
    res.json(analyses);
  });
});

// GET /api/history/:id
app.get('/api/history/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'SELECT * FROM resume_analyses WHERE id = ?';
  
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch analysis' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    let parsedTrust = {};
    let parsedSkillSwap = [];
    try { parsedTrust = JSON.parse(row.trust_score || '{}'); } catch (e) {}
    try { parsedSkillSwap = JSON.parse(row.skill_swap || '[]'); } catch (e) {}

    const analysis = {
      id: row.id,
      created_at: row.created_at,
      job_title: row.job_title,
      trust_score: parsedTrust,
      skill_swap: parsedSkillSwap,

      core_match: {
        overall_score: row.overall_score,
        section_scores: JSON.parse(row.section_scores || '{}'),
        matched_skills: JSON.parse(row.matched_skills || '[]'),
        missing_skills: JSON.parse(row.missing_skills || '[]'),
        improvement_tips: JSON.parse(row.improvement_tips || '[]'),
        keyword_gaps: JSON.parse(row.keyword_gaps || '[]'),
        summary: row.summary || ''
      },

      ats: {
        ats_score: row.ats_score,
        parsing_issues: JSON.parse(row.parsing_issues || '[]'),
        detected_sections: JSON.parse(row.detected_sections || '[]'),
        missing_sections: JSON.parse(row.missing_sections || '[]'),
        keyword_density: JSON.parse(row.keyword_density || '{}'),
        formatting_warnings: JSON.parse(row.formatting_warnings || '[]'),
        ats_verdict: row.ats_verdict || ''
      },

      rewrites: {
        rewrites: JSON.parse(row.rewrites || '[]')
      },

      gaps: {
        readiness_percentage: row.readiness_percentage,
        gap_summary: row.gap_summary || '',
        skill_gaps: JSON.parse(row.skill_gaps || '[]'),
        milestones: JSON.parse(row.milestones || '[]')
      },

      cover_letter: {
        subject_line: row.subject_line || '',
        cover_letter: row.cover_letter || '',
        highlights_used: JSON.parse(row.highlights_used || '[]'),
        tone: row.tone || 'Professional'
      }
    };
    
    res.json(analysis);
  });
});

// POST /api/github/analyze
app.post('/api/github/analyze', async (req, res) => {
  try {
    const { username } = req.body;

    const result = await analyzeGithubProfile(username);

    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error('GitHub analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
