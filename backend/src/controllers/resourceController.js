import { PrismaClient } from '@prisma/client';
import { uploadFile, deleteFile } from '../utils/fileUpload.js';

const prisma = new PrismaClient();

export const createResource = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      format,
      link,
      thumbnailUrl,
      fileSize,
      categoryId,
      accessLevel = 'public',
      tags = []
    } = req.body;
    if (!title || !type || !link || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Title, type, link, and categoryId are required'
      });
    }
    const category = await prisma.resourceCategory.findUnique({
      where: { id: categoryId }
    });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Resource category not found'
      });
    }
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        type,
        format,
        link,
        thumbnailUrl,
        fileSize,
        categoryId,
        createdBy: req.user.id,
        accessLevel,
        tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())
      }
    });
    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resource',
      error: error.message
    });
  }
};


export const getResources = async (req, res) => {
  try {
    const {
      categoryId,
      type,
      accessLevel,
      search,
      tags,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (type) {
      where.type = type;
    }
    if (accessLevel) {
      where.accessLevel = accessLevel;
    } else {
      if (!req.user) {
        where.accessLevel = 'public';
      }
      else if (req.user.role !== 'admin') {
        where.accessLevel = {
          in: ['public', req.user.role]
        };
      }
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      where.tags = {
        hasSome: tagArray
      };
    }
    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        }
      }),
      prisma.resource.count({ where })
    ]);
    res.status(200).json({
      success: true,
      count: resources.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: resources
    });
  } catch (error) {
    console.error('Error getting resources:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resources',
      error: error.message
    });
  }
};


export const getResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    if (resource.accessLevel !== 'public') {
      if (!req.user) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
      if (resource.accessLevel !== req.user.role && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }
    if (req.user) {
      try {
        await prisma.resourceAccess.upsert({
          where: {
            resource_user_access: {
              resourceId: id,
              userId: req.user.id,
              userType: req.user.role
            }
          },
          update: {
            accessedAt: new Date()
          },
          create: {
            resourceId: id,
            userId: req.user.id,
            userType: req.user.role
          }
        });
      } catch (error) {
        console.error('Error recording resource access:', error);
      }
    }
    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Error getting resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resource',
      error: error.message
    });
  }
};


export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type,
      format,
      link,
      thumbnailUrl,
      fileSize,
      categoryId,
      accessLevel,
      tags
    } = req.body;
    const existingResource = await prisma.resource.findUnique({
      where: { id }
    });
    if (!existingResource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    if (categoryId && categoryId !== existingResource.categoryId) {
      const category = await prisma.resourceCategory.findUnique({
        where: { id: categoryId }
      });
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Resource category not found'
        });
      }
    }
    let processedTags;
    if (tags) {
      processedTags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    }
    const updatedResource = await prisma.resource.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description !== undefined ? description : undefined,
        type: type || undefined,
        format: format !== undefined ? format : undefined,
        link: link || undefined,
        thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : undefined,
        fileSize: fileSize !== undefined ? parseInt(fileSize) : undefined,
        categoryId: categoryId || undefined,
        accessLevel: accessLevel || undefined,
        tags: processedTags || undefined
      }
    });
    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: updatedResource
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resource',
      error: error.message
    });
  }
};


export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const existingResource = await prisma.resource.findUnique({
      where: { id }
    });
    if (!existingResource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    await prisma.resourceAccess.deleteMany({
      where: { resourceId: id }
    });
    await prisma.resource.delete({
      where: { id }
    });
    if (existingResource.type === 'file' && existingResource.link.includes('cloudinary')) {
      try {
        const publicId = existingResource.link.split('/').pop().split('.')[0];
        await deleteFile(publicId, 'raw');
      } catch (error) {
        console.error('Error deleting file from storage:', error);
      }
    }
    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource',
      error: error.message
    });
  }
};


export const uploadResourceFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    const fileUrl = req.file.path || req.file.location || req.file.secure_url;
    const originalName = req.file.originalname;
    const fileSize = req.file.size;
    const format = originalName.split('.').pop();
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileUrl,
        originalName,
        fileSize,
        format
      }
    });
  } catch (error) {
    console.error('Error uploading resource file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
};


export const getResourceRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const recentAccesses = await prisma.resourceAccess.findMany({
      where: {
        userId,
        userType: userRole
      },
      orderBy: {
        accessedAt: 'desc'
      },
      take: 5,
      include: {
        resource: {
          include: {
            category: true
          }
        }
      }
    });
    const recentCategoryIds = recentAccesses.map(access => access.resource.categoryId);
    const recentTags = recentAccesses.flatMap(access => access.resource.tags || []);
    let recommendations = [];
    if (recentCategoryIds.length > 0 || recentTags.length > 0) {
      const where = {
        OR: []
      };
      if (recentCategoryIds.length > 0) {
        where.OR.push({
          categoryId: {
            in: recentCategoryIds
          }
        });
      }
      if (recentTags.length > 0) {
        where.OR.push({
          tags: {
            hasSome: recentTags
          }
        });
      }
      where.accessLevel = {
        in: ['public', userRole]
      };
      where.id = {
        notIn: recentAccesses.map(access => access.resource.id)
      };
      recommendations = await prisma.resource.findMany({
        where,
        take: 5,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }
    if (recommendations.length < 5) {
      const popularResourceIds = recommendations.map(resource => resource.id);
      const popularResources = await prisma.resourceAccess.groupBy({
        by: ['resourceId'],
        _count: {
          resourceId: true
        },
        orderBy: {
          _count: {
            resourceId: 'desc'
          }
        },
        take: 10
      });
      const popularResourceDetails = await prisma.resource.findMany({
        where: {
          id: {
            in: popularResources.map(r => r.resourceId),
            notIn: [...popularResourceIds, ...recentAccesses.map(access => access.resource.id)]
          },
          accessLevel: {
            in: ['public', userRole]
          }
        },
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        take: 5 - recommendations.length
      });
      recommendations = [...recommendations, ...popularResourceDetails];
    }
    if (recommendations.length < 5) {
      const existingResourceIds = [
        ...recommendations.map(resource => resource.id),
        ...recentAccesses.map(access => access.resource.id)
      ];
      const recentResources = await prisma.resource.findMany({
        where: {
          id: {
            notIn: existingResourceIds
          },
          accessLevel: {
            in: ['public', userRole]
          }
        },
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5 - recommendations.length
      });
      recommendations = [...recommendations, ...recentResources];
    }
    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    console.error('Error getting resource recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resource recommendations',
      error: error.message
    });
  }
};
