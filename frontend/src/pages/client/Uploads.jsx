import { Link } from 'react-router-dom';

const Uploads = () => {
    return (
        <main className="flex-1 h-full overflow-y-auto bg-background-light dark:bg-background-dark p-6 md:p-10 transition-colors duration-200">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] dark:text-white mb-2 tracking-tight">Your Uploads</h2>
                    <p className="text-[#64748b] dark:text-gray-400 text-lg max-w-2xl">
                        Manage your documents, track AI processing status, and organize your study materials in one place.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-64">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined">search</span>
                        </span>
                        <input className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] text-[#0f172a] dark:text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600" placeholder="Search files..." type="text" />
                    </div>
                    <button className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] p-2.5 rounded-lg text-[#64748b] dark:text-gray-400 hover:text-primary hover:border-primary dark:hover:border-primary transition-all">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                    <button className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] p-2.5 rounded-lg text-[#64748b] dark:text-gray-400 hover:text-primary hover:border-primary dark:hover:border-primary transition-all">
                        <span className="material-symbols-outlined">grid_view</span>
                    </button>
                </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-gray-200 dark:border-[#334155] shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[#64748b] dark:text-gray-400 text-sm font-medium mb-1">Total Storage</p>
                            <h3 className="text-2xl font-bold text-[#0f172a] dark:text-white">1.2 GB <span className="text-sm font-normal text-gray-500">/ 5 GB</span></h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined">cloud</span>
                        </div>
                    </div>
                    <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[24%] rounded-full"></div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-gray-200 dark:border-[#334155] shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[#64748b] dark:text-gray-400 text-sm font-medium mb-1">Documents Processed</p>
                            <h3 className="text-2xl font-bold text-[#0f172a] dark:text-white">128</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                            <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        +12 this week
                    </div>
                </div>
                <div className="bg-gradient-to-br from-primary to-blue-600 p-6 rounded-xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden group cursor-pointer">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
                    <div className="relative z-10">
                        <h3 class="font-bold text-lg mb-1">New Upload</h3>
                        <p className="text-blue-100 text-sm">Drag & drop files here or click to browse.</p>
                    </div>
                    <div className="relative z-10 mt-4 flex justify-end">
                        <span className="material-symbols-outlined text-3xl opacity-80 group-hover:scale-110 transition-transform">add_circle_outline</span>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-[#334155] shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#334155]">
                    <h3 className="font-bold text-lg text-[#0f172a] dark:text-white">Recent Files</h3>
                    <div className="flex gap-2">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-[#64748b] dark:text-gray-400">Sort by: Date</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 text-[#64748b] dark:text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold w-12">
                                    <input className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-transparent" type="checkbox" />
                                </th>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Type</th>
                                <th className="px-6 py-4 font-semibold">Size</th>
                                <th className="px-6 py-4 font-semibold">Date Uploaded</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-[#334155]">
                            <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <input className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-transparent" type="checkbox" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                                            <span className="material-symbols-outlined">picture_as_pdf</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#0f172a] dark:text-white text-sm">CS101_Intro_to_JS_Week1.pdf</p>
                                            <p className="text-xs text-[#64748b] dark:text-gray-500">Computer Science • Week 1</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#64748b] dark:text-gray-400">PDF</td>
                                <td className="px-6 py-4 text-sm text-[#64748b] dark:text-gray-400">2.4 MB</td>
                                <td className="px-6 py-4 text-sm text-[#64748b] dark:text-gray-400">Oct 24, 2023</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Processed
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors" title="View">
                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Edit">
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Delete">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <input className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-transparent" type="checkbox" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                                            <span className="material-symbols-outlined">description</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#0f172a] dark:text-white text-sm">React_Hooks_Cheatsheet.docx</p>
                                            <p className="text-xs text-[#64748b] dark:text-gray-500">Web Dev • Resources</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#64748b] dark:text-gray-400">DOCX</td>
                                <td className="px-6 py-4 text-sm text-[#64748b] dark:text-gray-400">845 KB</td>
                                <td className="px-6 py-4 text-sm text-[#64748b] dark:text-gray-400">Oct 22, 2023</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Processed
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <input className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-transparent" type="checkbox" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                                            <span className="material-symbols-outlined">slideshow</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#0f172a] dark:text-white text-sm">UX_Design_Principles_Lecture.pptx</p>
                                            <p className="text-xs text-[#64748b] dark:text-gray-500">Design • Slides</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#64748b] dark:text-gray-400">PPTX</td>
                                <td className="px-6 py-4 text-sm text-[#64748b] dark:text-gray-400">12.1 MB</td>
                                <td className="px-6 py-4 text-sm text-[#64748b] dark:text-gray-400">Oct 20, 2023</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 animate-pulse">
                                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                        Analyzing
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <input className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-transparent" type="checkbox" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                                            <span className="material-symbols-outlined">picture_as_pdf</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#0f172a] dark:text-white text-sm">Advanced_Algorithms_Notes.pdf</p>
                                            <p className="text-xs text-[#64748b] dark:text-gray-500">Math • Personal</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#64748b] dark:text-gray-400">PDF</td>
                                <td className="px-6 py-4 text-sm text-[#64748b] dark:text-gray-400">4.5 MB</td>
                                <td className="px-6 py-4 text-sm text-[#64748b] dark:text-gray-400">Oct 18, 2023</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                        <span className="material-symbols-outlined text-[10px]">error_outline</span>
                                        Failed
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">replay</span>
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 flex gap-4">
                    <div className="text-primary mt-1">
                        <span className="material-symbols-outlined">lightbulb</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[#0f172a] dark:text-white mb-1">Did you know?</h4>
                        <p className="text-sm text-[#64748b] dark:text-gray-400">You can upload multiple files at once. SmartShare AI will automatically categorize them based on content.</p>
                    </div>
                </div>
                <div className="p-5 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20 flex gap-4">
                    <div className="text-purple-600 dark:text-purple-400 mt-1">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[#0f172a] dark:text-white mb-1">Study Groups</h4>
                        <p className="text-sm text-[#64748b] dark:text-gray-400">Share these documents directly with your study groups to collaborate on notes and summaries.</p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Uploads;
