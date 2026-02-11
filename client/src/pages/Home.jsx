import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../config/api';
import { FaArrowRight, FaCode, FaLaptopCode, FaRocket } from 'react-icons/fa';

const Home = () => {
    const [latestPosts, setLatestPosts] = useState([]);
    const [stats, setStats] = useState({
        dsaCount: 0,
        techTopicsCount: 0,
        activeLearnersCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsResponse, statsResponse] = await Promise.all([
                    api.get('/posts'),
                    api.get('/posts/stats')
                ]);

                setLatestPosts(postsResponse.data.slice(0, 6));
                setStats(statsResponse.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gray-50 pt-20">
                {/* Animated Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-[50rem] h-[50rem] bg-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Logo */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-20 text-center md:text-left">
                        {/* Logo */}
                        <div className="flex-shrink-0 animate-fade-in-right">
                            <div className="relative w-48 h-48 md:w-72 md:h-72 rounded-full p-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/30 group hover:shadow-indigo-500/50 transition-all duration-300">
                                <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gray-900 border-4 border-transparent group-hover:border-indigo-500/30 transition-all">
                                    <img
                                        src="/logo.png"
                                        alt="CodeDrop Logo"
                                        className="w-full h-full object-contain hover:scale-110 transition-transform duration-500 p-4"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-indigo-100 shadow-sm text-indigo-600 text-sm font-semibold mb-8 animate-fade-in-down mx-auto md:mx-0">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                New Content Added Daily
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-up">
                                <span className="block text-gray-900 font-outfit">Code with</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                                    Confidence & Clarity
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed animate-fade-in-up delay-100">
                                Master Data Structures, Algorithms, and Full Stack Development through simplified explanations and hands-on projects.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-6 animate-fade-in-up delay-200">
                                <Link to="/dsa" className="btn-primary flex items-center justify-center gap-2 group">
                                    <FaCode className="group-hover:rotate-12 transition-transform" />
                                    Explore DSA
                                </Link>
                                <Link to="/full-stack" className="btn-secondary flex items-center justify-center gap-2 group">
                                    <FaLaptopCode className="group-hover:-translate-y-1 transition-transform" />
                                    Full Stack Guide
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Floating UI Elements or stats for visual flair */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto opacity-90 animate-fade-in-up delay-300">
                        <StatCard number={stats.dsaCount} label="DSA Problems" icon={<FaCode className="text-indigo-500" />} />
                        <StatCard number={stats.techTopicsCount} label="Tech Topics" icon={<FaLaptopCode className="text-purple-500" />} />
                        <StatCard number={stats.activeLearnersCount} label="Active Learners" icon={<FaRocket className="text-pink-500" />} />
                    </div>
                </div>
            </section>

            {/* Latest Posts */}
            <section className="bg-white py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-outfit relative inline-block">
                                Latest Drops
                                <span className="absolute -bottom-2 left-0 w-1/3 h-1.5 bg-indigo-600 rounded-full"></span>
                            </h2>
                            <p className="text-gray-500 text-lg">Fresh content to keep your skills sharp.</p>
                        </div>
                        <Link to="/dsa" className="hidden md:flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition group mt-4 md:mt-0">
                            View All <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => <div key={i} className="bg-gray-100 h-96 rounded-2xl animate-pulse"></div>)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {latestPosts.map((post) => (
                                <Link to={`/post/${post.slug}`} key={post._id} className="group glass-card h-full flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-2 border-gray-100">
                                    <div className="p-8 flex flex-col flex-grow relative">
                                        <div className={`absolute top-0 right-0 w-24 h-24 blur-2xl rounded-full opacity-20 -mr-10 -mt-10 transition-opacity group-hover:opacity-40 ${post.type === 'DSA' ? 'bg-blue-500' : 'bg-green-500'}`}></div>

                                        <div className="flex justify-between items-start mb-6">
                                            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${post.type === 'DSA' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                                {post.type}
                                            </span>
                                            <span className="text-gray-400 text-xs font-medium">{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2 font-outfit">{post.title}</h3>
                                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-grow text-sm">{post.description}</p>

                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {post.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-100">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 group-hover:bg-indigo-50/50 transition-colors flex justify-between items-center text-sm font-semibold text-gray-500 group-hover:text-indigo-600">
                                        Read Article <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="mt-12 text-center md:hidden">
                        <Link to="/dsa" className="btn-secondary inline-flex items-center text-sm">
                            View All Content <FaArrowRight className="ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Newsletter / CTA Section */}
            <section className="py-24 px-4 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-sm z-0"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 font-outfit">Never Miss a Drop</h2>
                    <p className="text-indigo-200 text-xl mb-10 max-w-2xl mx-auto">Join the community on Instagram to get daily bite-sized coding tips and stay updated with the latest tutorials.</p>
                    <a href="https://www.instagram.com/our_careerbridge/" target="_blank" rel="noopener noreferrer" className="btn-primary bg-gradient-to-r from-pink-500 to-orange-500 hover:shadow-pink-500/30 text-lg px-10 py-4 inline-flex items-center">
                        Follow on Instagram
                    </a>
                </div>
            </section>
        </div>
    );
};

const StatCard = ({ number, label, icon }) => (
    <div className="bg-white/60 backdrop-blur border border-white/60 p-6 rounded-2xl shadow-lg flex items-center space-x-4 hover:scale-105 transition-transform">
        <div className="bg-white p-3 rounded-full shadow-sm text-2xl">
            {icon}
        </div>
        <div className="text-left">
            <div className="text-2xl font-bold text-gray-900 font-outfit">{number}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">{label}</div>
        </div>
    </div>
);

export default Home;
