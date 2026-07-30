/**
 * Unit tests for the Trust Score module.
 * Tests all helper functions and the main calculateTrustScore function.
 */

const {
  getVerifiedSkills,
  getMissingSkills,
  getExtraGithubSkills,
  calculatePercentage,
  determineStatus,
  isMatchingEnabled,
  calculateTrustScore
} = require('./services/trustScore');

describe('Trust Score Module', () => {
  
  describe('getVerifiedSkills', () => {
    test('should return all skills when all match', () => {
      const resume = ['Python', 'React', 'SQL'];
      const github = ['Python', 'React', 'SQL'];
      const result = getVerifiedSkills(resume, github);
      expect(result).toEqual(['Python', 'React', 'SQL']);
    });

    test('should return verified skills when partial match', () => {
      const resume = ['Python', 'React', 'SQL', 'Docker'];
      const github = ['Python', 'React', 'SQL'];
      const result = getVerifiedSkills(resume, github);
      expect(result).toEqual(['Python', 'React', 'SQL']);
    });

    test('should return empty array when no match', () => {
      const resume = ['Python', 'React'];
      const github = ['Java', 'Go'];
      const result = getVerifiedSkills(resume, github);
      expect(result).toEqual([]);
    });

    test('should be case-insensitive', () => {
      const resume = ['Python', 'REACT', 'sql'];
      const github = ['python', 'react', 'SQL'];
      const result = getVerifiedSkills(resume, github);
      expect(result).toEqual(['Python', 'REACT', 'sql']);
    });
  });

  describe('getMissingSkills', () => {
    test('should return missing skills', () => {
      const resume = ['Python', 'React', 'SQL', 'Docker'];
      const github = ['Python', 'React', 'SQL'];
      const result = getMissingSkills(resume, github);
      expect(result).toEqual(['Docker']);
    });

    test('should return empty array when all verified', () => {
      const resume = ['Python', 'React', 'SQL'];
      const github = ['Python', 'React', 'SQL'];
      const result = getMissingSkills(resume, github);
      expect(result).toEqual([]);
    });

    test('should return all skills when none verified', () => {
      const resume = ['Python', 'React'];
      const github = ['Java', 'Go'];
      const result = getMissingSkills(resume, github);
      expect(result).toEqual(['Python', 'React']);
    });
  });

  describe('getExtraGithubSkills', () => {
    test('should return extra GitHub skills', () => {
      const resume = ['Python', 'React'];
      const github = ['Python', 'React', 'SQL', 'Docker'];
      const result = getExtraGithubSkills(resume, github);
      expect(result).toEqual(['SQL', 'Docker']);
    });

    test('should return empty array when no extra skills', () => {
      const resume = ['Python', 'React', 'SQL'];
      const github = ['Python', 'React', 'SQL'];
      const result = getExtraGithubSkills(resume, github);
      expect(result).toEqual([]);
    });
  });

  describe('calculatePercentage', () => {
    test('should return 100 for full verification', () => {
      expect(calculatePercentage(4, 4)).toBe(100);
    });

    test('should return 75 for 3/4 verification', () => {
      expect(calculatePercentage(3, 4)).toBe(75);
    });

    test('should return 50 for half verification', () => {
      expect(calculatePercentage(2, 4)).toBe(50);
    });

    test('should return 25 for quarter verification', () => {
      expect(calculatePercentage(1, 4)).toBe(25);
    });

    test('should return 0 for no verification', () => {
      expect(calculatePercentage(0, 4)).toBe(0);
    });

    test('should return 0 for empty denominator', () => {
      expect(calculatePercentage(0, 0)).toBe(0);
    });
  });

  describe('determineStatus', () => {
    test('should return Verified for scores >= 50', () => {
      expect(determineStatus(100)).toBe('Verified');
      expect(determineStatus(90)).toBe('Verified');
      expect(determineStatus(75)).toBe('Verified');
      expect(determineStatus(50)).toBe('Verified');
    });

    test('should return Needs More Public Evidence for scores < 50', () => {
      expect(determineStatus(49)).toBe('Needs More Public Evidence');
      expect(determineStatus(25)).toBe('Needs More Public Evidence');
      expect(determineStatus(0)).toBe('Needs More Public Evidence');
    });
  });

  describe('isMatchingEnabled', () => {
    test('should return true for scores >= 50', () => {
      expect(isMatchingEnabled(50)).toBe(true);
      expect(isMatchingEnabled(75)).toBe(true);
      expect(isMatchingEnabled(100)).toBe(true);
    });

    test('should return false for scores < 50', () => {
      expect(isMatchingEnabled(49)).toBe(false);
      expect(isMatchingEnabled(25)).toBe(false);
      expect(isMatchingEnabled(0)).toBe(false);
    });
  });

  describe('calculateTrustScore', () => {
    test('should return 100% verification', () => {
      const resume = ['Python', 'React', 'SQL'];
      const github = ['Python', 'React', 'SQL'];
      const result = calculateTrustScore(resume, github);
      
      expect(result.trustScore).toBe(100);
      expect(result.verifiedSkills).toEqual(['Python', 'React', 'SQL']);
      expect(result.missingSkills).toEqual([]);
      expect(result.extraGithubSkills).toEqual([]);
      expect(result.matchingEnabled).toBe(true);
      expect(result.status).toBe('Verified');
    });

    test('should return 75% verification', () => {
      const resume = ['Python', 'React', 'SQL', 'Docker'];
      const github = ['Python', 'React', 'SQL'];
      const result = calculateTrustScore(resume, github);
      
      expect(result.trustScore).toBe(75);
      expect(result.verifiedSkills).toEqual(['Python', 'React', 'SQL']);
      expect(result.missingSkills).toEqual(['Docker']);
      expect(result.extraGithubSkills).toEqual([]);
      expect(result.matchingEnabled).toBe(true);
      expect(result.status).toBe('Verified');
    });

    test('should return 50% verification', () => {
      const resume = ['Python', 'React', 'SQL', 'Docker'];
      const github = ['Python', 'React'];
      const result = calculateTrustScore(resume, github);
      
      expect(result.trustScore).toBe(50);
      expect(result.verifiedSkills).toEqual(['Python', 'React']);
      expect(result.missingSkills).toEqual(['SQL', 'Docker']);
      expect(result.extraGithubSkills).toEqual([]);
      expect(result.matchingEnabled).toBe(true);
      expect(result.status).toBe('Verified');
    });

    test('should return 40% verification (below threshold)', () => {
      const resume = ['Python', 'React', 'SQL', 'Docker', 'Kubernetes'];
      const github = ['Python', 'React'];
      const result = calculateTrustScore(resume, github);
      
      expect(result.trustScore).toBe(40);
      expect(result.verifiedSkills).toEqual(['Python', 'React']);
      expect(result.missingSkills).toEqual(['SQL', 'Docker', 'Kubernetes']);
      expect(result.extraGithubSkills).toEqual([]);
      expect(result.matchingEnabled).toBe(false);
      expect(result.status).toBe('Needs More Public Evidence');
    });

    test('should return 25% verification', () => {
      const resume = ['Python', 'React', 'SQL', 'Docker'];
      const github = ['Python'];
      const result = calculateTrustScore(resume, github);
      
      expect(result.trustScore).toBe(25);
      expect(result.verifiedSkills).toEqual(['Python']);
      expect(result.missingSkills).toEqual(['React', 'SQL', 'Docker']);
      expect(result.extraGithubSkills).toEqual([]);
      expect(result.matchingEnabled).toBe(false);
      expect(result.status).toBe('Needs More Public Evidence');
    });

    test('should return 0% verification', () => {
      const resume = ['Python', 'React', 'SQL'];
      const github = ['Java', 'Go'];
      const result = calculateTrustScore(resume, github);
      
      expect(result.trustScore).toBe(0);
      expect(result.verifiedSkills).toEqual([]);
      expect(result.missingSkills).toEqual(['Python', 'React', 'SQL']);
      expect(result.extraGithubSkills).toEqual(['Java', 'Go']);
      expect(result.matchingEnabled).toBe(false);
      expect(result.status).toBe('Needs More Public Evidence');
    });

    test('should handle empty resume', () => {
      const resume = [];
      const github = ['Python', 'React'];
      const result = calculateTrustScore(resume, github);
      
      expect(result.trustScore).toBe(0);
      expect(result.verifiedSkills).toEqual([]);
      expect(result.missingSkills).toEqual([]);
      expect(result.extraGithubSkills).toEqual(['Python', 'React']);
      expect(result.matchingEnabled).toBe(false);
      expect(result.status).toBe('Needs More Public Evidence');
    });

    test('should handle empty GitHub', () => {
      const resume = ['Python', 'React', 'SQL'];
      const github = [];
      const result = calculateTrustScore(resume, github);
      
      expect(result.trustScore).toBe(0);
      expect(result.verifiedSkills).toEqual([]);
      expect(result.missingSkills).toEqual(['Python', 'React', 'SQL']);
      expect(result.extraGithubSkills).toEqual([]);
      expect(result.matchingEnabled).toBe(false);
      expect(result.status).toBe('Needs More Public Evidence');
    });

    test('should handle both empty', () => {
      const resume = [];
      const github = [];
      const result = calculateTrustScore(resume, github);
      
      expect(result.trustScore).toBe(0);
      expect(result.verifiedSkills).toEqual([]);
      expect(result.missingSkills).toEqual([]);
      expect(result.extraGithubSkills).toEqual([]);
      expect(result.matchingEnabled).toBe(false);
      expect(result.status).toBe('Needs More Public Evidence');
    });

    test('should handle extra GitHub skills', () => {
      const resume = ['Python', 'React'];
      const github = ['Python', 'React', 'SQL', 'Docker', 'Kubernetes'];
      const result = calculateTrustScore(resume, github);
      
      expect(result.trustScore).toBe(100);
      expect(result.verifiedSkills).toEqual(['Python', 'React']);
      expect(result.missingSkills).toEqual([]);
      expect(result.extraGithubSkills).toEqual(['SQL', 'Docker', 'Kubernetes']);
      expect(result.matchingEnabled).toBe(true);
      expect(result.status).toBe('Verified');
    });
  });
});
