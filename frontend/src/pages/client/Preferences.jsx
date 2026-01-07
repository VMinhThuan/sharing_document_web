import { Link } from 'react-router-dom';

const Preferences = () => {
    return (
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
            <header className="h-16 flex items-center justify-between px-8 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
                <h2 className="text-xl font-bold">Settings &amp; Preferences</h2>
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
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-text-light dark:text-white">Profile &amp; Account</h3>
                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Manage your personal information and login details.</p>
                            </div>
                            <button className="text-primary text-sm font-medium hover:underline">Edit Profile</button>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6 shadow-sm">
                            <div className="flex items-start space-x-6">
                                <div className="relative group cursor-pointer">
                                    <img alt="Profile Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-background-light dark:border-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRjFs4IfGNWzQW9ngdOJKUgAePtNzN-k0y5eLwoz0MFl8p8POZBQUtpMUld8qfeeGHmwDQ-KPCqbXWqC1mEotHfjD2DGxxBzir4avjtDUsF7BrQvCzLSXLFsYL-Ije6ZuITsEdSbe6GTsm-fBDL0TBO0Mj_g4-p5RNPq0EBvkIDQP4tSt0Lq9dWwO5QI07XLX8MzjTXunmusE22leDZd1rTqjMAhQv2YFEh5v86hAWKm6hTGddZMO_uN9tLrlUW64iNHDXWJWTjpE" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-white">edit</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Display Name</label>
                                            <input className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" type="text" defaultValue="Alex Johnson" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Email Address</label>
                                            <input className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none" type="email" defaultValue="alex.j@university.edu" />
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            Pro Student Plan Active
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <hr className="border-border-light dark:border-border-dark" />
                    <section>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-text-light dark:text-white">Interface &amp; AI</h3>
                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Customize how SmartShare looks and behaves.</p>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm">
                            <div className="p-5 flex items-center justify-between border-b border-border-light dark:border-border-dark">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                        <span className="material-symbols-outlined">palette</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Theme Preference</p>
                                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Select your preferred color scheme</p>
                                    </div>
                                </div>
                                <div className="flex bg-background-light dark:bg-background-dark p-1 rounded-lg border border-border-light dark:border-border-dark">
                                    <button className="px-3 py-1.5 rounded-md text-xs font-medium text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark">Light</button>
                                    <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-surface-light dark:bg-primary text-primary dark:text-white shadow-sm">Dark</button>
                                    <button className="px-3 py-1.5 rounded-md text-xs font-medium text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark">System</button>
                                </div>
                            </div>
                            <div className="p-5 flex items-center justify-between border-b border-border-light dark:border-border-dark">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                                        <span className="material-symbols-outlined">auto_awesome</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">AI Autocomplete</p>
                                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Suggest content while creating roadmaps</p>
                                    </div>
                                </div>
                                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:border-primary border-gray-300 dark:border-gray-600" id="ai-toggle" name="toggle" type="checkbox" />
                                    <label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" htmlFor="ai-toggle"></label>
                                </div>
                            </div>
                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg">
                                        <span className="material-symbols-outlined">view_sidebar</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Compact Sidebar</p>
                                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Hide labels and show only icons</p>
                                    </div>
                                </div>
                                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:border-primary border-gray-300 dark:border-gray-600" id="sidebar-toggle" name="toggle" type="checkbox" />
                                    <label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" htmlFor="sidebar-toggle"></label>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-text-light dark:text-white">Notifications</h3>
                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Manage how you receive updates.</p>
                        </div>
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6 shadow-sm">
                            <div className="space-y-4">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <span className="flex-1">
                                        <span className="block font-medium">Study Group Updates</span>
                                        <span className="block text-xs text-text-muted-light dark:text-text-muted-dark">Get notified when someone posts in your groups</span>
                                    </span>
                                    <input defaultChecked className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 bg-background-light dark:bg-background-dark dark:border-gray-600 focus:ring-primary" type="checkbox" />
                                </label>
                                <hr className="border-border-light dark:border-border-dark" />
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <span className="flex-1">
                                        <span className="block font-medium">Roadmap Progress</span>
                                        <span className="block text-xs text-text-muted-light dark:text-text-muted-dark">Weekly summary of your learning progress</span>
                                    </span>
                                    <input defaultChecked className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 bg-background-light dark:bg-background-dark dark:border-gray-600 focus:ring-primary" type="checkbox" />
                                </label>
                                <hr className="border-border-light dark:border-border-dark" />
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <span className="flex-1">
                                        <span className="block font-medium">Marketing Emails</span>
                                        <span className="block text-xs text-text-muted-light dark:text-text-muted-dark">News about features and promotions</span>
                                    </span>
                                    <input className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 bg-background-light dark:bg-background-dark dark:border-gray-600 focus:ring-primary" type="checkbox" />
                                </label>
                            </div>
                        </div>
                    </section>

                    <div className="fixed bottom-8 right-12 z-20 flex space-x-4">
                        <button className="px-6 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancel</button>
                        <button className="px-6 py-3 bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:bg-primary-hover transition-colors font-medium flex items-center space-x-2">
                            <span className="material-symbols-outlined text-sm">save</span>
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Preferences;
