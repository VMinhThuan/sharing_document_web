import { useNavigate } from 'react-router-dom';

const Library = () => {
    const navigate = useNavigate();

    const handleItemClick = (id) => {
        navigate(`/library/${id}`);
    };

    return (
        <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
            <header className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Library</h1>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-2xl">
                        Access all your study materials, lecture notes, and research papers in one organized place.
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 group-focus-within:text-primary transition-colors">search</span>
                        <input className="pl-10 pr-4 py-2.5 w-64 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" placeholder="Search your library..." type="text" />
                    </div>
                    <button className="p-2.5 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors shadow-sm">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                    <button className="p-2.5 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors shadow-sm">
                        <span className="material-symbols-outlined">grid_view</span>
                    </button>
                </div>
            </header>
            <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto">
                <button className="pb-3 border-b-2 border-primary text-primary font-medium text-sm whitespace-nowrap">Computer Science</button>
                <button className="pb-3 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium text-sm whitespace-nowrap transition-colors">Mathematics</button>
                <button className="pb-3 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium text-sm whitespace-nowrap transition-colors">Physics</button>
                <button className="pb-3 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium text-sm whitespace-nowrap transition-colors">Chemistry</button>
                <button className="pb-3 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium text-sm whitespace-nowrap transition-colors">Archive</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <div onClick={() => handleItemClick(1)} className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg dark:hover:shadow-primary/5 transition-all duration-300 group relative cursor-pointer">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0 text-red-500">
                            <span className="material-symbols-outlined">picture_as_pdf</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate mb-1" title="Intro to Genetics.pdf">Intro to Genetics.pdf</h4>
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-2 mb-3">
                                <span>Biology • Week 4</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <span>2.4 MB</span>
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">Analyzed</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Lecture</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">Edited 2 hours ago</span>
                        <div className="flex space-x-2">
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors" title="Chat with AI">
                                <span className="material-symbols-outlined text-sm">smart_toy</span>
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors" title="Share">
                                <span className="material-symbols-outlined text-sm">share</span>
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors" title="View">
                                <span className="material-symbols-outlined text-sm">visibility</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div onClick={() => handleItemClick(2)} className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg dark:hover:shadow-primary/5 transition-all duration-300 group relative cursor-pointer">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 text-blue-500">
                            <span className="material-symbols-outlined">description</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate mb-1">React_Hooks_Cheatsheet.docx</h4>
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-2 mb-3">
                                <span>Web Dev • Resources</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <span>845 KB</span>
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">Analyzed</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Reference</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">Edited Oct 22, 2023</span>
                        <div className="flex space-x-2">
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">smart_toy</span>
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">share</span>
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">visibility</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div onClick={() => handleItemClick(3)} className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg dark:hover:shadow-primary/5 transition-all duration-300 group relative cursor-pointer">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0 text-orange-500">
                            <span className="material-symbols-outlined">slideshow</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate mb-1">UX_Design_Principles.pptx</h4>
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-2 mb-3">
                                <span>Design • Slides</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <span>12.1 MB</span>
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">Processing</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Presentation</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">Edited Oct 20, 2023</span>
                        <div className="flex space-x-2">
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors cursor-not-allowed opacity-50">
                                <span className="material-symbols-outlined text-sm">smart_toy</span>
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">share</span>
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">visibility</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div onClick={() => handleItemClick(4)} className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg dark:hover:shadow-primary/5 transition-all duration-300 group relative cursor-pointer">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0 text-red-500">
                            <span className="material-symbols-outlined">picture_as_pdf</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate mb-1">Advanced_Calculus_Notes.pdf</h4>
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-2 mb-3">
                                <span>Math • Semester 2</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <span>5.2 MB</span>
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">Analyzed</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Notes</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">Edited Oct 18, 2023</span>
                        <div className="flex space-x-2">
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">smart_toy</span>
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">share</span>
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">visibility</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div onClick={() => handleItemClick(5)} className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg dark:hover:shadow-primary/5 transition-all duration-300 group relative cursor-pointer">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0 text-purple-500">
                            <span className="material-symbols-outlined">image</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate mb-1">Architecture_Diagram_V3.png</h4>
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-2 mb-3">
                                <span>System Design • Project</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <span>1.8 MB</span>
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">Failed</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Image</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">Edited Oct 15, 2023</span>
                        <div className="flex space-x-2">
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors cursor-not-allowed opacity-50">
                                <span className="material-symbols-outlined text-sm">smart_toy</span>
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">share</span>
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">visibility</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div onClick={() => handleItemClick(6)} className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg dark:hover:shadow-primary/5 transition-all duration-300 group relative cursor-pointer">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                            <span className="material-symbols-outlined">more_vert</span>
                        </button>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 text-green-500">
                            <span className="material-symbols-outlined">table_chart</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate mb-1">Survey_Results_Data.xlsx</h4>
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-2 mb-3">
                                <span>Marketing • Research</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <span>420 KB</span>
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">Analyzed</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Spreadsheet</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">Edited Oct 12, 2023</span>
                        <div className="flex space-x-2">
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">smart_toy</span>
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">share</span>
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">visibility</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-medium text-gray-900 dark:text-white">1</span> to <span className="font-medium text-gray-900 dark:text-white">6</span> of <span className="font-medium text-gray-900 dark:text-white">142</span> results
                </div>
                <div className="flex space-x-2">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">Previous</button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-600 transition-colors">Next</button>
                </div>
            </div>
        </main>
    );
};

export default Library;
