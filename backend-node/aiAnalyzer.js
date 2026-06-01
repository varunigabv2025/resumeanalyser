require('dotenv').config();
const axios = require('axios');
function detectSections(resumeText) {
  if (!resumeText) return [];

  const text = resumeText.toLowerCase();

  const sections = [];

  if (
    text.includes("education") ||
    text.includes("academic")
  ) {
    sections.push("Education");
  }

  if (
    text.includes("skills") ||
    text.includes("technical skills") ||
    text.includes("programming languages")
  ) {
    sections.push("Skills");
  }

  if (
    text.includes("projects") ||
    text.includes("project") ||
    text.includes("hackathon") ||
    text.includes("hackathons")
  ) {
    sections.push("Projects");
  }

  if (
    text.includes("experience") ||
    text.includes("internship") ||
    text.includes("work experience")
  ) {
    sections.push("Experience");
  }

  if (
    text.includes("certification") ||
    text.includes("certifications") ||
    text.includes("certificate") ||
    text.includes("certificates")
  ) {
    sections.push("Certifications");
  }

  if (
    text.includes("achievement") ||
    text.includes("achievements") ||
    text.includes("award") ||
    text.includes("leadership")
  ) {
    sections.push("Achievements");
  }

  return [...new Set(sections)];
}
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function callAI(systemPrompt, userPrompt) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.3,
        response_format: {
          type: "json_object"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let text = response.data.choices[0].message.content.trim();

    // Remove markdown if present
    text = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    console.log("AI RESPONSE:");
    console.log(text);

    // Extract JSON even if AI adds extra text
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');

    if (start === -1 || end === -1) {
      throw new Error('No JSON found in AI response');
    }

    const jsonText = text.substring(start, end + 1);

    console.log("PARSED JSON:");
    console.log(jsonText);

    let parsed;

try {
  parsed = JSON.parse(jsonText);
} catch (err) {
  console.log("Invalid JSON received:");
  console.log(text);

  parsed = {
    ats_score: 0,
    parsing_issues: [],
    detected_sections: [],
    missing_sections: [],
    keyword_density: {
      high_match: [],
      partial_match: [],
      missing: []
    },
    formatting_warnings: [],
    ats_verdict: "Failed to parse AI response"
  };
}

return parsed;

  } catch (error) {
    console.error(
      'OpenRouter Error:',
      error.response?.data || error.message
    );

    throw new Error('AI analysis failed');
  }
}
async function analyzeGaps(resumeText, jobDescription) {
  return callAI(
`
You are a career coach.

Compare the resume against the job description.

Return ONLY valid JSON.

{
  "readiness_percentage": 75,
  "gap_summary": "",
  "skill_gaps": [
    {
      "skill": "",
      "priority": "High",
      "estimated_time": "",
      "resources": [
        {
          "name": "",
          "url": ""
        }
      ]
    }
  ],
  "milestones": [
    {
      "label": "",
      "percentage": 25
    }
  ]
}

Rules:
- readiness_percentage must be between 0 and 100
- generate at least 3 skill gaps
- every skill gap MUST contain resources
- resources must be an array
- generate 4 milestones
- do not leave fields empty
`,
`
RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`
  );
}
async function analyzeCoreMatch(resumeText, jobDescription) {
  return callAI(
`
You are an expert resume evaluator.

Compare the resume against the job description.

IMPORTANT:

ALL SCORES MUST BE IN WHOLE PERCENTAGES FROM 0 TO 100.

Examples:

90 = 90%
75 = 75%
40 = 40%

NEVER return decimals such as:
0.9
0.75
0.4

Return ONLY valid JSON:

{
  "overall_score": 0,
  "section_scores": {
    "skills": 0,
    "experience": 0,
    "education": 0,
    "keywords": 0
  },
  "matched_skills": [],
  "missing_skills": [],
  "improvement_tips": [],
  "keyword_gaps": [],
  "summary": ""
}
`,
`
RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`
  );
}
function detectSections(resumeText) {
  const text = resumeText.toLowerCase();

  const sections = [];

  if (/education/.test(text)) sections.push("Education");
  if (/skill/.test(text)) sections.push("Skills");
  if (/project/.test(text)) sections.push("Projects");

  if (
    /experience|internship|work experience|professional experience/.test(text)
  ) {
    sections.push("Experience");
  }

  if (/certificate|certification/.test(text)) {
    sections.push("Certifications");
  }

  if (/achievement|award|honor/.test(text)) {
    sections.push("Achievements");
  }

  return sections;
}
async function simulateATS(resumeText, jobDescription) {
  const systemPrompt = `
You are a professional ATS scanner.

Analyze the resume against the job description.

Return ONLY valid JSON.

{
  "ats_score": 0,
  "parsing_issues": [],
  "detected_sections": [],
  "missing_sections": [],
  "keyword_density": {
    "high_match": [],
    "partial_match": [],
    "missing": []
  },
  "formatting_warnings": [],
  "ats_verdict": ""
}
`;

  const ats = await callAI(
    systemPrompt,
    `
RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`
  );

  // Safety checks
  ats.parsing_issues = ats.parsing_issues || [];
  ats.detected_sections = ats.detected_sections || [];
  ats.missing_sections = ats.missing_sections || [];
  ats.formatting_warnings = ats.formatting_warnings || [];

  ats.keyword_density = ats.keyword_density || {
    high_match: [],
    partial_match: [],
    missing: []
  };

  // Detect sections from actual resume text
  ats.detected_sections = detectSections(resumeText);

  const expectedSections = [
    "Education",
    "Skills",
    "Projects",
    "Experience",
    "Certifications",
    "Achievements"
  ];

  ats.missing_sections = expectedSections.filter(
    section => !ats.detected_sections.includes(section)
  );

  // Remove fake formatting warnings for readable resumes
  if (
    resumeText &&
    resumeText.length > 1000 &&
    ats.formatting_warnings.some(
      warning =>
        warning.toLowerCase().includes("unreadable") ||
        warning.toLowerCase().includes("font") ||
        warning.toLowerCase().includes("format")
    )
  ) {
    ats.formatting_warnings = [];
  }

  // Convert decimal scores to percentage
  if (ats.ats_score <= 1) {
    ats.ats_score = Math.round(ats.ats_score * 100);
  }

  // Prevent invalid scores
  ats.ats_score = Math.max(
    0,
    Math.min(100, Number(ats.ats_score) || 0)
  );

  return ats;
}
async function rewriteBullets(resumeText, jobDescription) {
  return callAI(
`
You are an elite ATS resume optimization system.

TASK:
Analyze the resume against the job description and generate improved resume bullets.
IMPORTANT:

Only rewrite statements extracted from the RESUME.

Do NOT rewrite job description requirements.

Every "original" field must be copied from the resume text.

If a statement originates from the job description rather than the resume, ignore it.

STRICT RULES:

1. ONLY use information explicitly present in the resume.
2. NEVER invent:
   - skills
   - technologies
   - frameworks
   - certifications
   - projects
   - databases
   - cloud platforms
   - achievements
   - years of experience
   - metrics
   - responsibilities

3. If a skill appears in the job description but NOT in the resume:
   DO NOT add it.

4. Rewrite only existing resume content.

5. Make bullets:
   - ATS friendly
   - concise
   - professional
   - action-oriented

6. Preserve factual accuracy above all else.

7. Before generating each rewrite:
   Verify that every technology, framework, skill, and claim appears somewhere in the resume.

8. If verification fails:
   Reject that rewrite.

9. Each rewrite must improve wording without changing facts.

10. Reason field must explain what was improved.
11.The resume is a source of truth
12.The job description may influence wording,
but must never introduce new facts.
OUTPUT FORMAT:

Return ONLY valid JSON.

{
  "rewrites": [
    {
      "original": "",
      "improved": "",
      "reason": "",
      "confidence": 100
    }
  ]
}

Generate 5-10 rewrite suggestions.

Confidence Rules:
100 = every claim explicitly found in resume
90 = wording improved but no new information added
Below 90 = reject rewrite
`,
`
RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`
  );
}
async function generateCoverLetter(
  resumeText,
  jobDescription,
  candidateName = "Candidate"
) {
  return callAI(
`
You are a professional cover letter writer.

Return ONLY JSON:

{
  "subject_line": "Application for Position",
  "cover_letter": "Full cover letter here",
  "highlights_used": [
    "Python",
    "Machine Learning",
    "TensorFlow"
  ],
  "tone": "Professional"
}

Rules:
- cover_letter must contain at least 200 words
- never leave fields empty
- use information from resume
`,
`
CANDIDATE:
${candidateName}

RESUME:
${resumeText}

JOB:
${jobDescription}
`
  );
}
async function runAllAnalyses(
  resumeText,
  jobDescription,
  candidateName = 'Candidate'
) {
  const results = await Promise.allSettled([
    analyzeCoreMatch(resumeText, jobDescription),
    simulateATS(resumeText, jobDescription),
    rewriteBullets(resumeText, jobDescription),
    analyzeGaps(resumeText, jobDescription),
    generateCoverLetter(
      resumeText,
      jobDescription,
      candidateName
    )
  ]);

  return {
    core_match:
      results[0].status === "fulfilled"
        ? results[0].value
        : {},

    ats:
      results[1].status === "fulfilled"
        ? results[1].value
        : {},

    rewrites:
      results[2].status === "fulfilled"
        ? results[2].value
        : { rewrites: [] },

    gaps:
      results[3].status === "fulfilled"
        ? results[3].value
        : {
            readiness_percentage: 0,
            gap_summary: "",
            skill_gaps: [],
            milestones: []
          },

    cover_letter:
      results[4].status === "fulfilled"
        ? results[4].value
        : {
            subject_line: "",
            cover_letter: "",
            highlights_used: [],
            tone: "Professional"
          }
  };
}

module.exports = {
  runAllAnalyses
};