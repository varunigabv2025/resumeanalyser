/**
 * Trust score API routes.
 * Defines the endpoint for calculating and retrieving trust scores.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { TrustScoreResponse } = require('../models');
const { calculateTrustScore } = require('../services/trustScore');

const router = express.Router();

// Path to fake users data
const dataFilePath = path.join(__dirname, '../data/fake_users.json');

/**
 * Load users from fake_users.json file.
 * @returns {Object} Dictionary mapping usernames to user data
 */
function loadUsers() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const users = JSON.parse(data);
    // Create a dictionary with username as key for easy lookup
    const userDict = {};
    users.forEach(user => {
      userDict[user.name.toLowerCase()] = user;
    });
    return userDict;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('User data file not found');
    } else if (error instanceof SyntaxError) {
      throw new Error('Invalid user data format');
    }
    throw error;
  }
}

/**
 * GET /trust/:username
 * Get trust score for a given username.
 */
router.get('/trust/:username', (req, res) => {
  try {
    const { username } = req.params;
    
    // Load users from JSON file
    const users = loadUsers();
    
    // Look up user (case-insensitive)
    const usernameLower = username.toLowerCase();
    if (!(usernameLower in users)) {
      return res.status(404).json({ detail: `User '${username}' not found` });
    }
    
    const user = users[usernameLower];
    
    // Calculate trust score
    const result = calculateTrustScore(user.resume_skills, user.github_skills);
    
    // Return response
    const response = new TrustScoreResponse(
      user.name,
      result.trustScore,
      result.matchingEnabled,
      result.status,
      result.verifiedSkills,
      result.missingSkills,
      result.extraGithubSkills
    );
    
    res.json(response);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;
