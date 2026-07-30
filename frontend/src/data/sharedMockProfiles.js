/**
 * Shared Mock Dataset for SkillBridge AI (Frontend Export)
 * 20 Realistic Developer Profiles
 */

export const sharedMockProfiles = [
  {
    resumeAnalysis: {
      user: { name: "Aarav Sharma", email: "aarav.sharma@example.com", title: "Full Stack Developer" },
      candidate_name: "Aarav Sharma",
      user_email: "aarav.sharma@example.com",
      job_title: "Full Stack Developer",
      core_match: {
        overall_score: 92,
        matched_skills: ["React", "Node.js", "TypeScript", "Express", "PostgreSQL", "Git"],
        missing_skills: ["Docker", "AWS"],
        summary: "Highly proficient Full Stack engineer with strong JavaScript/TypeScript fundamentals."
      },
      ats: { ats_score: 90 },
      gaps: { readiness_percentage: 88 }
    },
    githubAnalysis: {
      username: "aarav-sharma-dev",
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      bio: "Full-stack developer building modern web apps with TypeScript and React.",
      location: "Bengaluru, India",
      skills: ["React", "Node.js", "TypeScript", "Express", "PostgreSQL", "Git"],
      totalRepos: 22,
      totalStars: 58,
      totalContributions: 540,
      topLanguages: ["TypeScript", "JavaScript", "HTML"],
      repositories: [
        { name: "ts-react-dashboard", language: "TypeScript", stars: 35, topics: ["react", "typescript", "tailwindcss"] },
        { name: "node-express-postgres-api", language: "JavaScript", stars: 23, topics: ["nodejs", "express", "postgresql"] }
      ]
    }
  },
  {
    resumeAnalysis: {
      user: { name: "Priya Patel", email: "priya.patel@example.com", title: "DevOps & Cloud Engineer" },
      candidate_name: "Priya Patel",
      user_email: "priya.patel@example.com",
      job_title: "DevOps Engineer",
      core_match: {
        overall_score: 94,
        matched_skills: ["Docker", "Kubernetes", "AWS", "Terraform", "Linux", "Git"],
        missing_skills: ["React", "Node.js"],
        summary: "Experienced DevOps engineer automating cloud infrastructure and CI/CD pipelines."
      },
      ats: { ats_score: 92 },
      gaps: { readiness_percentage: 90 }
    },
    githubAnalysis: {
      username: "priyapatel-cloud",
      name: "Priya Patel",
      email: "priya.patel@example.com",
      bio: "Automating cloud infrastructure with Terraform, Kubernetes, and AWS.",
      location: "Pune, India",
      skills: ["Docker", "Kubernetes", "AWS", "Terraform", "Linux", "Git", "Python"],
      totalRepos: 19,
      totalStars: 64,
      totalContributions: 620,
      topLanguages: ["HCL", "Python", "Shell"],
      repositories: [
        { name: "k8s-terraform-aws-setup", language: "HCL", stars: 40, topics: ["terraform", "kubernetes", "aws"] }
      ]
    }
  },
  {
    resumeAnalysis: {
      user: { name: "Rohan Verma", email: "rohan.verma@example.com", title: "AI / Machine Learning Engineer" },
      candidate_name: "Rohan Verma",
      user_email: "rohan.verma@example.com",
      job_title: "AI Engineer",
      core_match: {
        overall_score: 95,
        matched_skills: ["Python", "PyTorch", "TensorFlow", "Pandas", "NumPy", "Git"],
        missing_skills: ["React", "Next.js", "Docker"],
        summary: "Machine learning research engineer focused on deep learning model optimization."
      },
      ats: { ats_score: 94 },
      gaps: { readiness_percentage: 92 }
    },
    githubAnalysis: {
      username: "rohan-ai-labs",
      name: "Rohan Verma",
      email: "rohan.verma@example.com",
      bio: "Deep learning research and computer vision pipelines in PyTorch.",
      location: "Hyderabad, India",
      skills: ["Python", "PyTorch", "TensorFlow", "Pandas", "NumPy", "Git", "FastAPI"],
      totalRepos: 25,
      totalStars: 82,
      totalContributions: 710,
      topLanguages: ["Python", "C++"],
      repositories: [
        { name: "pytorch-transformer-experiments", language: "Python", stars: 52, topics: ["pytorch", "deep-learning"] }
      ]
    }
  },
  {
    resumeAnalysis: {
      user: { name: "Sneha Gupta", email: "sneha.gupta@example.com", title: "Frontend Engineer" },
      candidate_name: "Sneha Gupta",
      user_email: "sneha.gupta@example.com",
      job_title: "Frontend Developer",
      core_match: {
        overall_score: 91,
        matched_skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "JavaScript", "Git"],
        missing_skills: ["Python", "PyTorch", "Node.js"],
        summary: "Specialist frontend developer crafting responsive, pixel-perfect web applications."
      },
      ats: { ats_score: 89 },
      gaps: { readiness_percentage: 86 }
    },
    githubAnalysis: {
      username: "snehagupta-ui",
      name: "Sneha Gupta",
      email: "sneha.gupta@example.com",
      bio: "Crafting beautiful UI components with Next.js, React, and Tailwind CSS.",
      location: "Delhi, India",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "JavaScript", "Git"],
      totalRepos: 17,
      totalStars: 49,
      totalContributions: 480,
      topLanguages: ["TypeScript", "CSS"],
      repositories: [
        { name: "nextjs-tailwind-ui-kit", language: "TypeScript", stars: 31, topics: ["nextjs", "react"] }
      ]
    }
  },
  {
    resumeAnalysis: {
      user: { name: "Vikram Singh", email: "vikram.singh@example.com", title: "Senior Java Backend Engineer" },
      candidate_name: "Vikram Singh",
      user_email: "vikram.singh@example.com",
      job_title: "Backend Developer",
      core_match: {
        overall_score: 93,
        matched_skills: ["Java", "Spring Boot", "PostgreSQL", "Redis", "Docker", "Git"],
        missing_skills: ["Kotlin", "Android"],
        summary: "Enterprise backend developer specializing in Spring Boot microservices and caching."
      },
      ats: { ats_score: 91 },
      gaps: { readiness_percentage: 89 }
    },
    githubAnalysis: {
      username: "vikram-java-dev",
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
      bio: "Building high-concurrency enterprise services in Java and Spring Boot.",
      location: "Mumbai, India",
      skills: ["Java", "Spring Boot", "PostgreSQL", "Redis", "Docker", "Git"],
      totalRepos: 21,
      totalStars: 60,
      totalContributions: 590,
      topLanguages: ["Java", "SQL"],
      repositories: [
        { name: "spring-boot-redis-microservice", language: "Java", stars: 38, topics: ["springboot", "redis"] }
      ]
    }
  },
  {
    resumeAnalysis: {
      user: { name: "Ananya Iyer", email: "ananya.iyer@example.com", title: "Android Mobile Engineer" },
      candidate_name: "Ananya Iyer",
      user_email: "ananya.iyer@example.com",
      job_title: "Android Developer",
      core_match: {
        overall_score: 90,
        matched_skills: ["Android", "Kotlin", "Java", "SQLite", "Git"],
        missing_skills: ["Spring Boot", "Redis"],
        summary: "Native Android engineer experienced in Kotlin, offline storage, and modern UI design."
      },
      ats: { ats_score: 88 },
      gaps: { readiness_percentage: 87 }
    },
    githubAnalysis: {
      username: "ananya-android",
      name: "Ananya Iyer",
      email: "ananya.iyer@example.com",
      bio: "Developing native Android apps with Kotlin and Jetpack architecture.",
      location: "Chennai, India",
      skills: ["Android", "Kotlin", "Java", "SQLite", "Git"],
      totalRepos: 16,
      totalStars: 44,
      totalContributions: 410,
      topLanguages: ["Kotlin"],
      repositories: [
        { name: "kotlin-android-e-commerce", language: "Kotlin", stars: 28, topics: ["android", "kotlin"] }
      ]
    }
  },
  {
    resumeAnalysis: {
      user: { name: "Karan Malhotra", email: "karan.malhotra@example.com", title: "Cybersecurity Analyst" },
      candidate_name: "Karan Malhotra",
      user_email: "karan.malhotra@example.com",
      job_title: "Cybersecurity Specialist",
      core_match: {
        overall_score: 91,
        matched_skills: ["Cybersecurity", "Penetration Testing", "Linux", "Python", "OWASP", "Git"],
        missing_skills: ["AWS", "Docker"],
        summary: "Security auditor specializing in application security, penetration testing, and OWASP compliance."
      },
      ats: { ats_score: 89 },
      gaps: { readiness_percentage: 88 }
    },
    githubAnalysis: {
      username: "karan-sec-tools",
      name: "Karan Malhotra",
      email: "karan.malhotra@example.com",
      bio: "Automating security vulnerability scans and penetration testing scripts.",
      location: "Gurugram, India",
      skills: ["Cybersecurity", "Penetration Testing", "Linux", "Python", "OWASP", "Git"],
      totalRepos: 15,
      totalStars: 50,
      totalContributions: 390,
      topLanguages: ["Python"],
      repositories: [
        { name: "owasp-vulnerability-scanner", language: "Python", stars: 36, topics: ["owasp", "python"] }
      ]
    }
  },
  {
    resumeAnalysis: {
      user: { name: "Divya Nair", email: "divya.nair@example.com", title: "Data & Cloud Engineer" },
      candidate_name: "Divya Nair",
      user_email: "divya.nair@example.com",
      job_title: "Data Engineer",
      core_match: {
        overall_score: 93,
        matched_skills: ["Python", "PostgreSQL", "AWS", "Docker", "Pandas", "Git"],
        missing_skills: ["Cybersecurity", "Penetration Testing"],
        summary: "Data engineer building cloud data pipelines and data warehouse solutions on AWS."
      },
      ats: { ats_score: 91 },
      gaps: { readiness_percentage: 90 }
    },
    githubAnalysis: {
      username: "divya-data-cloud",
      name: "Divya Nair",
      email: "divya.nair@example.com",
      bio: "ETL data pipelines, cloud architecture on AWS, and PostgreSQL optimization.",
      location: "Kochi, India",
      skills: ["Python", "PostgreSQL", "AWS", "Docker", "Pandas", "Git", "Redis"],
      totalRepos: 20,
      totalStars: 55,
      totalContributions: 510,
      topLanguages: ["Python"],
      repositories: [
        { name: "aws-etl-pipeline-python", language: "Python", stars: 33, topics: ["aws", "pandas"] }
      ]
    }
  },
  {
    resumeAnalysis: {
      user: { name: "Rahul Das", email: "rahul.das@example.com", title: "UI Engineer" },
      candidate_name: "Rahul Das",
      user_email: "rahul.das@example.com",
      job_title: "UI Engineer",
      core_match: {
        overall_score: 82,
        matched_skills: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Vue.js", "Figma"],
        missing_skills: ["TypeScript", "Node.js"],
        summary: "UI design and frontend web developer skilled in responsive web layouts."
      },
      ats: { ats_score: 80 },
      gaps: { readiness_percentage: 78 }
    },
    githubAnalysis: {
      username: "rahuldas-ui",
      name: "Rahul Das",
      email: "rahul.das@example.com",
      bio: "Creating user interfaces with HTML, CSS, JavaScript, and Tailwind CSS.",
      location: "Kolkata, India",
      skills: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
      totalRepos: 12,
      totalStars: 19,
      totalContributions: 240,
      topLanguages: ["JavaScript"],
      repositories: [
        { name: "tailwind-landing-pages", language: "HTML", stars: 12, topics: ["tailwindcss"] }
      ]
    }
  },
  {
    resumeAnalysis: {
      user: { name: "Meera Reddy", email: "meera.reddy@example.com", title: "Full Stack Software Engineer" },
      candidate_name: "Meera Reddy",
      user_email: "meera.reddy@example.com",
      job_title: "Full Stack Engineer",
      core_match: {
        overall_score: 84,
        matched_skills: ["Node.js", "Express", "MongoDB", "React", "GraphQL", "Redis", "Docker"],
        missing_skills: ["PostgreSQL", "TypeScript"],
        summary: "Full stack MERN stack developer with API design and database administration background."
      },
      ats: { ats_score: 82 },
      gaps: { readiness_percentage: 75 }
    },
    githubAnalysis: {
      username: "meera-reddy-dev",
      name: "Meera Reddy",
      email: "meera.reddy@example.com",
      bio: "Node.js REST services and MongoDB database architecture.",
      location: "Bengaluru, India",
      skills: ["Node.js", "Express", "MongoDB", "React"],
      totalRepos: 11,
      totalStars: 15,
      totalContributions: 210,
      topLanguages: ["JavaScript"],
      repositories: [
        { name: "mern-task-manager", language: "JavaScript", stars: 10, topics: ["nodejs", "express"] }
      ]
    }
  },
  {
    resumeAnalysis: {
      user: { name: "Siddharth Mehta", email: "siddharth.m@example.com", title: "Senior Full Stack Architect" },
      candidate_name: "Siddharth Mehta",
      user_email: "siddharth.m@example.com",
      job_title: "Senior Full Stack Architect",
      core_match: {
        overall_score: 88,
        matched_skills: ["React", "Next.js", "Node.js", "TypeScript", "GraphQL", "Docker", "AWS", "Kubernetes", "MongoDB"],
        missing_skills: ["Python"],
        summary: "Claims expert mastery across full stack web development, cloud, and container orchestration."
      },
      ats: { ats_score: 86 },
      gaps: { readiness_percentage: 60 }
    },
    githubAnalysis: {
      username: "siddharth-mehta-dev",
      name: "Siddharth Mehta",
      email: "siddharth.m@example.com",
      bio: "Web developer working on JS projects.",
      location: "Jaipur, India",
      skills: ["React", "JavaScript", "Node.js", "HTML", "CSS"],
      totalRepos: 6,
      totalStars: 5,
      totalContributions: 75,
      topLanguages: ["JavaScript"],
      repositories: [
        { name: "sample-react-todo", language: "JavaScript", stars: 3, topics: ["react"] }
      ]
    }
  },
  {
    resumeAnalysis: {
      user: { name: "Abhinav Roy", email: "abhinav.roy@example.com", title: "Chief Software Architect" },
      candidate_name: "Abhinav Roy",
      user_email: "abhinav.roy@example.com",
      job_title: "Chief Software Architect",
      core_match: {
        overall_score: 95,
        matched_skills: ["React", "Next.js", "Node.js", "Express", "TypeScript", "Python", "Django", "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS"],
        missing_skills: [],
        summary: "Resume claims expert mastery over 13+ technologies across full stack, AI, and DevOps cloud tools."
      },
      ats: { ats_score: 94 },
      gaps: { readiness_percentage: 35 }
    },
    githubAnalysis: {
      username: "abhinav-roy-official",
      name: "Abhinav Roy",
      email: "abhinav.roy@example.com",
      bio: "Learning web development.",
      location: "Patna, India",
      skills: ["HTML", "CSS", "JavaScript"],
      totalRepos: 2,
      totalStars: 0,
      totalContributions: 12,
      topLanguages: ["HTML"],
      repositories: [
        { name: "portfolio-static", language: "HTML", stars: 0, topics: ["html"] }
      ]
    }
  }
];
