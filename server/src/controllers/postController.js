const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all posts (public)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ isPublished: true }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all posts (Admin - includes unpublished)
// @route   GET /api/posts/admin
// @access  Private/Admin
const getPostsAdmin = async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
const getPostBySlug = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get posts by type
// @route   GET /api/posts/type/:type
// @access  Public
const getPostsByType = async (req, res) => {
    try {
        const type = req.params.type.toUpperCase();
        const posts = await Post.find({ type, isPublished: true }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get post by ID
// @route   GET /api/posts/id/:id
// @access  Public (or Admin? Public is fine if we want to fetch by ID)
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a post
// @route   POST /api/posts

// @access  Private/Admin
const createPost = async (req, res) => {
    try {
        const {
            title,
            slug,
            type,
            description,
            githubLink,
            relatedLinks,
            difficulty,
            tags,
            isPublished
        } = req.body;

        const postExists = await Post.findOne({ slug });

        if (postExists) {
            return res.status(400).json({ message: 'Post already exists with this slug' });
        }

        const post = await Post.create({
            title,
            slug,
            type,
            description,
            githubLink,
            relatedLinks,
            difficulty,
            tags,
            isPublished
        });

        if (post) {
            // Create notification if the post is published
            if (post.isPublished) {
                await Notification.create({
                    type: 'NEW_POST',
                    title: `New ${post.type} Post`,
                    message: post.title,
                    postSlug: post.slug,
                    postType: post.type
                });
            }
            res.status(201).json(post);
        } else {
            res.status(400).json({ message: 'Invalid post data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private/Admin
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            const wasPublished = post.isPublished;

            post.title = req.body.title || post.title;
            post.slug = req.body.slug || post.slug;
            post.type = req.body.type || post.type;
            post.description = req.body.description || post.description;
            post.githubLink = req.body.githubLink || post.githubLink;
            post.relatedLinks = req.body.relatedLinks || post.relatedLinks;
            post.difficulty = req.body.difficulty || post.difficulty;
            post.tags = req.body.tags || post.tags;
            post.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : post.isPublished;

            const updatedPost = await post.save();

            // Create notification if the post was just published (wasn't published before)
            if (!wasPublished && updatedPost.isPublished) {
                await Notification.create({
                    type: 'NEW_POST',
                    title: `New ${updatedPost.type} Post`,
                    message: updatedPost.title,
                    postSlug: updatedPost.slug,
                    postType: updatedPost.type
                });
            }

            res.json(updatedPost);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private/Admin
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            await post.deleteOne();
            res.json({ message: 'Post removed' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get stats
// @route   GET /api/posts/stats
// @access  Public
const getStats = async (req, res) => {
    try {
        const dsaCount = await Post.countDocuments({ type: 'DSA', isPublished: true });
        const contestCount = await Post.countDocuments({ type: 'CONTEST', isPublished: true });

        // Tech Topics can be defined as unique tags across all published posts, 
        // or just Full Stack posts if tags are sparse. Let's use unique tags as a proxy for topics.
        const tags = await Post.distinct('tags', { isPublished: true });
        const techTopicsCount = tags.length;

        // Active Learners: Count of verified users.
        const activeLearnersCount = await User.countDocuments({ isVerified: true });

        res.json({
            dsaCount,
            contestCount,
            techTopicsCount,
            activeLearnersCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getPosts,
    getPostsAdmin,
    getPostBySlug,
    getPostsByType,
    getPostById,
    createPost,

    updatePost,
    deletePost,
    getStats
};
