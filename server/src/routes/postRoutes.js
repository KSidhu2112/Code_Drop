const express = require('express');
const router = express.Router();
const {
    getPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
    getPostsByType,
    getPostById,
    getStats
} = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getPosts);
router.get('/stats', getStats);
router.get('/:slug', getPostBySlug);
router.get('/id/:id', getPostById);
router.get('/type/:type', getPostsByType);


// Admin routes (Protected)
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
