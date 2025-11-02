import { body, param, query, validationResult } from 'express-validator';



export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const formattedErrors = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: formattedErrors
    });
  };
};


export const commonValidationRules = {
  id: param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ],
  email: body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  name: body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .trim()
    .escape(),
  url: (field) => body(field)
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL'),
  date: (field) => body(field)
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date in ISO format (YYYY-MM-DD)'),
  number: (field, { min, max } = {}) => body(field)
    .optional()
    .isNumeric()
    .withMessage(`${field} must be a number`)
    .custom(value => {
      if (min !== undefined && value < min) {
        throw new Error(`${field} must be at least ${min}`);
      }
      if (max !== undefined && value > max) {
        throw new Error(`${field} must be at most ${max}`);
      }
      return true;
    }),
  array: (field) => body(field)
    .optional()
    .isArray()
    .withMessage(`${field} must be an array`),
  boolean: (field) => body(field)
    .optional()
    .isBoolean()
    .withMessage(`${field} must be a boolean value`)
};


export const authValidationRules = {
  studentSignup: [
    commonValidationRules.name,
    commonValidationRules.email,
    commonValidationRules.password,
    body('branch')
      .isLength({ min: 2, max: 50 })
      .withMessage('Branch must be between 2 and 50 characters')
      .trim()
      .escape(),
    body('year')
      .optional()
      .isInt({ min: 1, max: 6 })
      .withMessage('Year must be between 1 and 6'),
    body('cgpa')
      .optional()
      .isFloat({ min: 0, max: 10 })
      .withMessage('CGPA must be between 0 and 10')
  ],
  recruiterSignup: [
    commonValidationRules.name,
    commonValidationRules.email,
    commonValidationRules.password,
    body('companyName')
      .isLength({ min: 2, max: 100 })
      .withMessage('Company name must be between 2 and 100 characters')
      .trim()
      .escape(),
    commonValidationRules.url('companyWebsite'),
    body('industry')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Industry must be between 2 and 50 characters')
      .trim()
      .escape()
  ],
  login: [
    commonValidationRules.email,
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  requestPasswordReset: [
    commonValidationRules.email
  ],
  resetPassword: [
    commonValidationRules.password,
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
    body('token')
      .notEmpty()
      .withMessage('Reset token is required')
  ]
};



export const jobValidationRules = {
  createJob: [
    body('title')
      .isLength({ min: 5, max: 100 })
      .withMessage('Title must be between 5 and 100 characters')
      .trim()
      .escape(),
    body('description')
      .isLength({ min: 20, max: 2000 })
      .withMessage('Description must be between 20 and 2000 characters')
      .trim(),
    body('skillsRequired')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Skills required must be less than 500 characters')
      .trim(),
    body('eligibility')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Eligibility must be less than 500 characters')
      .trim(),
    body('salaryPackage')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Salary package must be a positive number'),
    body('applicationDeadline')
      .optional()
      .isISO8601()
      .withMessage('Application deadline must be a valid date')
  ],
  updateJob: [
    body('title')
      .optional()
      .isLength({ min: 5, max: 100 })
      .withMessage('Title must be between 5 and 100 characters')
      .trim()
      .escape(),
    body('description')
      .optional()
      .isLength({ min: 20, max: 2000 })
      .withMessage('Description must be between 20 and 2000 characters')
      .trim(),
    body('skillsRequired')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Skills required must be less than 500 characters')
      .trim(),
    body('eligibility')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Eligibility must be less than 500 characters')
      .trim(),
    body('salaryPackage')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Salary package must be a positive number'),
    body('applicationDeadline')
      .optional()
      .isISO8601()
      .withMessage('Application deadline must be a valid date'),
    body('status')
      .optional()
      .isIn(['open', 'closed', 'draft'])
      .withMessage('Status must be one of: open, closed, draft')
  ]
};



export const applicationValidationRules = {
  createApplication: [
    body('jobId')
      .isMongoId()
      .withMessage('Invalid job ID format'),
    body('studentId')
      .isMongoId()
      .withMessage('Invalid student ID format')
  ],
  updateApplication: [
    body('status')
      .isIn(['applied', 'shortlisted', 'interviewed', 'rejected', 'offered', 'accepted'])
      .withMessage('Status must be one of: applied, shortlisted, interviewed, rejected, offered, accepted')
  ]
};



export const resourceValidationRules = {
  createResource: [
    body('title')
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters')
      .trim()
      .escape(),
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters')
      .trim(),
    body('type')
      .isIn(['pdf', 'video', 'link', 'image', 'document', 'other'])
      .withMessage('Type must be one of: pdf, video, link, image, document, other'),
    body('link')
      .isURL()
      .withMessage('Link must be a valid URL'),
    body('categoryId')
      .isMongoId()
      .withMessage('Invalid category ID format'),
    body('accessLevel')
      .optional()
      .isIn(['public', 'student', 'recruiter', 'admin'])
      .withMessage('Access level must be one of: public, student, recruiter, admin'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array')
  ]
};


export const profileValidationRules = {
  updateStudentProfile: [
    body('name')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .trim()
      .escape(),
    body('branch')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Branch must be between 2 and 50 characters')
      .trim()
      .escape(),
    body('year')
      .optional()
      .isInt({ min: 1, max: 6 })
      .withMessage('Year must be between 1 and 6'),
    body('cgpa')
      .optional()
      .isFloat({ min: 0, max: 10 })
      .withMessage('CGPA must be between 0 and 10'),
    body('interestAreas')
      .optional()
      .isArray()
      .withMessage('Interest areas must be an array')
  ],
  updateRecruiterProfile: [
    body('name')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .trim()
      .escape(),
    body('companyName')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Company name must be between 2 and 100 characters')
      .trim()
      .escape(),
    commonValidationRules.url('companyWebsite'),
    body('industry')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Industry must be between 2 and 50 characters')
      .trim()
      .escape(),
    body('role')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Role must be between 2 and 50 characters')
      .trim()
      .escape()
  ]
};