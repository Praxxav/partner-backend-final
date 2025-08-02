import { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import adminMiddleware from '../middlewares/admin';
import { 
    createBundle,
    updateBundle,
    deleteBundle,
    listBundles,
    getBundleById,
    createSubBundle,
    updateSubBundle,
    deleteSubBundle,
    createTier,
    updateTier,
    deleteTier,
    createFeature,
    updateFeature,
    deleteFeature
} from '../controllers/bundles';

const bundleRoutes: Router = Router();

// Bundle routes
bundleRoutes.post('/', [authMiddleware, adminMiddleware], errorHandler(createBundle));
bundleRoutes.put('/:id', [authMiddleware, adminMiddleware], errorHandler(updateBundle));
bundleRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteBundle));
bundleRoutes.get('/', errorHandler(listBundles));
bundleRoutes.get('/:id', errorHandler(getBundleById));

// SubBundle routes
bundleRoutes.post('/:bundleId/sub-bundles', [authMiddleware, adminMiddleware], errorHandler(createSubBundle));
bundleRoutes.put('/sub-bundles/:id', [authMiddleware, adminMiddleware], errorHandler(updateSubBundle));
bundleRoutes.delete('/sub-bundles/:id', [authMiddleware, adminMiddleware], errorHandler(deleteSubBundle));

// Tier routes
bundleRoutes.post('/sub-bundles/:subBundleId/tiers', [authMiddleware, adminMiddleware], errorHandler(createTier));
bundleRoutes.put('/tiers/:id', [authMiddleware, adminMiddleware], errorHandler(updateTier));
bundleRoutes.delete('/tiers/:id', [authMiddleware, adminMiddleware], errorHandler(deleteTier));

// Feature routes
bundleRoutes.post('/tiers/:tierId/features', [authMiddleware, adminMiddleware], errorHandler(createFeature));
bundleRoutes.put('/features/:id', [authMiddleware, adminMiddleware], errorHandler(updateFeature));
bundleRoutes.delete('/features/:id', [authMiddleware, adminMiddleware], errorHandler(deleteFeature));

export default bundleRoutes;
