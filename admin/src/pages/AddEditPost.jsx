import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../config/api';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AddEditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        type: 'DSA',
        description: '',
        githubLink: '',
        relatedLinks: { leetcode: '', gfg: '' },
        difficulty: 'Medium',
        tags: '',
        isPublished: false
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const fetchPost = async () => {
                try {
                    const { data } = await api.get(`/posts/id/${id}`);
                    // Handle tags array if it comes as array
                    setFormData({
                        ...data,
                        tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags
                    });
                } catch (error) {
                    console.error(error);
                    toast.error('Failed to fetch post details');
                    navigate('/');
                }
            };
            fetchPost();
        }
    }, [id, isEditMode, navigate]);

    // Actually, let's look at `Dashboard.jsx`. I am not passing state.
    // I will update `Dashboard.jsx` to pass state.
    // AND I will implement logic here to use location.state OR fetch if missing.
    // If fetch is needed and no API exists, I'll fail.
    // So I SHOULD add the API.

    // Let's write this component assuming I will add the API route next.

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Convert tags string to array
        const payload = {
            ...formData,
            tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()) : formData.tags
        };

        try {
            if (isEditMode) {
                await api.put(`/posts/${id}`, payload);
                toast.success('Post updated successfully!');
            } else {
                await api.post('/posts', payload);
                toast.success('Post created successfully!');
            }
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
                <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm font-medium">
                    <FaArrowLeft /> Back
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            onBlur={!isEditMode && !formData.slug ? generateSlug : undefined}
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Slug</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                                required
                            />
                            <button type="button" onClick={generateSlug} className="text-xs bg-gray-200 hover:bg-gray-300 px-2 rounded text-gray-700">Gen</button>
                        </div>
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="DSA">DSA</option>
                            <option value="FULLSTACK">FULLSTACK</option>
                            <option value="CONTEST">CONTEST</option>
                        </select>
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Difficulty</label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    {/* Github Link */}
                    <div className="col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">GitHub Link</label>
                        <input
                            type="url"
                            name="githubLink"
                            value={formData.githubLink}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="https://github.com/..."
                        />
                    </div>

                    {/* Related Links */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">LeetCode Link</label>
                        <input
                            type="url"
                            name="relatedLinks.leetcode"
                            value={formData.relatedLinks.leetcode}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">GFG Link</label>
                        <input
                            type="url"
                            name="relatedLinks.gfg"
                            value={formData.relatedLinks.gfg}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Stats / Tags */}
                    <div className="col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Tags (comma separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Array, React, DP..."
                        />
                    </div>

                    {/* Description */}
                    <div className="col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description / Content</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="10"
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Write your content here..."
                            required
                        ></textarea>
                    </div>

                    {/* Publish Toggle */}
                    <div className="col-span-2 flex items-center">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            id="publish"
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="publish" className="ml-2 block text-gray-900 font-bold">
                            Publish immediately
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded hover:bg-indigo-700 transition shadow-lg disabled:opacity-50"
                    >
                        <FaSave /> {loading ? 'Saving...' : 'Save Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEditPost;
