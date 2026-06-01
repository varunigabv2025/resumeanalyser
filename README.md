# ResumeIQ - AI-Powered Resume Analyzer

A full-stack web application that analyzes resumes against job descriptions using AI, providing comprehensive insights including ATS compatibility, skill matching, gap analysis, and cover letter generation.

## 🎯 Features

- **AI-Powered Analysis**: Uses Google Gemini API for intelligent resume analysis
- **ATS Compatibility Check**: Simulates ATS systems to predict resume filtering
- **Skill Gap Analysis**: Identifies missing skills with learning roadmaps
- **Bullet Point Rewrites**: AI-powered suggestions to improve resume bullet points
- **Cover Letter Generation**: Tailored cover letters based on resume and job description
- **History Tracking**: SQLite database to store and review past analyses
- **Modern UI**: Dark navy theme with indigo accents, fully responsive design

## 📁 Project Structure

```
├── backend-node/
│   ├── server.js            # Express server with endpoints
│   ├── database.js          # SQLite database setup
│   ├── resumeParser.js     # PDF and DOCX text extraction
│   ├── aiAnalyzer.js       # Gemini API integration (5 parallel calls)
│   ├── package.json        # Node.js dependencies
│   └── .env.example        # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js      # Upload and job description input
│   │   │   ├── Results.js   # 5-tab results dashboard
│   │   │   └── History.js   # Past analyses list
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ScoreCard.js
│   │   │   ├── SkillBadge.js
│   │   │   ├── RewriteCard.js
│   │   │   ├── RoadmapItem.js
│   │   │   ├── CoverLetterCard.js
│   │   │   └── LoadingScreen.js
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
- Google API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend-node
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and set your Google API key:
```bash
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

4. Run the Express server:
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📊 API Endpoints

### POST /api/analyze
Analyzes a resume against a job description.

**Request**: `multipart/form-data`
- `resume_file`: PDF or DOCX file
- `job_description`: Job description text (min 300 characters)

**Response**: JSON with analysis results including:
- Core match analysis (overall score, section scores, matched/missing skills)
- ATS simulation (ATS score, detected/missing sections, keyword density)
- Rewrite suggestions (improved bullet points)
- Gap analysis (skill gaps, learning roadmap, milestones)
- Cover letter (generated cover letter with tone)

### GET /api/history
Returns list of all past analyses.

**Response**: Array of analysis objects with id, date, job title, and score.

### GET /api/history/{id}
Returns a specific analysis by ID.

**Response**: Full analysis object with all details.

## 🎨 UI Design

- **Color Palette**: Dark navy background (#0F172A), white cards, indigo accent (#6366F1)
- **Typography**: DM Sans for body text, Sora for headings
- **Responsive**: Mobile-friendly design with Tailwind CSS
- **Animations**: Smooth tab transitions and loading states

## 🔧 Technology Stack

### Backend
- **Express**: Node.js web framework
- **Google Generative AI**: Gemini API integration
- **pdf-parse**: PDF text extraction
- **mammoth**: DOCX text extraction
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

1. **Home Page**: Upload your resume (PDF or DOCX) and paste a job description
2. **Analyze**: Click "Analyze Resume" to start the AI analysis
3. **Results**: View the 5-tab dashboard with:
   - Overview: Overall score, section scores, matched/missing skills
   - ATS Check: ATS compatibility, detected sections, keyword density
   - Rewrite Suggestions: Improved bullet points with reasons
   - Gap Roadmap: Missing skills with learning resources
   - Cover Letter: AI-generated cover letter
4. **History**: View past analyses from the History page

## 🔐 Environment Variables

Required environment variable (in `backend-node/.env`):
```
GOOGLE_API_KEY=your_google_api_key_here
PORT=8000
```

## 🐛 Troubleshooting

### Backend Issues
- Ensure GOOGLE_API_KEY is set correctly in backend-node/.env
- Check that all Node.js dependencies are installed (npm install)
- Verify the backend is running on port 8000

### Frontend Issues
- Clear browser cache if you see stale data
- Ensure the backend API is accessible
- Check browser console for errors

### File Upload Issues
- Ensure file is PDF or DOCX format
- Check file size (should be reasonable)
- Verify job description is at least 300 characters

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!
