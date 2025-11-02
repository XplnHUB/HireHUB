import { PrismaClient } from '@prisma/client';
import * as githubService from '../services/githubService.js';
import * as leetcodeService from '../services/leetcodeService.js';
import * as codeforcesService from '../services/codeforcesService.js';
import * as codechefService from '../services/codechefService.js';
import * as linkedinService from '../services/linkedinService.js';


const prisma = new PrismaClient();


const getStudentId = (paramId) => {
  return paramId.startsWith(':') ? paramId.substring(1) : paramId;
};


export const syncGitHubProfile = async (req, res) => {
  try {
    const studentId = getStudentId(req.params.studentId);
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'GitHub username is required' });
    }
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const githubData = await githubService.getGitHubProfile(username);
    await prisma.codingProfile.upsert({
      where: {
        studentId_platformName: {
          studentId,
          platformName: 'GitHub'
        }
      },
      update: {
        username: githubData.login,
        profileUrl: githubData.html_url,
        metadata: JSON.stringify({
          publicRepos: githubData.public_repos,
          followers: githubData.followers,
          following: githubData.following,
          createdAt: githubData.created_at
        })
      },
      create: {
        studentId,
        platformName: 'GitHub',
        username: githubData.login,
        profileUrl: githubData.html_url,
        metadata: JSON.stringify({
          publicRepos: githubData.public_repos,
          followers: githubData.followers,
          following: githubData.following,
          createdAt: githubData.created_at
        })
      }
    });
    res.status(200).json({
      message: 'GitHub profile synced successfully',
      data: githubData
    });
  } catch (error) {
    console.error('Error syncing GitHub profile:', error);
    res.status(500).json({
      message: 'Failed to sync GitHub profile',
      error: error.message
    });
  }
};


export const syncLeetCodeProfile = async (req, res) => {
  try {
    const studentId = getStudentId(req.params.studentId);
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'LeetCode username is required' });
    }
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const leetcodeData = await leetcodeService.getLeetCodeProfile(username);
    await prisma.codingProfile.upsert({
      where: {
        studentId_platformName: {
          studentId,
          platformName: 'LeetCode'
        }
      },
      update: {
        username: leetcodeData.username,
        profileUrl: `https://leetcode.com/${leetcodeData.username}`,
        rating: leetcodeData.rating || 0,
        problemsSolved: leetcodeData.problemsSolved || 0,
        metadata: JSON.stringify(leetcodeData)
      },
      create: {
        studentId,
        platformName: 'LeetCode',
        username: leetcodeData.username,
        profileUrl: `https://leetcode.com/${leetcodeData.username}`,
        rating: leetcodeData.rating || 0,
        problemsSolved: leetcodeData.problemsSolved || 0,
        metadata: JSON.stringify(leetcodeData)
      }
    });
    res.status(200).json({
      message: 'LeetCode profile synced successfully',
      data: leetcodeData
    });
  } catch (error) {
    console.error('Error syncing LeetCode profile:', error);
    res.status(500).json({
      message: 'Failed to sync LeetCode profile',
      error: error.message
    });
  }
};


export const syncCodeforcesProfile = async (req, res) => {
  try {
    const studentId = getStudentId(req.params.studentId);
    const { handle } = req.body;
    if (!handle) {
      return res.status(400).json({ message: 'Codeforces handle is required' });
    }
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const codeforcesData = await codeforcesService.getCodeforcesStats(handle);
    await prisma.codingProfile.upsert({
      where: {
        studentId_platformName: {
          studentId,
          platformName: 'Codeforces'
        }
      },
      update: {
        username: handle,
        profileUrl: `https://codeforces.com/profile/${handle}`,
        rating: codeforcesData.profile.rating || 0,
        problemsSolved: codeforcesData.submissions?.uniqueProblemsSolved || 0,
        metadata: JSON.stringify(codeforcesData)
      },
      create: {
        studentId,
        platformName: 'Codeforces',
        username: handle,
        profileUrl: `https://codeforces.com/profile/${handle}`,
        rating: codeforcesData.profile.rating || 0,
        problemsSolved: codeforcesData.submissions?.uniqueProblemsSolved || 0,
        metadata: JSON.stringify(codeforcesData)
      }
    });
    res.status(200).json({
      message: 'Codeforces profile synced successfully',
      data: codeforcesData
    });
  } catch (error) {
    console.error('Error syncing Codeforces profile:', error);
    res.status(500).json({
      message: 'Failed to sync Codeforces profile',
      error: error.message
    });
  }
};


export const syncCodeChefProfile = async (req, res) => {
  try {
    const studentId = getStudentId(req.params.studentId);
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'CodeChef username is required' });
    }
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const codechefData = await codechefService.getCodeChefStats(username);
    await prisma.codingProfile.upsert({
      where: {
        studentId_platformName: {
          studentId,
          platformName: 'CodeChef'
        }
      },
      update: {
        username,
        profileUrl: `https://www.codechef.com/users/${username}`,
        rating: codechefData.profile.currentRating || 0,
        problemsSolved: codechefData.profile.problemsSolved || 0,
        metadata: JSON.stringify(codechefData)
      },
      create: {
        studentId,
        platformName: 'CodeChef',
        username,
        profileUrl: `https://www.codechef.com/users/${username}`,
        rating: codechefData.profile.currentRating || 0,
        problemsSolved: codechefData.profile.problemsSolved || 0,
        metadata: JSON.stringify(codechefData)
      }
    });
    res.status(200).json({
      message: 'CodeChef profile synced successfully',
      data: codechefData
    });
  } catch (error) {
    console.error('Error syncing CodeChef profile:', error);
    res.status(500).json({
      message: 'Failed to sync CodeChef profile',
      error: error.message
    });
  }
};


export const linkLinkedInProfile = async (req, res) => {
  try {
    const studentId = getStudentId(req.params.studentId);
    const { profileUrl } = req.body;
    if (!profileUrl) {
      return res.status(400).json({ message: 'LinkedIn profile URL is required' });
    }
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const validation = linkedinService.verifyLinkedInUrl(profileUrl);
    if (!validation.isValid) {
      return res.status(400).json({ message: 'Invalid LinkedIn profile URL' });
    }
    await prisma.codingProfile.upsert({
      where: {
        studentId_platformName: {
          studentId,
          platformName: 'LinkedIn'
        }
      },
      update: {
        username: validation.username,
        profileUrl: validation.fullUrl,
        metadata: JSON.stringify({
          lastSynced: new Date().toISOString()
        })
      },
      create: {
        studentId,
        platformName: 'LinkedIn',
        username: validation.username,
        profileUrl: validation.fullUrl,
        metadata: JSON.stringify({
          lastSynced: new Date().toISOString()
        })
      }
    });
    res.status(200).json({
      message: 'LinkedIn profile linked successfully',
      data: validation
    });
  } catch (error) {
    console.error('Error linking LinkedIn profile:', error);
    res.status(500).json({
      message: 'Failed to link LinkedIn profile',
      error: error.message
    });
  }
};



export const getStudentIntegrations = async (req, res) => {
  try {
    const studentId = getStudentId(req.params.studentId);
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        codingProfiles: true
      }
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({
      message: 'Student integrations retrieved successfully',
      data: student.codingProfiles
    });
  } catch (error) {
    console.error('Error getting student integrations:', error);
    res.status(500).json({
      message: 'Failed to get student integrations',
      error: error.message
    });
  }
};


export const syncAllPlatforms = async (req, res) => {
  try {
    const studentId = getStudentId(req.params.studentId);
    const { 
      githubUsername, 
      leetcodeUsername, 
      codeforcesHandle, 
      codechefUsername, 
      linkedinUrl 
    } = req.body;
    if (!githubUsername && !leetcodeUsername && !codeforcesHandle && !codechefUsername && !linkedinUrl) {
      return res.status(400).json({ 
        message: 'At least one platform username/handle is required' 
      });
    }
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const results = {};
    const errors = [];
    if (githubUsername) {
      try {
        const githubData = await githubService.getGitHubProfile(githubUsername);
        await prisma.codingProfile.upsert({
          where: {
            studentId_platformName: {
              studentId,
              platformName: 'GitHub'
            }
          },
          update: {
            username: githubData.login,
            profileUrl: githubData.html_url,
            metadata: JSON.stringify({
              publicRepos: githubData.public_repos,
              followers: githubData.followers,
              following: githubData.following,
              createdAt: githubData.created_at
            })
          },
          create: {
            studentId,
            platformName: 'GitHub',
            username: githubData.login,
            profileUrl: githubData.html_url,
            metadata: JSON.stringify({
              publicRepos: githubData.public_repos,
              followers: githubData.followers,
              following: githubData.following,
              createdAt: githubData.created_at
            })
          }
        });
        results.github = { success: true, data: githubData };
      } catch (error) {
        console.error('Error syncing GitHub:', error);
        errors.push({ platform: 'GitHub', error: error.message });
      }
    }
    if (leetcodeUsername) {
      try {
        const leetcodeData = await leetcodeService.getLeetCodeProfile(leetcodeUsername);
        await prisma.codingProfile.upsert({
          where: {
            studentId_platformName: {
              studentId,
              platformName: 'LeetCode'
            }
          },
          update: {
            username: leetcodeData.username,
            profileUrl: `https://leetcode.com/${leetcodeData.username}`,
            rating: leetcodeData.rating || 0,
            problemsSolved: leetcodeData.problemsSolved || 0,
            metadata: JSON.stringify(leetcodeData)
          },
          create: {
            studentId,
            platformName: 'LeetCode',
            username: leetcodeData.username,
            profileUrl: `https://leetcode.com/${leetcodeData.username}`,
            rating: leetcodeData.rating || 0,
            problemsSolved: leetcodeData.problemsSolved || 0,
            metadata: JSON.stringify(leetcodeData)
          }
        });
        results.leetcode = { success: true, data: leetcodeData };
      } catch (error) {
        console.error('Error syncing LeetCode:', error);
        errors.push({ platform: 'LeetCode', error: error.message });
      }
    }
    if (codeforcesHandle) {
      try {
        const codeforcesData = await codeforcesService.getCodeforcesStats(codeforcesHandle);
        await prisma.codingProfile.upsert({
          where: {
            studentId_platformName: {
              studentId,
              platformName: 'Codeforces'
            }
          },
          update: {
            username: codeforcesHandle,
            profileUrl: `https://codeforces.com/profile/${codeforcesHandle}`,
            rating: codeforcesData.profile.rating || 0,
            problemsSolved: codeforcesData.submissions?.uniqueProblemsSolved || 0,
            metadata: JSON.stringify(codeforcesData)
          },
          create: {
            studentId,
            platformName: 'Codeforces',
            username: codeforcesHandle,
            profileUrl: `https://codeforces.com/profile/${codeforcesHandle}`,
            rating: codeforcesData.profile.rating || 0,
            problemsSolved: codeforcesData.submissions?.uniqueProblemsSolved || 0,
            metadata: JSON.stringify(codeforcesData)
          }
        });
        results.codeforces = { success: true, data: codeforcesData };
      } catch (error) {
        console.error('Error syncing Codeforces:', error);
        errors.push({ platform: 'Codeforces', error: error.message });
      }
    }
    if (codechefUsername) {
      try {
        const codechefData = await codechefService.getCodeChefStats(codechefUsername);
        await prisma.codingProfile.upsert({
          where: {
            studentId_platformName: {
              studentId,
              platformName: 'CodeChef'
            }
          },
          update: {
            username: codechefUsername,
            profileUrl: `https://www.codechef.com/users/${codechefUsername}`,
            rating: codechefData.profile.currentRating || 0,
            problemsSolved: codechefData.profile.problemsSolved || 0,
            metadata: JSON.stringify(codechefData)
          },
          create: {
            studentId,
            platformName: 'CodeChef',
            username: codechefUsername,
            profileUrl: `https://www.codechef.com/users/${codechefUsername}`,
            rating: codechefData.profile.currentRating || 0,
            problemsSolved: codechefData.profile.problemsSolved || 0,
            metadata: JSON.stringify(codechefData)
          }
        });
        results.codechef = { success: true, data: codechefData };
      } catch (error) {
        console.error('Error syncing CodeChef:', error);
        errors.push({ platform: 'CodeChef', error: error.message });
      }
    }
    if (linkedinUrl) {
      try {
        const validation = linkedinService.verifyLinkedInUrl(linkedinUrl);
        if (!validation.isValid) {
          throw new Error('Invalid LinkedIn profile URL');
        }
        await prisma.codingProfile.upsert({
          where: {
            studentId_platformName: {
              studentId,
              platformName: 'LinkedIn'
            }
          },
          update: {
            username: validation.username,
            profileUrl: validation.fullUrl,
            metadata: JSON.stringify({
              lastSynced: new Date().toISOString()
            })
          },
          create: {
            studentId,
            platformName: 'LinkedIn',
            username: validation.username,
            profileUrl: validation.fullUrl,
            metadata: JSON.stringify({
              lastSynced: new Date().toISOString()
            })
          }
        });
        results.linkedin = { success: true, data: validation };
      } catch (error) {
        console.error('Error syncing LinkedIn:', error);
        errors.push({ platform: 'LinkedIn', error: error.message });
      }
    }
    if (errors.length > 0) {
      return res.status(207).json({
        message: 'Some platforms failed to sync',
        results,
        errors
      });
    }
    res.status(200).json({
      message: 'All platforms synced successfully',
      results
    });
  } catch (error) {
    console.error('Error syncing all platforms:', error);
    res.status(500).json({
      message: 'Failed to sync platforms',
      error: error.message
    });
  }
};



export const deleteIntegration = async (req, res) => {
  try {
    const studentId = getStudentId(req.params.studentId);
    const { platform } = req.params;
    if (!['GitHub', 'LeetCode', 'Codeforces', 'CodeChef', 'LinkedIn'].includes(platform)) {
      return res.status(400).json({ message: 'Invalid platform' });
    }
    await prisma.codingProfile.deleteMany({
      where: {
        studentId,
        platformName: platform
      }
    });
    res.status(200).json({
      message: `${platform} integration removed successfully`
    });
  } catch (error) {
    console.error(`Error deleting ${platform} integration:`, error);
    res.status(500).json({
      message: `Failed to remove ${platform} integration`,
      error: error.message
    });
  }
};
