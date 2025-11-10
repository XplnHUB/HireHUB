import { PrismaClient } from '@prisma/client';
import { createSearchQuery, formatSearchResults } from '../utils/searchUtils.js';


const prisma = new PrismaClient();


const searchCandidates = async (req, res) => {
  try {
    const {
      branch,
      minCgpa,
      maxCgpa,
      skills = [],
      codingPlatforms = [],
      page = 1,
      limit = 10
    } = req.query;
    const skip = (page - 1) * limit;
    const where = {
      ...(branch && { branch: { equals: branch, mode: 'insensitive' } }),
      ...((minCgpa || maxCgpa) && {
        cgpa: {
          ...(minCgpa && { gte: parseFloat(minCgpa) }),
          ...(maxCgpa && { lte: parseFloat(maxCgpa) })
        }
      }),
      ...(skills.length > 0 && {
        skills: {
          some: {
            skill: {
              name: {
                in: Array.isArray(skills) ? skills : [skills],
                mode: 'insensitive'
              }
            }
          }
        }
      })
    };
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          skills: {
            include: {
              skill: true
            }
          },
          codingProfiles: {
            where: codingPlatforms.length > 0 ? {
              platformName: {
                in: Array.isArray(codingPlatforms) 
                  ? codingPlatforms 
                  : [codingPlatforms]
              }
            } : undefined
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: {
          cgpa: 'desc' 
        }
      }),
      prisma.student.count({ where })
    ]);
    const formattedStudents = students.map(student => ({
      id: student.id,
      name: student.name,
      email: student.email,
      branch: student.branch,
      cgpa: student.cgpa,
      skills: student.skills.map(s => s.skill.name),
      codingProfiles: student.codingProfiles.reduce((acc, profile) => ({
        ...acc,
        [profile.platformName.toLowerCase()]: {
          username: profile.username,
          rating: profile.rating,
          problemsSolved: profile.problemsSolved
        }
      }), {})
    }));
    res.json({
      success: true,
      count: formattedStudents.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: formattedStudents
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching candidates',
      error: error.message
    });
  }
};


const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.query;
    const applications = await prisma.application.findMany({
      where: {
        jobId,
        ...(status && { status })
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            branch: true,
            cgpa: true,
            resumeUrl: true,
            codingProfiles: true,
            skills: {
              include: {
                skill: true
              }
            }
          }
        },
        interviews: {
          orderBy: {
            interviewDate: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        appliedAt: 'desc'
      }
    });
    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};


const bulkUpdateApplications = async (req, res) => {
  try {
    const { applicationIds, status } = req.body;
    if (!Array.isArray(applicationIds) || applicationIds.length === 0 || !status) {
      return res.status(400).json({
        success: false,
        message: 'applicationIds array and status are required'
      });
    }
    const updated = await prisma.application.updateMany({
      where: {
        id: {
          in: applicationIds
        }
      },
      data: {
        status
      }
    });
    res.json({
      success: true,
      message: `Updated ${updated.count} applications to status: ${status}`,
      count: updated.count
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating applications',
      error: error.message
    });
  }
};



const compareCandidates = async (req, res) => {
  try {
    const { candidateIds } = req.body;
    if (!Array.isArray(candidateIds) || candidateIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least two candidate IDs are required for comparison'
      });
    }
    const candidates = await prisma.student.findMany({
      where: {
        id: {
          in: candidateIds
        }
      },
      include: {
        skills: {
          include: {
            skill: true
          }
        },
        codingProfiles: true,
        applications: {
          include: {
            job: true
          }
        }
      }
    });


    
    const comparison = candidates.map(candidate => ({
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      branch: candidate.branch,
      cgpa: candidate.cgpa,
      resumeUrl: candidate.resumeUrl,
      skills: candidate.skills.map(s => s.skill.name),
      codingProfiles: candidate.codingProfiles.reduce((acc, profile) => ({
        ...acc,
        [profile.platformName.toLowerCase()]: {
          username: profile.username,
          rating: profile.rating,
          problemsSolved: profile.problemsSolved
        }
      }), {}),
      applications: candidate.applications.map(app => ({
        jobId: app.jobId,
        jobTitle: app.job.title,
        status: app.status,
        appliedAt: app.appliedAt
      }))
    }));
    res.json({
      success: true,
      count: comparison.length,
      data: comparison
    });
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Error comparing candidates',
      error: error.message
    });
  }
};



const advancedSearch = async (req, res) => {
  try {
    const { entity, ...queryParams } = req.query;
    if (!entity) {
      return res.status(400).json({
        success: false,
        message: 'Entity type is required'
      });
    }
    const entityConfigs = {
      students: {
        model: 'student',
        searchFields: ['name', 'email', 'branch'],
        include: {
          skills: {
            include: {
              skill: true
            }
          },
          codingProfiles: true
        }
      },
      jobs: {
        model: 'job',
        searchFields: ['title', 'description', 'skillsRequired'],
        include: {
          recruiter: {
            select: {
              name: true,
              companyName: true
            }
          }
        }
      },
      recruiters: {
        model: 'recruiter',
        searchFields: ['name', 'email', 'companyName', 'industry'],
        select: {
          id: true,
          name: true,
          email: true,
          companyName: true,
          companyWebsite: true,
          industry: true,
          logoUrl: true,
          verificationStatus: true
        }
      },
      resources: {
        model: 'resource',
        searchFields: ['title', 'description', 'tags'],
        include: {
          category: true
        }
      },
      applications: {
        model: 'application',
        searchFields: [],
        include: {
          student: {
            select: {
              name: true,
              email: true
            }
          },
          job: {
            select: {
              title: true,
              recruiterId: true
            }
          }
        }
      }
    };
    const config = entityConfigs[entity];
    if (!config) {
      return res.status(400).json({
        success: false,
        message: `Unsupported entity type: ${entity}`
      });
    }
    const {
      page = 1,
      limit = 10,
      sort,
      search,
      ...filters
    } = queryParams;
    let sortBy = 'createdAt';
    let sortOrder = 'desc';
    if (sort) {
      const [field, order] = sort.split(':');
      sortBy = field || 'createdAt';
      sortOrder = order || 'desc';
    }
    let baseWhere = {};
    if (entity === 'jobs' && !filters.status) {
      baseWhere.status = 'open';
    }
    if (entity === 'resources' && req.user && req.user.role !== 'admin') {
      baseWhere.accessLevel = {
        in: ['public', req.user.role]
      };
    }
    if (entity === 'applications' && req.user && req.user.role === 'recruiter') {
      baseWhere.job = {
        recruiterId: req.user.id
      };
    }
    const query = createSearchQuery({
      page,
      limit,
      sortBy,
      sortOrder,
      searchTerm: search,
      searchFields: config.searchFields,
      filters,
      baseQuery: {
        where: baseWhere,
        ...(config.include && { include: config.include }),
        ...(config.select && { select: config.select })
      }
    });
    const [results, total] = await Promise.all([
      prisma[config.model].findMany(query),
      prisma[config.model].count({ where: query.where })
    ]);
    const formattedResults = formatSearchResults(results, total, page, limit);
    res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Error in advanced search:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing advanced search',
      error: error.message
    });
  }
};



const fullTextSearch = async (req, res) => {
  try {
    const { query, entities = ['jobs', 'students', 'resources'], page = 1, limit = 5 } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    const results = {};
    const searchPromises = [];
    const validEntities = ['jobs', 'students', 'recruiters', 'resources'];
    const entitiesToSearch = Array.isArray(entities) 
      ? entities.filter(e => validEntities.includes(e)) 
      : [entities].filter(e => validEntities.includes(e));
    if (entitiesToSearch.includes('jobs')) {
      searchPromises.push(
        prisma.job.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { skillsRequired: { contains: query, mode: 'insensitive' } }
            ],
            status: 'open'
          },
          include: {
            recruiter: {
              select: {
                name: true,
                companyName: true
              }
            }
          },
          take: parseInt(limit)
        }).then(data => {
          results.jobs = data;
        })
      );
    }
    if (entitiesToSearch.includes('students')) {
      searchPromises.push(
        prisma.student.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { branch: { contains: query, mode: 'insensitive' } }
            ]
          },
          include: {
            skills: {
              include: {
                skill: true
              }
            }
          },
          take: parseInt(limit)
        }).then(data => {
          results.students = data.map(student => ({
            id: student.id,
            name: student.name,
            branch: student.branch,
            cgpa: student.cgpa,
            skills: student.skills.map(s => s.skill.name)
          }));
        })
      );
    }
    if (entitiesToSearch.includes('recruiters')) {
      searchPromises.push(
        prisma.recruiter.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { companyName: { contains: query, mode: 'insensitive' } },
              { industry: { contains: query, mode: 'insensitive' } }
            ]
          },
          select: {
            id: true,
            name: true,
            companyName: true,
            industry: true,
            logoUrl: true
          },
          take: parseInt(limit)
        }).then(data => {
          results.recruiters = data;
        })
      );
    }
    if (entitiesToSearch.includes('resources')) {
      const resourceWhere = {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } }
        ]
      };
      if (req.user && req.user.role !== 'admin') {
        resourceWhere.accessLevel = {
          in: ['public', req.user.role]
        };
      }
      searchPromises.push(
        prisma.resource.findMany({
          where: resourceWhere,
          include: {
            category: true
          },
          take: parseInt(limit)
        }).then(data => {
          results.resources = data;
        })
      );
    }
    await Promise.all(searchPromises);
    res.status(200).json({
      success: true,
      query,
      results
    });
  } catch (error) {
    console.error('Error in full-text search:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing full-text search',
      error: error.message
    });
  }
};
export {
  searchCandidates,
  getApplicationsByJob,
  bulkUpdateApplications,
  compareCandidates,
  advancedSearch,
  fullTextSearch
};
