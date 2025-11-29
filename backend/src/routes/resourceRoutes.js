import express from 'express';
import {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
  uploadResourceFile,
  getResourceRecommendations
} from '../controllers/resourceController.js';
import { authenticate, authorizeRole } from '../utils/authMiddleware.js';
import { uploadResource } from '../utils/fileUpload.js';
const router = express.Router();
router.get('/', getResources);
router.get('/:id', getResource);
router.use(authenticate);
router.get('/recommendations/list', getResourceRecommendations);
router.use(authorizeRole('admin'));
router.post('/', createResource);
router.post('/upload', uploadResource.single('file'), uploadResourceFile);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);
export default router;
