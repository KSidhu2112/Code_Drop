const express = require('express');
const router = express.Router();
const {
    getPosts,
    getPostsAdmin,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
    getPostsByType,
    getPostById,
    getStats
} = require('../controllers/postController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getPosts);
router.get('/stats', getStats);
router.get('/:slug', getPostBySlug);
router.get('/id/:id', getPostById);
router.get('/type/:type', getPostsByType);


// Admin routes (Protected)
router.get('/admin/all', protect, adminOnly, getPostsAdmin);
router.post('/', protect, adminOnly, createPost);
router.put('/:id', protect, adminOnly, updatePost);
router.delete('/:id', protect, adminOnly, deletePost);

module.exports = router;
