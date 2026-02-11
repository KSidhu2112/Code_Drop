import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { FaLaptopCode, FaArrowRight, FaLayerGroup } from 'react-icons/fa';

const FullStack = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await api.get('/posts/type/FULLSTACK');
                setPosts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-block p-3 rounded-2xl bg-purple-100 text-purple-600 mb-4 shadow-inner">
                        <FaLaptopCode size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-outfit">Full Stack Development</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">Comprehensive guides, tutorials, and concepts for modern web development.</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link to={`/post/${post.slug}`} key={post._id} className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-purple-100"></div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="mb-6">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm">
                                            <FaLayerGroup size={20} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors font-outfit leading-tight">{post.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{post.description}</p>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-100">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200 font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center text-purple-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                            Read Guide <FaArrowRight className="ml-2" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {posts.length === 0 && <div className="col-span-full text-center text-gray-500 py-20">No Full Stack posts yet.</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FullStack;
