import { Link } from 'react-router-dom';

const StudyGroups = () => {
    return (
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto h-screen">
            <header className="mb-10 max-w-6xl mx-auto">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Study Groups</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">Connect with friends privately or join public communities to master your subjects.</p>
                    </div>
                    <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors flex items-center gap-2 text-sm shadow-lg shadow-blue-500/20">
                        <span className="material-symbols-outlined">add</span>
                        Create New Group
                    </button>
                </div>
                <div className="mt-8 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400">search</span>
                        </span>
                        <input className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-sm" placeholder="Search for private groups or public forums..." type="text" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium whitespace-nowrap">All</button>
                        <button className="px-4 py-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 rounded-full text-sm font-medium whitespace-nowrap transition-colors">Private</button>
                        <button className="px-4 py-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 rounded-full text-sm font-medium whitespace-nowrap transition-colors">Public</button>
                        <button className="px-4 py-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 rounded-full text-sm font-medium whitespace-nowrap transition-colors">Pending Invites</button>
                    </div>
                </div>
            </header>
            <div className="max-w-6xl mx-auto space-y-12">
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-indigo-400 text-base">lock</span>
                            My Private Study Groups
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="group bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-700/50 p-5 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-primary/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3">
                                <span className="material-symbols-outlined text-gray-400 hover:text-white cursor-pointer text-sm">more_vert</span>
                            </div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                                    <span className="material-symbols-outlined">school</span>
                                </div>
                                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 uppercase tracking-wide">
                                    PRIVATE
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">Finals Prep Squad</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">Just for us to share notes and prepare for the Chem and Calc finals.</p>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center -space-x-2">
                                    <img alt="Member" className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1e293b]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqgeg8Lc5u51W-7GLSuPjCWOYXNJVY1icRI8nO2sAiquTpw6atSkMSblSnDsRRdpej9w-Ns4ox1Ns69kh7HHLpO19m9E6nSx_qfpq_x7EpLsnaoZ2MvpF-wuyMpk7aLlcLr6Ed6OZ5f4YgzlPt9MBDpWKkfdh-ylqaOaovuTfZNJMMOhtsHrLtaRfZFLXXv58dggedxS2vguzXaE5njnqdcdXOIufD4NIZ4Jj-SK7GTGseJt7M2hjksYlS-PzgGrxdEFlpp4VHCiI" />
                                    <img alt="Member" className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1e293b]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD82irdNEp5N344qHUEHLbEZTgTk8r-xcc7MrGjoW6xrxcS1S_tny_Xy4-bS4hTaWFXtS3R0miFRy8ZIhiHAhqL-_9xAeCuSGfayX4aHF1v_zCTx9ZUzMRgBkMl8niIwk-ejeK-tcybOHMpw1mZE0lWFDs0jU5hDjb9QgYsCk-UCdCOlDGv6OACA6zUKj49SKzfNyEW5ACPOJlpJutOnp6XnBr1mozUhEYu42_N2rsN-NrtifXNiYscTQ47lu5bbgtCzVmJWYTijS4" />
                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1e293b] bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                                        +3
                                    </div>
                                </div>
                                <button className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1 bg-primary/10 px-2 py-1 rounded hover:bg-primary/20 transition-colors">
                                    <span className="material-symbols-outlined text-sm">person_add</span> Invite
                                </button>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-sm text-green-400">fiber_manual_record</span>
                                    Online now
                                </div>
                                <button className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center">
                                    Open Chat <span className="material-symbols-outlined text-sm ml-1">chat</span>
                                </button>
                            </div>
                        </div>
                        <div className="group bg-white dark:bg-[#1e293b] rounded-xl border border-yellow-500/30 dark:border-yellow-500/30 p-5 hover:border-yellow-500/50 dark:hover:border-yellow-500/50 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-yellow-500/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3">
                                <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold px-2 py-1 rounded border border-yellow-200 dark:border-yellow-800 uppercase tracking-wide">Pending Invite</span>
                            </div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-lg">
                                    <span className="material-symbols-outlined">groups</span>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Dorm Study Circle</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">Invited by <span className="text-white font-medium">Sarah Miller</span>. "Hey, join us for late night study sessions!"</p>
                            <div className="flex items-center gap-2 mt-6">
                                <button className="flex-1 bg-primary text-white text-sm font-medium py-2 rounded-lg hover:bg-primary-hover transition-colors">
                                    Accept
                                </button>
                                <button className="flex-1 bg-transparent border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-500 text-base">public</span>
                            Public Study Groups &amp; Forums
                        </h2>
                        <a className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1" href="#">Browse Directory <span className="material-symbols-outlined text-sm">arrow_forward</span></a>
                    </div>
                    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
                        <div className="p-5 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex-shrink-0 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined text-3xl">deployed_code</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">React &amp; Next.js Developers</h3>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 uppercase">Open Join</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase">CS</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 max-w-2xl">A large community for frontend developers sharing resources, hooks, and debugging tips. Weekly coding challenges.</p>
                                <div className="flex items-center gap-6 text-xs text-gray-400">
                                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">group</span> 1,240 Members</span>
                                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">forum</span> 85 Active Topics</span>
                                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-green-500">check_circle</span> Official</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 w-full md:w-auto mt-4 md:mt-0">
                                <button className="w-full md:w-auto px-5 py-2 bg-primary text-white hover:bg-primary-hover rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
                                    Join Forum
                                </button>
                                <span className="text-[10px] text-gray-400">Instant Access</span>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className="w-16 h-16 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex-shrink-0 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                <span className="material-symbols-outlined text-3xl">history_edu</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Advanced European History</h3>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 uppercase">Approval Required</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase">History</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 max-w-2xl">Focused discussion for thesis students. Topic owner reviews all join requests to ensure academic focus.</p>
                                <div className="flex items-center gap-6 text-xs text-gray-400">
                                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">group</span> 28 Members</span>
                                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">admin_panel_settings</span> Moderated</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 w-full md:w-auto mt-4 md:mt-0">
                                <button className="w-full md:w-auto px-5 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors">
                                    Request to Join
                                </button>
                                <span className="text-[10px] text-gray-400">Admin Approval</span>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col md:flex-row items-start md:items-center gap-6 bg-blue-50/50 dark:bg-blue-900/5 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors border-l-4 border-l-primary">
                            <div className="w-16 h-16 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex-shrink-0 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                <span className="material-symbols-outlined text-3xl">psychology</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Psych 101 Study Buddies</h3>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase">MEMBER</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase">Science</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 max-w-2xl">Flashcards sharing and quiz prep for midterms. You are a member of this public forum.</p>
                                <div className="flex items-center gap-6 text-xs text-gray-400">
                                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">group</span> 156 Members</span>
                                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">notifications_active</span> New Posts</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 w-full md:w-auto mt-4 md:mt-0">
                                <button className="w-full md:w-auto px-5 py-2 bg-surface-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
                                    Enter Forum
                                </button>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors opacity-75">
                            <div className="w-16 h-16 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex-shrink-0 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <span className="material-symbols-outlined text-3xl">design_services</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">UI/UX Design Crits</h3>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 uppercase">Request Pending</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 max-w-2xl">Constructive feedback sessions on portfolios. Waiting for moderator approval.</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 w-full md:w-auto mt-4 md:mt-0">
                                <button className="w-full md:w-auto px-5 py-2 border border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed rounded-lg text-sm font-medium transition-colors" disabled>
                                    Request Sent
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-primary opacity-20 rounded-full blur-2xl"></div>
                    <div className="relative z-10 flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                            <span className="material-symbols-outlined text-white text-2xl">auto_awesome</span>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">AI Group Matcher</h3>
                            <p className="text-blue-100 text-sm max-w-md">Not sure where you fit in? Let our AI analyze your learning style and roadmaps to suggest the perfect study group.</p>
                        </div>
                    </div>
                    <button className="relative z-10 whitespace-nowrap px-6 py-3 bg-white text-blue-900 font-bold rounded-lg shadow-lg hover:bg-blue-50 transition-colors">
                        Find My Match
                    </button>
                </div>
                <div className="h-8"></div>
            </div>
        </main>
    )
}

export default StudyGroups;
