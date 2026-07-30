const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'resume_analyses.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initDb();
  }
});

function initDb() {
  db.run(`
    CREATE TABLE IF NOT EXISTS resume_analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      job_title TEXT,
      job_description TEXT,
      resume_text TEXT,
      overall_score REAL,
      section_scores TEXT,
      matched_skills TEXT,
      missing_skills TEXT,
      improvement_tips TEXT,
      keyword_gaps TEXT,
      summary TEXT,
      ats_score REAL,
      parsing_issues TEXT,
      detected_sections TEXT,
      missing_sections TEXT,
      keyword_density TEXT,
      formatting_warnings TEXT,
      ats_verdict TEXT,
      rewrites TEXT,
      readiness_percentage REAL,
      gap_summary TEXT,
      skill_gaps TEXT,
      milestones TEXT,
      subject_line TEXT,
      cover_letter TEXT,
      highlights_used TEXT,
      tone TEXT,
      trust_score TEXT,
      skill_swap TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    }
  });

  // Ensure new columns exist on existing databases
  db.run(`ALTER TABLE resume_analyses ADD COLUMN trust_score TEXT`, () => {});
  db.run(`ALTER TABLE resume_analyses ADD COLUMN skill_swap TEXT`, () => {});
}

module.exports = db;
