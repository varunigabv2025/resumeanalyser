/**
 * Test Runner: Profile Merger Integration (SkillBridge AI)
 * Validates output against the required Unified Profile schema.
 */

const resumeMock = require('../mocks/resumeMock');
const githubMock = require('../mocks/githubMock');
const { mergeProfile } = require('../services/profileMerger');
const { validateUnifiedProfileSchema } = require('../models/unifiedProfileSchema');

function runTest() {
  console.log("==================================================");
  console.log("  SkillBridge AI - Unified Profile Merge Test     ");
  console.log("==================================================\n");

  console.log("1. Executing single profile merge...");
  const singleProfile = mergeProfile(resumeMock, githubMock);
  const isSingleValid = validateUnifiedProfileSchema(singleProfile);

  if (isSingleValid) {
    console.log("✅ Single Profile Merge PASSED schema validation!");
  } else {
    console.error("❌ Single Profile Merge FAILED schema validation.");
    process.exit(1);
  }

  console.log("\n==================================================");
  console.log("  UNIFIED PROFILE MERGER TEST PASSED              ");
  console.log("==================================================");
}

runTest();
