import { LeetCode } from 'leetcode-query';


const leetcode = new LeetCode();
const LEETCODE_PROFILE_BASE = 'https://leetcode.com';


export const getLeetCodeProfile = async (username) => {
  try {
    const user = await leetcode.user(username);
    if (!user || !user.matchedUser) {
      throw new Error('LeetCode user not found');
    }
    const { matchedUser } = user;
    const { profile, submitStats, userContestRanking } = matchedUser;
    const problemsSolved = {
      easy: submitStats?.acSubmissionNum?.find(s => s.difficulty === 'Easy')?.count || 0,
      medium: submitStats?.acSubmissionNum?.find(s => s.difficulty === 'Medium')?.count || 0,
      hard: submitStats?.acSubmissionNum?.find(s => s.difficulty === 'Hard')?.count || 0,
      total: submitStats?.acSubmissionNum?.find(s => s.difficulty === 'All')?.count || 0
    };
    const totalSubmissions = {
      easy: submitStats?.totalSubmissionNum?.find(s => s.difficulty === 'Easy')?.submissions || 0,
      medium: submitStats?.totalSubmissionNum?.find(s => s.difficulty === 'Medium')?.submissions || 0,
      hard: submitStats?.totalSubmissionNum?.find(s => s.difficulty === 'Hard')?.submissions || 0,
      total: submitStats?.totalSubmissionNum?.find(s => s.difficulty === 'All')?.submissions || 0
    };
    return {
      username: matchedUser.username,
      profile: {
        realName: profile?.realName,
        avatar: profile?.userAvatar,
        ranking: profile?.ranking,
        reputation: profile?.reputation,
        country: profile?.countryName,
        company: profile?.company,
        school: profile?.school,
        skillTags: profile?.skillTags || [],
        about: profile?.aboutMe,
        websites: profile?.websites || []
      },
      problemsSolved,
      totalSubmissions,
      acceptanceRate: totalSubmissions.total > 0 
        ? ((problemsSolved.total / totalSubmissions.total) * 100).toFixed(2)
        : 0,
      contestRanking: userContestRanking ? {
        rating: Math.round(userContestRanking.rating),
        globalRanking: userContestRanking.globalRanking,
        attendedContests: userContestRanking.attendedContestsCount,
        topPercentage: userContestRanking.topPercentage?.toFixed(2)
      } : null,
      profileUrl: `${LEETCODE_PROFILE_BASE}/${username}`
    };
  } catch (error) {
    if (error.message.includes('not found')) {
      throw new Error('LeetCode user not found');
    }
    throw new Error(`LeetCode API error: ${error.message}`);
  }
};



export const getLeetCodeRecentSubmissions = async (username, limit = 20) => {
  try {
    const user = await leetcode.user(username);
    const submissions = user.recentSubmissionList || [];
    return submissions.slice(0, limit).map(sub => ({
      title: sub.title,
      titleSlug: sub.titleSlug,
      timestamp: new Date(parseInt(sub.timestamp) * 1000).toISOString(),
      status: sub.statusDisplay,
      language: sub.lang,
      problemUrl: `${LEETCODE_PROFILE_BASE}/problems/${sub.titleSlug}`
    }));
  } catch (error) {
    throw new Error(`Failed to fetch recent submissions: ${error.message}`);
  }
};



export const getLeetCodeBadges = async (username) => {
  try {
    const user = await leetcode.user(username);
    return {
      badges: user.matchedUser?.badges || [],
      upcomingBadges: user.matchedUser?.upcomingBadges || []
    };
  } catch (error) {
    throw new Error(`Failed to fetch badges: ${error.message}`);
  }
};


export const verifyLeetCodeUsername = async (username) => {
  try {
    const user = await leetcode.user(username);
    return !!user?.matchedUser?.username;
  } catch (error) {
    return false;
  }
};


export const getLeetCodeStats = async (username) => {
  try {
    const [profile, recentSubmissions] = await Promise.all([
      getLeetCodeProfile(username),
      getLeetCodeRecentSubmissions(username, 10)
    ]);
    return {
      ...profile,
      recentSubmissions: recentSubmissions.slice(0, 5),
      lastActive: recentSubmissions.length > 0 
        ? recentSubmissions[0].timestamp 
        : null
    };
  } catch (error) {
    throw new Error(`Failed to fetch LeetCode stats: ${error.message}`);
  }
};