import express from 'express';
import {
  createResourceCategory,
  getResourceCategories,
  getResourceCategory,
  updateResourceCategory,
  deleteResourceCategory
} from '../controllers/resourceCategoryController.js';
import { authenticate, authorizeRole } from '../utils/authMiddleware.js';
const router = express.Router();
router.get('/', getResourceCategories);
router.get('/:id', getResourceCategory);
router.use(authenticate);
router.use(authorizeRole('admin'));
router.post('/', createResourceCategory);
router.put('/:id', updateResourceCategory);
router.delete('/:id', deleteResourceCategory);
export default router;
