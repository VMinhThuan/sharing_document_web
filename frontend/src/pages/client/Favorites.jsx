import { Link } from 'react-router-dom';

const Favorites = () => {
    return (
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-background-dark relative">
            <header className="sticky top-0 z-30 px-8 py-5 bg-gray-50/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between">
                <button className="md:hidden p-2 text-gray-500 dark:text-white">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <div className="flex-1 max-w-xl hidden md:block">
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">search</span>
                        </span>
                        <input className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" placeholder="Search your favorites..." type="text" />
                    </div>
                </div>
                <div className="flex items-center space-x-4 ml-auto">
                    <button className="p-2.5 rounded-xl bg-white dark:bg-[#1e293b] text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors relative shadow-sm">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1e293b]"></span>
                    </button>
                </div>
            </header>
            <div className="px-8 pb-10 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Favorites</h2>
                    <p className="text-gray-500 dark:text-[#94a3b8]">Manage and organize your saved learning materials.</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
                        <button className="px-4 py-2 rounded-lg bg-primary text-white font-medium text-sm whitespace-nowrap shadow-md shadow-blue-500/20">
                            All Items (12)
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-white dark:bg-[#1e293b] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 font-medium text-sm border border-gray-200 dark:border-[#334155] whitespace-nowrap transition-colors">
                            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-base text-red-400">picture_as_pdf</span> PDFs</span>
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-white dark:bg-[#1e293b] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 font-medium text-sm border border-gray-200 dark:border-[#334155] whitespace-nowrap transition-colors">
                            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-base text-blue-400">article</span> Notes</span>
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-white dark:bg-[#1e293b] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 font-medium text-sm border border-gray-200 dark:border-[#334155] whitespace-nowrap transition-colors">
                            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-base text-purple-400">mic</span> Audio</span>
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 hidden md:inline">Sort by:</span>
                        <select className="form-select text-sm py-2 pl-3 pr-8 rounded-lg border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-200 focus:border-primary focus:ring-0 cursor-pointer">
                            <option>Recently Added</option>
                            <option>Name (A-Z)</option>
                            <option>Most Viewed</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-[#334155] overflow-hidden hover:shadow-lg hover:shadow-blue-500/5 dark:hover:border-blue-500/30 transition-all group">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-500 dark:text-red-400">
                                    <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                                </div>
                                <button className="text-pink-500 hover:text-pink-600 transition-colors">
                                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">Intro to React Hooks</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">A comprehensive guide to useState, useEffect and custom hooks for beginners.</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">Frontend</span>
                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">React</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-[#334155]">
                                <span>Added 2 days ago</span>
                                <span>2.4 MB</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-black/20 px-5 py-3 flex items-center justify-between">
                            <button className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary flex items-center gap-1 transition-colors">
                                <span className="material-symbols-outlined text-base">visibility</span> Preview
                            </button>
                            <button className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
                                Generate Quiz <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-[#334155] overflow-hidden hover:shadow-lg hover:shadow-blue-500/5 dark:hover:border-blue-500/30 transition-all group">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 dark:text-blue-400">
                                    <span className="material-symbols-outlined text-2xl">description</span>
                                </div>
                                <button className="text-pink-500 hover:text-pink-600 transition-colors">
                                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">Data Structures Summary</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">Quick reference notes for binary trees, graphs, and linked lists algorithms.</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">CS101</span>
                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">Exam Prep</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-[#334155]">
                                <span>Added 5 days ago</span>
                                <span>Docx</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-black/20 px-5 py-3 flex items-center justify-between">
                            <button className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary flex items-center gap-1 transition-colors">
                                <span className="material-symbols-outlined text-base">visibility</span> Preview
                            </button>
                            <button className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
                                Ask AI <span className="material-symbols-outlined text-base">smart_toy</span>
                            </button>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-[#334155] overflow-hidden hover:shadow-lg hover:shadow-blue-500/5 dark:hover:border-blue-500/30 transition-all group">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 dark:text-purple-400">
                                    <span className="material-symbols-outlined text-2xl">mic</span>
                                </div>
                                <button className="text-pink-500 hover:text-pink-600 transition-colors">
                                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">UX Design Principals - Week 4</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">Audio recording of the guest lecture on accessibility and inclusive design.</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">Design</span>
                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">Audio</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-[#334155]">
                                <span>Added 1 week ago</span>
                                <span>45 mins</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-black/20 px-5 py-3 flex items-center justify-between">
                            <button className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary flex items-center gap-1 transition-colors">
                                <span className="material-symbols-outlined text-base">play_circle</span> Play
                            </button>
                            <button className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
                                Transcribe <span className="material-symbols-outlined text-base">subtitles</span>
                            </button>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-[#334155] overflow-hidden hover:shadow-lg hover:shadow-blue-500/5 dark:hover:border-blue-500/30 transition-all group">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 dark:text-orange-400">
                                    <span className="material-symbols-outlined text-2xl">slideshow</span>
                                </div>
                                <button className="text-pink-500 hover:text-pink-600 transition-colors">
                                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">Machine Learning Basics</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">Presentation slides covering supervised vs unsupervised learning models.</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">AI/ML</span>
                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">Slides</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-[#334155]">
                                <span>Added 2 weeks ago</span>
                                <span>15 Slides</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-black/20 px-5 py-3 flex items-center justify-between">
                            <button className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary flex items-center gap-1 transition-colors">
                                <span className="material-symbols-outlined text-base">visibility</span> View
                            </button>
                            <button className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
                                Summarize <span className="material-symbols-outlined text-base">auto_awesome</span>
                            </button>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-[#334155] overflow-hidden hover:shadow-lg hover:shadow-blue-500/5 dark:hover:border-blue-500/30 transition-all group">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-500/10 flex items-center justify-center text-teal-500 dark:text-teal-400">
                                    <span className="material-symbols-outlined text-2xl">science</span>
                                </div>
                                <button className="text-pink-500 hover:text-pink-600 transition-colors">
                                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">Climate Change Impact Study</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">Latest research paper on environmental science and policy changes.</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">Science</span>
                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">Research</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-[#334155]">
                                <span>Added 3 weeks ago</span>
                                <span>PDF</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-black/20 px-5 py-3 flex items-center justify-between">
                            <button className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary flex items-center gap-1 transition-colors">
                                <span className="material-symbols-outlined text-base">visibility</span> Read
                            </button>
                            <button className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
                                Extract Data <span className="material-symbols-outlined text-base">table_chart</span>
                            </button>
                        </div>
                    </div>
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-[#334155] flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:border-primary dark:hover:border-primary hover:bg-blue-50/50 dark:hover:bg-[#1e293b]/50 transition-all group">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#1e293b] group-hover:bg-blue-100 dark:group-hover:bg-primary/20 flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors mb-4">
                            <span className="material-symbols-outlined text-3xl">add</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium group-hover:text-primary transition-colors">Add from Library</p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Favorites;
