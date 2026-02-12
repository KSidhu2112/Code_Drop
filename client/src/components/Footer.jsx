import { FaInstagram, FaLinkedin, FaHeart, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
                    <div className="md:col-span-2">
                        <h3 className="text-3xl font-bold mb-4 font-outfit bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">CodeDrop</h3>
                        <p className="text-gray-400 mb-6 max-w-sm mx-auto md:mx-0 leading-relaxed">
                            Master Data Structures, Algorithms, and Full Stack Development.
                            Simplify complex concepts
                            <span className="text-indigo-400 font-semibold mx-1">one drop at a time</span>.
                        </p>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <SocialIcon href="https://www.instagram.com/our_careerbridge/" icon={<FaInstagram />} color="hover:text-pink-500" />
                            <SocialIcon href="https://www.linkedin.com/in/k-sidhu-bba3b2285" icon={<FaLinkedin />} color="hover:text-blue-500" />
                            <SocialIcon href="https://www.youtube.com/@OurCareerBridge" icon={<FaYoutube />} color="hover:text-red-600" />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-indigo-300">Explore</h4>
                        <ul className="space-y-3">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterLink href="/dsa">DSA Problems</FooterLink>
                            <FooterLink href="/full-stack">Full Stack Guide</FooterLink>
                            <FooterLink href="#">Roadmaps</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-pink-300">Legal & More</h4>
                        <ul className="space-y-3">
                            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                            <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
                            <FooterLink href="/contact-us">Contact Us</FooterLink>
                            <FooterLink href="/about-me">About Me</FooterLink>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} CodeDrop. All rights reserved.</p>
                    <p className="mt-2 md:mt-0 flex items-center">
                        Made with <FaHeart className="text-red-500 mx-1 animate-pulse" /> by <span className="text-indigo-400 ml-1 font-semibold">K Sidhu</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ href, icon, color }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`bg-gray-800 p-3 rounded-full text-gray-400 transition-all duration-300 hover:bg-gray-700 hover:-translate-y-1 ${color} text-xl shadow-lg border border-gray-700`}
    >
        {icon}
    </a>
);

const FooterLink = ({ href, children }) => (
    <li>
        <a href={href} className="text-gray-400 hover:text-white transition-colors duration-200 hover:pl-2 inline-block">
            {children}
        </a>
    </li>
);

export default Footer;
