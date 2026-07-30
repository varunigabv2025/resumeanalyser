/**
 * GitHub Analyzer Output Mock (SkillBridge AI)
 * 
 * Realistic mock matching Person A's planned GitHub Analyzer output schema.
 * Exposes extracted technologies in `github.skills`.
 */

const githubMock = {
  username: "alexmorgan-dev",
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  bio: "Backend engineer passionate about scalable cloud architectures, APIs, and open-source tooling.",
  location: "San Francisco, CA",
  skills: [
    "JavaScript",
    "Node.js",
    "Express",
    "Docker",
    "TypeScript",
    "PostgreSQL",
    "Git"
  ],
  totalRepos: 18,
  totalStars: 42,
  totalContributions: 384,
  topLanguages: [
    "JavaScript",
    "TypeScript",
    "Python"
  ],
  repositories: [
    {
      name: "express-microservices-template",
      description: "Production boilerplate for Node.js REST APIs with Docker container support",
      language: "TypeScript",
      stars: 24,
      topics: ["nodejs", "express", "docker", "typescript"]
    },
    {
      name: "sql-query-builder",
      description: "Lightweight SQL query builder for Node.js applications",
      language: "JavaScript",
      stars: 18,
      topics: ["javascript", "sql", "postgresql"]
    }
  ]
};

module.exports = githubMock;
