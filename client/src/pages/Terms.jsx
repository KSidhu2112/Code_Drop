import React from 'react';

const Terms = () => {
    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-outfit">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-10 text-white">
                    <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
                    <p className="text-teal-100">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="p-8 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Terms</h2>
                        <p className="text-gray-600 leading-relaxed">
                            By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Use License</h2>
                        <p className="text-gray-600 leading-relaxed mb-2">
                            Permission is granted to temporarily download one copy of the materials (information or software) on CodeDrop's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 pl-4 space-y-1">
                            <li>modify or copy the materials;</li>
                            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                            <li>attempt to decompile or reverse engineer any software contained on CodeDrop's website;</li>
                            <li>remove any copyright or other proprietary notations from the materials; or</li>
                            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Disclaimer</h2>
                        <p className="text-gray-600 leading-relaxed">
                            The materials on CodeDrop's website are provided "as is". CodeDrop makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Limitations</h2>
                        <p className="text-gray-600 leading-relaxed">
                            In no event shall CodeDrop or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on CodeDrop's Internet site.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Governing Law</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Any claim relating to CodeDrop's website shall be governed by the local laws without regard to its conflict of law provisions.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
