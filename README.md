# SkillHive AI

A full-stack web application that builds a unified developer profile from a resume and GitHub activity. It analyzes the resume against a job description, verifies claimed skills against real GitHub evidence with a Trust Score, and — once enough claims are verified — matches the candidate with complementary teammates through SkillSwap.

## 🎯 Features

- **AI-Powered Resume Analysis**: Uses Google's Gemma 4 model (`gemma-4-26b-a4b-it`) via the Gemini API for resume scoring, ATS simulation, gap analysis, bullet rewrites, and cover letter generation — 5 analyses in parallel per resume.
- **ATS Compatibility Check**: Simulates ATS systems to predict resume filtering.
- **Skill Gap Analysis**: Identifies missing skills with a milestone-based learning roadmap.
- **Bullet Point Rewrites**: AI-powered, fact-preserving suggestions to improve resume bullet points.
- **Cover Letter Generation**: Tailored cover letters based on resume and job description.
- **GitHub Analyzer**: Pulls a candidate's public repos, languages, topics, and Docker/CI usage to derive real, evidence-backed skills.
- **Unified Profile**: Merges resume-derived skills and GitHub-derived skills into one profile record.
- **Trust Score**: Percentage of resume-claimed skills that are actually verifiable from GitHub activity (`verified_skills / total_claimed_skills × 100`). Scores ≥ 50% unlock SkillSwap matching; scores below that still get the full gap report plus a CTA to build public proof of the claimed skills.
- **SkillSwap Matching**: Matches a candidate against a profile pool based on skill complementarity — what each person can teach the other — ranked by compatibility score.
- **History Tracking**: SQLite database to store and review past analyses.
- **Modern UI**: Dark navy theme with indigo accents, fully responsive design.

## 📁 Project Structure

```
├── backend-node/
│   ├── server.js            # Express server with all endpoints
│   ├── database.js          # SQLite setup (resume_analyses + unified_profiles tables)
│   ├── resumeParser.js       # PDF and DOCX text extraction
│   ├── ocrParser.js          # Image OCR scaffold (not wired in — paste-text is the fallback)
│   ├── aiAnalyzer.js         # Gemma 4 (Gemini API) integration — 5 parallel calls
│   ├── githubAnalyzer.js     # GitHub REST API integration — languages, topics, Docker/CI detection
│   ├── trustScore.js         # Trust Score calculation (also runnable standalone: `node trustScore.js`)
│   ├── skillMatcher.js       # SkillSwap matching logic (also runnable standalone: `node skillMatcher.js`)
│   ├── mockProfiles.js       # Seed profile pool used for demo-time SkillSwap matching
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js       # Upload and job description input
│   │   │   ├── Results.js    # 6-tab results dashboard (adds "GitHub & Trust")
│   │   │   └── History.js    # Past analyses list
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ScoreCard.js
│   │   │   ├── SkillBadge.js
│   │   │   ├── RewriteCard.js
│   │   │   ├── RoadmapItem.js
│   │   │   ├── CoverLetterCard.js
│   │   │   ├── LoadingScreen.js
│   │   │   ├── TrustScoreGauge.js     # Trust Score ring
│   │   │   ├── GithubStatsCard.js     # GitHub languages/skills/repo stats
│   │   │   └── SkillSwapMatchCard.js  # A single teammate match
│   │   ├── hooks/
│   │   │   └── useAnalyze.js
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── App.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- A Google AI Studio API key ([get one here](https://aistudio.google.com/app/apikey))
- A GitHub personal access token (optional, but strongly recommended — see below)

### Backend Setup

```bash
cd backend-node
npm install
cp .env.example .env
```

Edit `.env`:
```
GOOGLE_API_KEY=your_google_ai_studio_api_key_here
PORT=8000
GITHUB_TOKEN=your_github_personal_access_token_here
```

- `GOOGLE_API_KEY` is required — this is what powers all resume analysis.
- `GITHUB_TOKEN` is optional but recommended. Without it, GitHub API calls are limited to 60 requests/hour; with a token, that jumps to 5000/hour. Generate one at github.com/settings/tokens (no special scopes needed for public profile reads).

Run the server:
```bash
npm run dev   # auto-restarts on change, via nodemon
# or
npm start
```

The backend runs on `http://localhost:8000`.

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env` to point the frontend at your local backend:
```
REACT_APP_API_URL=http://localhost:8000
```

Then:
```bash
npm start
```

The frontend runs on `http://localhost:3000`.

## 📊 API Endpoints

### POST `/api/analyze`
Analyzes a resume against a job description.

**Request**: `multipart/form-data`
- `resume_file`: PDF or DOCX file
- `job_description`: Job description text

**Response**: JSON with `core_match`, `ats`, `rewrites`, `gaps`, and `cover_letter` sections, plus the saved analysis `id`.

### GET `/api/history`
Returns a list of all past resume analyses (id, date, job title, score).

### GET `/api/history/:id`
Returns a specific resume analysis in full.

### POST `/api/github/analyze`
Analyzes a GitHub profile in isolation.

**Request body**: `{ "username": "githubusername" }`

**Response**: `{ username, languages, skills, repoCount, hasDocker, hasCI, lastCommitDate }`

### POST `/api/profile/unify`
Merges a saved resume analysis with a GitHub profile into a Unified Profile, computes the Trust Score, and — if the score is ≥ 50% — returns SkillSwap matches.

**Request body**: `{ "resumeAnalysisId": 1, "githubUsername": "githubusername" }`

**Response**:
```json
{
  "id": 1,
  "trustScore": 75,
  "verifiedSkills": ["JavaScript", "Node.js", "Docker"],
  "matchedSkills": [],
  "missingSkills": [],
  "github": { "username": "...", "languages": [], "skills": [], "repoCount": 22, "hasDocker": true, "hasCI": false },
  "skillswapUnlocked": true,
  "matches": [{ "person2": "...", "score": 3, "person1CanTeach": [], "person2CanTeach": [], "reason": "..." }],
  "cta": null
}
```

If the GitHub lookup fails (bad username, rate limit), the request still succeeds with `github: null` and a resume-only response — the pipeline degrades gracefully rather than failing outright.

### GET `/api/profile/:id`
Fetches a previously saved Unified Profile.

## 🎨 UI Design

- **Color Palette**: Dark navy background (`#0F172A`), white cards, indigo accent (`#6366F1`)
- **Typography**: DM Sans for body text, Sora for headings
- **Responsive**: Mobile-friendly design with Tailwind CSS
- **Animations**: Smooth tab transitions and loading states

## 🔧 Technology Stack

### Backend
- **Express**: Node.js web framework
- **Gemma 4 (via Gemini API)**: `gemma-4-26b-a4b-it`, a Mixture-of-Experts model — chosen for lower latency/cost per call since 5 analyses run in parallel per resume
- **GitHub REST API**: repo, language, and topic data for skill verification
- **pdf-parse** / **mammoth**: PDF and DOCX text extraction
- **sqlite3**: SQLite database driver
- **multer**: File upload handling

### Frontend
- **React**: UI library
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **react-dropzone**: File upload component
- **axios**: HTTP client
- **lucide-react**: Icon library
- **react-hot-toast**: Toast notifications

## 📝 Usage

1. **Home Page**: Upload your resume (PDF or DOCX) and paste a job description.
2. **Analyze**: Click "Analyze Resume" to start the AI analysis.
3. **Results dashboard** (6 tabs):
   - **Overview**: Overall score, section scores, matched/missing skills
   - **ATS Check**: ATS compatibility, detected sections, keyword density
   - **Rewrite Suggestions**: Improved bullet points with reasons
   - **Gap Roadmap**: Missing skills with learning resources and milestones
   - **GitHub & Trust**: Connect a GitHub username to verify your claimed skills, see your Trust Score, and (if unlocked) SkillSwap teammate matches
   - **Cover Letter**: AI-generated cover letter
4. **History**: View past analyses from the History page.

## 🔐 Environment Variables

Required in `backend-node/.env`:
```
GOOGLE_API_KEY=your_google_ai_studio_api_key_here
PORT=8000
GITHUB_TOKEN=your_github_personal_access_token_here
```

Required in `frontend/.env` for local development:
```
REACT_APP_API_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### Backend Issues
- Ensure `GOOGLE_API_KEY` is set correctly in `backend-node/.env`
- Check that all Node.js dependencies are installed (`npm install`)
- Verify the backend is running on port 8000
- If GitHub lookups fail with a 403/429, you've hit GitHub's rate limit — add a `GITHUB_TOKEN`

### Frontend Issues
- Clear browser cache / hard-refresh if you see stale data after pulling changes
- Ensure `REACT_APP_API_URL` points at a running backend
- Check browser console for errors
- On Windows, if `npm install` fails with a PowerShell script-execution error, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, or use Command Prompt instead

### File Upload Issues
- Ensure file is PDF or DOCX format
- Image-based/Canva PDFs aren't OCR'd — use the paste-text fallback or export as a text-based PDF/DOCX

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!
