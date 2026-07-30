/**
 * Test Runner: Profile Merger Integration (SkillBridge AI)
 * 
 * Verifies profileMerger.js execution using both single mocks and sharedMockProfiles.js.
 * Validates output against the required 10-key Unified Profile schema.
 */

const resumeMock = require('../mocks/resumeMock');
const githubMock = require('../mocks/githubMock');
const sharedMockProfiles = require('../mocks/sharedMockProfiles');
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

  console.log(`\n2. Executing batch merge across ${sharedMockProfiles.length} shared mock profiles...`);
  let batchValidCount = 0;

  sharedMockProfiles.forEach((item, index) => {
    const merged = mergeProfile(item.resumeAnalysis, item.githubAnalysis);
    if (validateUnifiedProfileSchema(merged)) {
      batchValidCount++;
    } else {
      console.error(`❌ Batch Profile #${index + 1} (${item.resumeAnalysis.candidate_name}) failed validation.`);
    }
  });

  if (batchValidCount === sharedMockProfiles.length) {
    console.log(`✅ All ${batchValidCount}/${sharedMockProfiles.length} shared mock profiles PASSED schema validation!`);
  } else {
    console.error(`❌ Only ${batchValidCount}/${sharedMockProfiles.length} profiles passed validation.`);
    process.exit(1);
  }

  console.log("\n==================================================");
  console.log("  ALL SHARED MOCK DATASET TESTS PASSED            ");
  console.log("==================================================");
}

runTest();
