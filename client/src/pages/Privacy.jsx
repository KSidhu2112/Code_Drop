import React from 'react';

const Privacy = () => {
    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-outfit">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10 text-white">
                    <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
                    <p className="text-indigo-100">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="p-8 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Welcome to CodeDrop. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you as to how we look after your personal data when you visit our website
                            and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Data We Collect</h2>
                        <p className="text-gray-600 leading-relaxed mb-2">
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 pl-4 space-y-1">
                            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data</strong> includes email address and telephone number.</li>
                            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                            <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. How We Use Your Data</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 pl-4 space-y-1 mt-2">
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li>Where it is necessary for our legitimate interests (or those of a third party).</li>
                            <li>Where we need to comply with a legal or regulatory obligation.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Data Security</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Contact Details</h2>
                        <p className="text-gray-600 leading-relaxed">
                            If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:support@codedrop.com" className="text-indigo-600 hover:text-indigo-800 font-medium">support@codedrop.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
