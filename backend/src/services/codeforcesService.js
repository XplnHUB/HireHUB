import axios from 'axios';
const CODEFORCES_API_BASE = 'https://codeforces.com/api';
const CODEFORCES_PROFILE_BASE = 'https://codeforces.com/profile';


export const getCodeforcesProfile = async (handle) => {
  try {
    const response = await axios.get(`${CODEFORCES_API_BASE}/user.info`, {
      params: { handles: handle }
    });
    if (response.data.status !== 'OK') {
      throw new Error('Codeforces user not found');
    }
    const user = response.data.result[0];
    return {
      handle: user.handle,
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      city: user.city,
      organization: user.organization,
      rank: user.rank,
      maxRank: user.maxRank,
      rating: user.rating,
      maxRating: user.maxRating,
      avatar: user.avatar ? `https:${user.avatar}` : null,
      titlePhoto: user.titlePhoto ? `https:${user.titlePhoto}` : null,
      friendOfCount: user.friendOfCount,
      contribution: user.contribution,
      registrationTime: new Date(user.registrationTimeSeconds * 1000).toISOString(),
      lastOnline: new Date(user.lastOnlineTimeSeconds * 1000).toISOString(),
      profileUrl: `${CODEFORCES_PROFILE_BASE}/${handle}`
    };
  } catch (error) {
    if (error.response?.data?.comment?.includes('not found')) {
      throw new Error('Codeforces user not found');
    }
    throw new Error(`Codeforces API error: ${error.message}`);
  }
};


export const getCodeforcesRatingHistory = async (handle) => {
  try {
    const response = await axios.get(`${CODEFORCES_API_BASE}/user.rating`, {
      params: { handle }
    });
    if (response.data.status !== 'OK') {
      throw new Error('Failed to fetch rating history');
    }
    return response.data.result.map(contest => ({
      contestId: contest.contestId,
      contestName: contest.contestName,
      rank: contest.rank,
      ratingUpdateTime: new Date(contest.ratingUpdateTimeSeconds * 1000).toISOString(),
      oldRating: contest.oldRating,
      newRating: contest.newRating,
      ratingChange: contest.newRating - contest.oldRating
    }));
  } catch (error) {
    throw new Error(`Failed to fetch rating history: ${error.message}`);
  }
};


export const getCodeforcesSubmissions = async (handle, count = 100) => {
  try {
    const response = await axios.get(`${CODEFORCES_API_BASE}/user.status`, {
      params: { handle, from: 1, count }
    });
    if (response.data.status !== 'OK') {
      throw new Error('Failed to fetch submissions');
    }
    const submissions = response.data.result;
    const acceptedSubmissions = submissions.filter(s => s.verdict === 'OK');
    const uniqueProblems = new Set(
      acceptedSubmissions.map(s => `${s.problem.contestId}-${s.problem.index}`)
    );
    const verdictCounts = submissions.reduce((acc, sub) => {
      acc[sub.verdict] = (acc[sub.verdict] || 0) + 1;
      return acc;
    }, {});
    const languageCounts = submissions.reduce((acc, sub) => {
      acc[sub.programmingLanguage] = (acc[sub.programmingLanguage] || 0) + 1;
      return acc;
    }, {});
    const ratingDistribution = acceptedSubmissions
      .filter(s => s.problem.rating)
      .reduce((acc, sub) => {
        const rating = Math.floor(sub.problem.rating / 100) * 100;
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {});
    return {
      totalSubmissions: submissions.length,
      acceptedSubmissions: acceptedSubmissions.length,
      uniqueProblemsSolved: uniqueProblems.size,
      verdictDistribution: verdictCounts,
      languageDistribution: languageCounts,
      ratingDistribution,
      recentSubmissions: submissions.slice(0, 10).map(s => ({
        id: s.id,
        contestId: s.contestId,
        problemName: s.problem.name,
        problemRating: s.problem.rating,
        verdict: s.verdict,
        language: s.programmingLanguage,
        submissionTime: new Date(s.creationTimeSeconds * 1000).toISOString()
      }))
    };
  } catch (error) {
    throw new Error(`Failed to fetch submissions: ${error.message}`);
  }
};


export const getCodeforcesStats = async (handle) => {
  try {
    const [profile, ratingHistory, submissions] = await Promise.all([
      getCodeforcesProfile(handle),
      getCodeforcesRatingHistory(handle).catch(() => []),
      getCodeforcesSubmissions(handle, 100)
    ]);
    const contestStats = {
      totalContests: ratingHistory.length,
      bestRank: ratingHistory.length > 0 
        ? Math.min(...ratingHistory.map(c => c.rank))
        : null,
      averageRank: ratingHistory.length > 0
        ? Math.round(ratingHistory.reduce((sum, c) => sum + c.rank, 0) / ratingHistory.length)
        : null,
      ratingChanges: {
        positive: ratingHistory.filter(c => c.ratingChange > 0).length,
        negative: ratingHistory.filter(c => c.ratingChange < 0).length,
        neutral: ratingHistory.filter(c => c.ratingChange === 0).length
      }
    };
    return {
      profile,
      contestStats,
      ratingHistory: ratingHistory.slice(-10),
      submissions,
      summary: {
        currentRating: profile.rating,
        maxRating: profile.maxRating,
        rank: profile.rank,
        maxRank: profile.maxRank,
        problemsSolved: submissions.uniqueProblemsSolved,
        contestsParticipated: ratingHistory.length
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch Codeforces stats: ${error.message}`);
  }
};



export const verifyCodeforcesHandle = async (handle) => {
  try {
    const response = await axios.get(`${CODEFORCES_API_BASE}/user.info`, {
      params: { handles: handle }
    });
    return response.data.status === 'OK';
  } catch (error) {
    return false;
  }
};


export const getCodeforcesProblemTags = async (handle) => {
  try {
    const response = await axios.get(`${CODEFORCES_API_BASE}/user.status`, {
      params: { handle, from: 1, count: 1000 }
    });
    if (response.data.status !== 'OK') {
      throw new Error('Failed to fetch problem tags');
    }
    const acceptedSubmissions = response.data.result.filter(s => s.verdict === 'OK');
    const problemTags = {};
    const seenProblems = new Set();
    acceptedSubmissions.forEach(sub => {
      const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
      if (!seenProblems.has(problemKey)) {
        seenProblems.add(problemKey);
        sub.problem.tags.forEach(tag => {
          problemTags[tag] = (problemTags[tag] || 0) + 1;
        });
      }
    });
    const sortedTags = Object.entries(problemTags)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
    return {
      totalTags: sortedTags.length,
      tags: sortedTags,
      topTags: sortedTags.slice(0, 10)
    };
  } catch (error) {
    throw new Error(`Failed to fetch problem tags: ${error.message}`);
  }
};
