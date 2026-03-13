import React from 'react';
import { FaLinkedin, FaCode, FaYoutube, FaGithub } from 'react-icons/fa';
import { FRONTEND_URL } from '../config/api';

const About = () => {
    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8 font-outfit">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 h-64 sm:h-80 relative">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2">
                            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-white overflow-hidden shadow-2xl bg-gray-200">
                                <img
                                    src="/myphoto.jpg"
                                    alt="K Sidhu"
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-28 px-8 pb-12 sm:px-12 text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">K Sidhu</h1>
                        <p className="text-xl text-indigo-600 font-medium mb-6">Full Stack Developer & DSA Enthusiast</p>

                        <div className="flex justify-center flex-wrap gap-6 mb-10">
                            <SocialLink href="https://www.linkedin.com/in/k-sidhu-bba3b2285" icon={<FaLinkedin />} />
                            <SocialLink href="https://github.com/kurvasidhu" icon={<FaGithub />} />
                            <SocialLink href="https://www.youtube.com/@OurCareerBridge" icon={<FaYoutube />} />
                            <SocialLink href={FRONTEND_URL} icon={<FaCode />} />
                        </div>

                        <div className="text-left space-y-8 max-w-2xl mx-auto">
                            <section>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-100 pb-2">Who Am I?</h2>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Hello! I'm Siddu, a passionate developer with a love for building scalable web applications and solving complex algorithmic problems.
                                    I created <strong>CodeDrop</strong> to bridge the gap between theoretical DSA concepts and practical full-stack development.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-pink-100 pb-2">My Mission</h2>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    My goal is to simplify learning for aspiring developers. Whether it's mastering the MERN stack or cracking coding interviews,
                                    I believe in learning by doing. CodeDrop is a platform designed to help you drop your code snippets, learn from others, and grow as a developer.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-100 pb-2">Tech Stack</h2>
                                <div className="flex flex-wrap gap-3">
                                    <TechBadge>React.js</TechBadge>
                                    <TechBadge>Node.js</TechBadge>
                                    <TechBadge>Express</TechBadge>
                                    <TechBadge>MongoDB</TechBadge>
                                    <TechBadge>Tailwind CSS</TechBadge>
                                    <TechBadge>Java</TechBadge>
                                    <TechBadge>Python</TechBadge>
                                    <TechBadge>Git</TechBadge>
                                </div>
                            </section>
                        </div>

                        <div className="mt-12 bg-gray-50 rounded-xl p-8 border border-gray-100">
                            <p className="text-gray-500 italic">
                                "The best way to predict the future is to invent it."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SocialLink = ({ href, icon }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-indigo-600 transition-colors transform hover:scale-110 text-2xl"
    >
        {icon}
    </a>
);

const TechBadge = ({ children }) => (
    <span className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-default">
        {children}
    </span>
);

export default About;
