import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const { data } = await api.get('/posts');
            setPosts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/posts/${id}`);
                setPosts(posts.filter((post) => post._id !== id));
            } catch (error) {
                alert('Failed to delete post');
            }
        }
    };

    const togglePublish = async (post) => {
        try {
            const updatedPost = { ...post, isPublished: !post.isPublished };
            await api.put(`/posts/${post._id}`, updatedPost);
            setPosts(posts.map((p) => (p._id === post._id ? updatedPost : p)));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading posts...</div>;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Manage Content</h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                    Total Posts: {posts.length}
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {posts.map((post) => (
                            <tr key={post._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={post.title}>{post.title}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{post.slug}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.type === 'DSA' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                        {post.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {post.difficulty}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button onClick={() => togglePublish(post)} className={`focus:outline-none transition transform hover:scale-110 ${post.isPublished ? 'text-green-500' : 'text-gray-300'}`}>
                                        {post.isPublished ? <FaCheck size={18} /> : <FaTimes size={18} />}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                    <Link to={`/edit-post/${post._id}`} className="text-indigo-600 hover:text-indigo-900 inline-block">
                                        <FaEdit size={18} />
                                    </Link>
                                    <button onClick={() => deletePost(post._id)} className="text-red-500 hover:text-red-700 inline-block">
                                        <FaTrash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                    No posts found. <Link to="/add-post" className="text-indigo-600 hover:underline">Create one?</Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
