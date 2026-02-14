import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../config/api';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaCalendarAlt, FaTag, FaClock, FaCode } from 'react-icons/fa';

const PostDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await api.get(`/posts/${slug}`);
                setPost(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading content...</p>
            </div>
        </div>
    );

    if (!post) return <div className="text-center py-40 text-red-500 font-bold text-xl">Post not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 animate-fade-in-up">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back Button */}
                <Link to={post.type === 'DSA' ? '/dsa' : '/full-stack'} className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition-colors font-medium group">
                    <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to {post.type === 'DSA' ? 'Problems' : 'Guides'}
                </Link>

                <article className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
                    {/* Header Decoration */}
                    <div className={`h-2 w-full bg-gradient-to-r ${post.type === 'DSA' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'}`}></div>

                    <div className="p-8 md:p-12">

                        {/* Meta Header */}
                        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
                            <span className={`px-4 py-1.5 rounded-full font-bold uppercase tracking-wide border ${post.type === 'DSA' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-purple-50 text-purple-700 border-purple-100'}`}>
                                {post.type}
                            </span>

                            {post.type === 'DSA' && (
                                <span className={`px-4 py-1.5 rounded-full font-bold border ${post.difficulty === 'Easy' ? 'bg-green-50 text-green-700 border-green-100' :
                                    post.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                        'bg-red-50 text-red-700 border-red-100'
                                    }`}>
                                    {post.difficulty}
                                </span>
                            )}

                            <div className="flex items-center text-gray-500 ml-auto">
                                <FaCalendarAlt className="mr-2" />
                                {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 font-outfit leading-tight">
                            {post.title}
                        </h1>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-10 pb-10 border-b border-gray-100">
                            {post.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-default">
                                    <FaTag className="mr-1.5 text-gray-400" size={12} />
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="prose prose-lg prose-indigo max-w-none mb-12 text-gray-700 leading-8">
                            {/* Assuming plain text, but handling newlines. For real rich text, render HTML or markdown */}
                            {post.description.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4">{paragraph}</p>
                            ))}
                        </div>

                        {/* Resources / Links Box */}
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-inner">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 font-outfit">
                                <FaExternalLinkAlt className="text-indigo-500" />
                                Resources & Solutions
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {post.githubLink && (
                                    <a href={post.githubLink} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 bg-gray-900 text-white px-6 py-4 rounded-xl hover:bg-black hover:scale-[1.02] transition-all shadow-lg hover:shadow-gray-500/30 font-semibold group">
                                        <FaGithub className="text-2xl group-hover:rotate-12 transition-transform" />
                                        <span>View Source Code</span>
                                    </a>
                                )}

                                {post.relatedLinks?.leetcode && (
                                    <a href={post.relatedLinks.leetcode} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 bg-[#FFA116] text-white px-6 py-4 rounded-xl hover:bg-[#ffb347] hover:scale-[1.02] transition-all shadow-lg hover:shadow-orange-500/30 font-semibold">
                                        {/* SVG could be better here */}
                                        <FaCode className="text-2xl" />
                                        <span>Solve on LeetCode</span>
                                    </a>
                                )}

                                {post.relatedLinks?.gfg && (
                                    <a href={post.relatedLinks.gfg} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 bg-[#2F8D46] text-white px-6 py-4 rounded-xl hover:bg-[#3cb35a] hover:scale-[1.02] transition-all shadow-lg hover:shadow-green-500/30 font-semibold">
                                        <FaExternalLinkAlt className="text-xl" />
                                        <span>Read on GFG</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default PostDetail;
