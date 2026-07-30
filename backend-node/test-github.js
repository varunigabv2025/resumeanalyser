require('dotenv').config();
const { analyzeGithubProfile } = require('./githubAnalyzer');

const username = process.argv[2] || 'torvalds';

(async () => {
  console.log(`Analyzing GitHub profile: ${username}`);
  const result = await analyzeGithubProfile(username);
  console.log(JSON.stringify(result, null, 2));
})();
