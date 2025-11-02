import { createSearchQuery, formatSearchResults } from '../utils/searchUtils.js';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


const advancedResults = (model, options = {}) => {
  return async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort,
        search,
        ...filters
      } = req.query;
      let sortBy = 'createdAt';
      let sortOrder = 'desc';
      if (sort) {
        const [field, order] = sort.split(':');
        sortBy = field || 'createdAt';
        sortOrder = order || 'desc';
      }
      const searchFields = options.searchFields || [];
      const query = createSearchQuery({
        page,
        limit,
        sortBy,
        sortOrder,
        searchTerm: search,
        searchFields,
        filters,
        baseQuery: {
          where: options.baseWhere || {}
        }
      });
      if (options.include) {
        query.include = options.include;
      }
      if (options.select) {
        query.select = options.select;
      }
      const [results, total] = await Promise.all([
        prisma[model].findMany(query),
        prisma[model].count({ where: query.where })
      ]);
      res.advancedResults = formatSearchResults(results, total, page, limit);
      next();
    } catch (error) {
      console.error(`Error in advancedResults middleware for ${model}:`, error);
      res.status(500).json({
        success: false,
        message: 'Error processing advanced results',
        error: error.message
      });
    }
  };
};

export default advancedResults;