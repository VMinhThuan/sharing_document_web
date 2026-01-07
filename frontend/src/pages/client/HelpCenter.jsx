import { Link } from 'react-router-dom';

const HelpCenter = () => {
    return (
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
            <header className="h-16 flex items-center justify-between px-8 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
                <h2 className="text-xl font-bold">Help Center</h2>
                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" title="Toggle Theme">
                        <span className="material-symbols-outlined dark:hidden">dark_mode</span>
                        <span className="material-symbols-outlined hidden dark:block">light_mode</span>
                    </button>
                    <button className="p-2 relative rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-light dark:border-background-dark"></span>
                    </button>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-8 pt-8">
                <div className="mb-12 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">How can we help you today?</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Find answers to your questions about AI Roadmaps, document processing, and study tools.</p>
                    <div className="relative shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10 rounded-xl">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">search</span>
                        </div>
                        <input className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary shadow-sm" placeholder="Search for articles, guides, or troubleshooting..." type="text" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
                    <div className="group bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-transparent hover:border-primary/30 dark:hover:border-primary/50 shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">auto_stories</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Getting Started</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Learn the basics of uploading documents and generating your first AI roadmap.</p>
                    </div>
                    <div className="group bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-transparent hover:border-primary/30 dark:hover:border-primary/50 shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">psychology</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">AI Features Guide</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Master the AI learning generator, quiz creation, and summarization tools.</p>
                    </div>
                    <div className="group bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-transparent hover:border-primary/30 dark:hover:border-primary/50 shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">manage_accounts</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Account &amp; Billing</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Manage your subscription, update profile settings, and payment methods.</p>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                        <a className="text-sm font-medium text-primary hover:text-primary-hover" href="#">View all FAQs</a>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <details className="group">
                                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                                    <span className="font-medium text-gray-900 dark:text-white">How accurate are the AI-generated roadmaps?</span>
                                    <span className="transition group-open:rotate-180">
                                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">expand_more</span>
                                    </span>
                                </summary>
                                <div className="px-5 pb-5 pt-0 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    Our AI analyzes your documents with 98% conceptual accuracy. However, we always recommend reviewing the generated path. You can edit, reorder, or add custom nodes to any roadmap after generation.
                                </div>
                            </details>
                        </div>
                        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <details className="group">
                                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                                    <span className="font-medium text-gray-900 dark:text-white">What file formats are supported for upload?</span>
                                    <span className="transition group-open:rotate-180">
                                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">expand_more</span>
                                    </span>
                                </summary>
                                <div className="px-5 pb-5 pt-0 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    Currently, we support PDF, DOCX, TXT, and MD files. We are working on adding support for scanned images (OCR) and PowerPoint presentations in the next update. Maximum file size is 50MB per upload.
                                </div>
                            </details>
                        </div>
                        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <details className="group">
                                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                                    <span className="font-medium text-gray-900 dark:text-white">Can I share my study materials with non-users?</span>
                                    <span className="transition group-open:rotate-180">
                                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">expand_more</span>
                                    </span>
                                </summary>
                                <div className="px-5 pb-5 pt-0 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    Yes! You can generate a public 'Read-Only' link for any roadmap or summary. Non-users can view the content but cannot edit or use AI features without creating an account.
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto pb-12">
                    <div className="bg-gradient-to-br from-primary/10 to-indigo-500/10 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-primary/20 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Still need help?</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">Our support team is available 24/7 to assist you with any issues.</p>
                            <div className="flex space-x-4">
                                <a className="flex items-center text-sm font-medium text-primary hover:text-primary-hover" href="#">
                                    <span className="material-symbols-outlined text-lg mr-2">email</span>
                                    support@smartshare.ai
                                </a>
                                <a className="flex items-center text-sm font-medium text-primary hover:text-primary-hover" href="#">
                                    <span className="material-symbols-outlined text-lg mr-2">chat</span>
                                    Live Chat
                                </a>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <button className="bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
                <footer className="max-w-5xl mx-auto py-8 text-center border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">© 2023 SmartShare AI Inc. All rights reserved.</p>
                    <div className="flex justify-center space-x-6 mt-4">
                        <a className="text-xs text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white" href="#">Privacy Policy</a>
                        <a className="text-xs text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white" href="#">Terms of Service</a>
                        <a className="text-xs text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white" href="#">Status</a>
                    </div>
                </footer>
            </div>
        </main>
    )
}

export default HelpCenter;
