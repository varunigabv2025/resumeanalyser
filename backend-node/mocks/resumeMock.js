/**
 * ResumeIQ Analysis Output Mock (SkillBridge AI)
 * 
 * Realistic mock matching the exact structure returned by ResumeIQ's
 * POST /api/analyze endpoint and stored in the SQLite resume_analyses table.
 */

const resumeMock = {
  id: 101,
  created_at: "2026-07-30T10:00:00.000Z",
  job_title: "Senior Backend Engineer",
  candidate_name: "Alex Morgan",
  user_email: "alex.morgan@example.com",
  core_match: {
    overall_score: 85,
    section_scores: {
      skills: 90,
      experience: 85,
      education: 80,
      keywords: 85
    },
    matched_skills: [
      "JavaScript",
      "Node.js",
      "Express",
      "Python",
      "SQL",
      "MongoDB",
      "GraphQL"
    ],
    missing_skills: [
      "Docker",
      "Kubernetes",
      "Redis"
    ],
    improvement_tips: [
      "Add quantified metric outcomes to work experience section",
      "Highlight deployment experience in recent projects"
    ],
    keyword_gaps: [
      "Docker",
      "Kubernetes",
      "Microservices"
    ],
    summary: "Strong candidate demonstrating extensive backend development capabilities in Node.js and Python ecosystems."
  },
  ats: {
    ats_score: 88,
    parsing_issues: [],
    detected_sections: [
      "Education",
      "Skills",
      "Experience",
      "Projects"
    ],
    missing_sections: [
      "Certifications"
    ],
    keyword_density: {
      high_match: ["Node.js", "JavaScript"],
      partial_match: ["Express", "Python"],
      missing: ["Docker", "Kubernetes"]
    },
    formatting_warnings: [],
    ats_verdict: "Passed ATS screening with high compatibility."
  },
  rewrites: {
    rewrites: [
      {
        original: "Built REST APIs with Express and Node.js",
        improved: "Architected scalable RESTful microservices handling 100k daily requests using Node.js and Express",
        reason: "Added quantified metrics and action-oriented framing",
        confidence: 100
      }
    ]
  },
  gaps: {
    readiness_percentage: 80,
    gap_summary: "Solid core engineering foundation; upskilling recommended in container orchestration.",
    skill_gaps: [
      {
        skill: "Docker",
        priority: "High",
        estimated_time: "1 week",
        resources: [
          {
            "name": "Docker Basics for Backend Developers",
            "url": "https://example.com/docker-course"
          }
        ]
      }
    ],
    milestones: [
      { label: "Containerization Fundamentals", percentage: 25 },
      { label: "Dockerizing Express App", percentage: 50 },
      { label: "Compose & Multi-container setup", percentage: 75 },
      { label: "Production Deployment", percentage: 100 }
    ]
  },
  cover_letter: {
    subject_line: "Application for Senior Backend Engineer Position",
    cover_letter: "Dear Hiring Manager,\n\nI am excited to apply for the Senior Backend Engineer role...",
    highlights_used: ["Node.js", "Express", "Python"],
    tone: "Professional"
  }
};

module.exports = resumeMock;
