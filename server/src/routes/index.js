import { Router } from 'express';

import { validate } from '../middleware/validate.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

import * as auth from '../controllers/auth.controller.js';
import * as products from '../controllers/product.controller.js';
import * as categories from '../controllers/category.controller.js';
import * as misc from '../controllers/misc.controller.js';
import { getStats } from '../controllers/admin.controller.js';
import * as S from '../validators/schemas.js';

export const api = Router();

/* ── Public content (read-only) ───────────────────── */
api.get('/products', products.listProducts);
api.get('/products/:idOrSlug/related', products.getRelated);
api.get('/products/:idOrSlug/reviews', misc.listProductReviews);
api.get('/products/:idOrSlug', products.getProduct);
api.get('/categories', categories.listCategories);
api.get('/offers', misc.listOffers);
api.get('/reviews', misc.listReviews);
api.get('/settings', misc.getSettings);

/* ── Auth ─────────────────────────────────────────── */
api.post('/auth/login', validate(S.loginSchema), auth.login);
api.post('/auth/logout', auth.logout);
api.get('/auth/me', requireAuth, auth.me);

/* ── Admin (all require an admin token) ────────────── */
const admin = Router();
admin.use(requireAuth, requireAdmin);

admin.get('/stats', getStats);

admin.get('/products', products.listAllProducts);
admin.post('/products', validate(S.createProductSchema), products.createProduct);
admin.put('/products/:id', validate(S.updateProductSchema), products.updateProduct);
admin.patch('/products/:id/availability', products.setAvailability);
admin.delete('/products/:id', products.deleteProduct);

admin.post('/categories', validate(S.createCategorySchema), categories.createCategory);
admin.put('/categories/:id', validate(S.updateCategorySchema), categories.updateCategory);
admin.patch('/categories/reorder', validate(S.reorderSchema), categories.reorderCategories);
admin.delete('/categories/:id', categories.deleteCategory);

admin.post('/offers', validate(S.createOfferSchema), misc.createOffer);
admin.put('/offers/:id', validate(S.updateOfferSchema), misc.updateOffer);
admin.delete('/offers/:id', misc.deleteOffer);

admin.post('/reviews', validate(S.createReviewSchema), misc.createReview);
admin.put('/reviews/:id', validate(S.updateReviewSchema), misc.updateReview);
admin.delete('/reviews/:id', misc.deleteReview);

admin.put('/settings', validate(S.settingsSchema), misc.updateSettings);

api.use('/admin', admin);
