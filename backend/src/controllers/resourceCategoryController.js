import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const createResourceCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }
    const existingCategory = await prisma.resourceCategory.findUnique({
      where: { name }
    });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    const category = await prisma.resourceCategory.create({
      data: {
        name,
        description
      }
    });
    res.status(201).json({
      success: true,
      message: 'Resource category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Error creating resource category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resource category',
      error: error.message
    });
  }
};
export const getResourceCategories = async (req, res) => {
  try {
    const categories = await prisma.resourceCategory.findMany({
      include: {
        _count: {
          select: {
            resources: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        resourceCount: category._count.resources,
        createdAt: category.createdAt
      }))
    });
  } catch (error) {
    console.error('Error getting resource categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resource categories',
      error: error.message
    });
  }
};
export const getResourceCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.resourceCategory.findUnique({
      where: { id },
      include: {
        resources: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            resources: true
          }
        }
      }
    });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Resource category not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
        resourceCount: category._count.resources,
        resources: category.resources,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }
    });
  } catch (error) {
    console.error('Error getting resource category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resource category',
      error: error.message
    });
  }
};
export const updateResourceCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const existingCategory = await prisma.resourceCategory.findUnique({
      where: { id }
    });
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Resource category not found'
      });
    }
    if (name && name !== existingCategory.name) {
      const nameExists = await prisma.resourceCategory.findUnique({
        where: { name }
      });
      if (nameExists) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }
    const updatedCategory = await prisma.resourceCategory.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined
      }
    });
    res.status(200).json({
      success: true,
      message: 'Resource category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error updating resource category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resource category',
      error: error.message
    });
  }
};
export const deleteResourceCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const existingCategory = await prisma.resourceCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            resources: true
          }
        }
      }
    });
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Resource category not found'
      });
    }
    if (existingCategory._count.resources > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with resources. Please delete or move resources first.'
      });
    }
    await prisma.resourceCategory.delete({
      where: { id }
    });
    res.status(200).json({
      success: true,
      message: 'Resource category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resource category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource category',
      error: error.message
    });
  }
};
