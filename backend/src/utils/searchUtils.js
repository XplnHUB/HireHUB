export const applyPagination = (query, page = 1, limit = 10) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  return {
    ...query,
    skip,
    take: parseInt(limit)
  };
};
export const applySorting = (query, sortBy = 'createdAt', sortOrder = 'desc') => {
  const validSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc';
  return {
    ...query,
    orderBy: {
      [sortBy]: validSortOrder
    }
  };
};
export const applyFullTextSearch = (query, searchTerm, searchFields) => {
  if (!searchTerm || !searchFields || searchFields.length === 0) {
    return query;
  }
  const searchConditions = searchFields.map(field => ({
    [field]: {
      contains: searchTerm,
      mode: 'insensitive'
    }
  }));
  return {
    ...query,
    where: {
      ...query.where,
      OR: searchConditions
    }
  };
};
export const applyFilters = (query, filters) => {
  if (!filters || Object.keys(filters).length === 0) {
    return query;
  }
  const where = { ...query.where };
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        if (value.min !== undefined || value.max !== undefined) {
          where[key] = {};
          if (value.min !== undefined) where[key].gte = value.min;
          if (value.max !== undefined) where[key].lte = value.max;
        }
        else if (value.startDate !== undefined || value.endDate !== undefined) {
          where[key] = {};
          if (value.startDate) where[key].gte = new Date(value.startDate);
          if (value.endDate) where[key].lte = new Date(value.endDate);
        }
        else {
          where[key] = value;
        }
      }
      else if (Array.isArray(value) && value.length > 0) {
        where[key] = {
          hasSome: value
        };
      }
      else if (typeof value === 'boolean') {
        where[key] = value;
      }
      else if (typeof value === 'string' && value.includes(':')) {
        const [operator, operand] = value.split(':');
        switch (operator) {
          case 'eq':
            where[key] = operand;
            break;
          case 'neq':
            where[key] = { not: operand };
            break;
          case 'gt':
            where[key] = { gt: parseFloat(operand) };
            break;
          case 'gte':
            where[key] = { gte: parseFloat(operand) };
            break;
          case 'lt':
            where[key] = { lt: parseFloat(operand) };
            break;
          case 'lte':
            where[key] = { lte: parseFloat(operand) };
            break;
          case 'contains':
            where[key] = { contains: operand, mode: 'insensitive' };
            break;
          case 'startsWith':
            where[key] = { startsWith: operand, mode: 'insensitive' };
            break;
          case 'endsWith':
            where[key] = { endsWith: operand, mode: 'insensitive' };
            break;
          default:
            where[key] = value;
        }
      }
      else {
        where[key] = value;
      }
    }
  });
  return {
    ...query,
    where
  };
};
export const createSearchQuery = (options) => {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    searchTerm,
    searchFields,
    filters,
    baseQuery = {}
  } = options;
  let query = { ...baseQuery };
  if (filters) {
    query = applyFilters(query, filters);
  }
  if (searchTerm && searchFields) {
    query = applyFullTextSearch(query, searchTerm, searchFields);
  }
  if (sortBy) {
    query = applySorting(query, sortBy, sortOrder);
  }
  if (page) {
    query = applyPagination(query, page, limit);
  }
  return query;
};
export const formatSearchResults = (results, total, page = 1, limit = 10) => {
  return {
    success: true,
    count: results.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: results
  };
};
