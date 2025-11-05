import axios from 'axios';
import * as cheerio from 'cheerio';
const CODECHEF_PROFILE_BASE = 'https://www.codechef.com/users';
const CODECHEF_API_BASE = 'https://www.codechef.com/api';
export const getCodeChefProfile = async (username) => {
  try {
    const response = await axios.get(`${CODECHEF_PROFILE_BASE}/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    const fullName = $('.h2-style').first().text().trim();
    const country = $('.user-country-name').text().trim();
    const currentRating = $('.rating-number').first().text().trim();
    const highestRating = $('.rating-number').eq(1).text().trim();
    const globalRank = $('.rating-ranks strong').first().text().trim();
    const countryRank = $('.rating-ranks strong').eq(1).text().trim();
    const stars = $('.rating-star i').length;
    const contestStats = {
      longChallenge: parseInt($('.contest-participated-count b').eq(0).text()) || 0,
      cookOff: parseInt($('.contest-participated-count b').eq(1).text()) || 0,
      lunchTime: parseInt($('.contest-participated-count b').eq(2).text()) || 0
    };
    const problemsSolved = {
      total: parseInt($('.problems-solved h5').text().match(/\d+/)?.[0]) || 0,
      partialSolved: parseInt($('.problems-solved .content').eq(0).text().match(/\d+/)?.[0]) || 0,
      fullySolved: parseInt($('.problems-solved .content').eq(1).text().match(/\d+/)?.[0]) || 0
    };
    return {
      username,
      fullName: fullName || username,
      country,
      currentRating: parseInt(currentRating) || 0,
      highestRating: parseInt(highestRating) || 0,
      stars,
      globalRank: parseInt(globalRank.replace(/[^\d]/g, '')) || 0,
      countryRank: parseInt(countryRank.replace(/[^\d]/g, '')) || 0,
      contestStats,
      problemsSolved,
      profileUrl: `${CODECHEF_PROFILE_BASE}/${username}`
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('CodeChef user not found');
    }
    throw new Error(`CodeChef scraping error: ${error.message}`);
  }
};
export const getCodeChefRatingHistory = async (username) => {
  try {
    const response = await axios.get(
      `${CODECHEF_API_BASE}/ratings/all?handle=${username}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    if (response.data && response.data.data) {
      return response.data.data.map(contest => ({
        contestCode: contest.code,
        contestName: contest.name,
        rating: contest.rating,
        rank: contest.rank,
        date: contest.end_date
      }));
    }
    return [];
  } catch (error) {
    console.warn('CodeChef rating history unavailable:', error.message);
    return [];
  }
};
export const getCodeChefStats = async (username) => {
  try {
    const [profile, ratingHistory] = await Promise.all([
      getCodeChefProfile(username),
      getCodeChefRatingHistory(username).catch(() => [])
    ]);
    const totalContests = Object.values(profile.contestStats).reduce((a, b) => a + b, 0);
    const ratingChange = ratingHistory.length > 1
      ? profile.currentRating - ratingHistory[0].rating
      : 0;
    return {
      profile,
      ratingHistory: ratingHistory.slice(-10),
      summary: {
        currentRating: profile.currentRating,
        highestRating: profile.highestRating,
        stars: profile.stars,
        globalRank: profile.globalRank,
        countryRank: profile.countryRank,
        totalContests,
        problemsSolved: profile.problemsSolved.total,
        fullySolved: profile.problemsSolved.fullySolved,
        ratingChange
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch CodeChef stats: ${error.message}`);
  }
};
export const verifyCodeChefUsername = async (username) => {
  try {
    const response = await axios.get(`${CODECHEF_PROFILE_BASE}/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
export const getCodeChefRecentSubmissions = async (username) => {
  try {
    const response = await axios.get(
      `${CODECHEF_API_BASE}/submissions/?username=${username}&limit=20`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    if (response.data && response.data.data) {
      return response.data.data.map(sub => ({
        id: sub.id,
        problemCode: sub.problem_code,
        result: sub.result,
        language: sub.language,
        time: sub.time,
        date: sub.date
      }));
    }
    return [];
  } catch (error) {
    console.warn('CodeChef submissions unavailable:', error.message);
    return [];
  }
};
export const getCodeChefTier = (rating) => {
  if (rating >= 2500) return '7★ (Grandmaster)';
  if (rating >= 2200) return '6★ (Master)';
  if (rating >= 2000) return '5★ (Candidate Master)';
  if (rating >= 1800) return '4★ (Expert)';
  if (rating >= 1600) return '3★ (Specialist)';
  if (rating >= 1400) return '2★ (Pupil)';
  if (rating >= 1200) return '1★ (Novice)';
  return 'Unrated';
};
