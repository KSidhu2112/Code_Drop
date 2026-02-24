import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { FaTrophy, FaCheckCircle, FaSearch, FaClock, FaFire } from 'react-icons/fa';

const Contests = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await api.get('/posts/type/CONTEST');
                setPosts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filteredPosts = filter === 'All' ? posts : posts.filter(p => p.difficulty === filter);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-block p-3 rounded-2xl bg-amber-100 text-amber-600 mb-4 shadow-inner">
                        <FaTrophy size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-outfit">Contest Problems</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">Curated contest problems from top competitive programming platforms to sharpen your skills.</p>
                </div>

                {/* Filters */}
                <div className="flex justify-center mb-10 space-x-2 md:space-x-4 overflow-x-auto py-2">
                    {['All', 'Easy', 'Medium', 'Hard'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 text-sm md:text-base whitespace-nowrap ${filter === f
                                ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/30 scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        {filteredPosts.length > 0 ? (
                            <ul className="divide-y divide-gray-100">
                                {filteredPosts.map((post, idx) => (
                                    <li key={post._id} className="group hover:bg-amber-50/30 transition duration-200">
                                        <Link to={`/post/${post.slug}`} className="block p-6 sm:p-8">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="text-amber-500 font-mono text-sm font-bold">#{String(idx + 1).padStart(3, '0')}</div>
                                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors font-outfit">{post.title}</h3>
                                                    </div>
                                                    <p className="text-gray-500 text-sm line-clamp-2 max-w-2xl mb-3">{post.description}</p>
                                                    <div className="flex gap-2">
                                                        {post.tags.slice(0, 4).map(tag => (
                                                            <span key={tag} className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full font-medium">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                                    <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border ${getDifficultyColor(post.difficulty)}`}>
                                                        {post.difficulty}
                                                    </span>
                                                    <FaFire className="text-gray-300 group-hover:text-amber-400 transition-colors text-xl" />
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-12 text-center text-gray-400">
                                <FaSearch className="mx-auto text-4xl mb-4 opacity-20" />
                                <p className="text-lg">No contest problems found for this filter.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contests;
