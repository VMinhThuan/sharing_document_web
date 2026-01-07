import { NavLink } from 'react-router-dom';

const ClientSidebar = () => {
  return (
    <aside className="w-72 shrink-0 flex flex-col border-r border-[#e6e8eb] dark:border-gray-800 bg-white dark:bg-[#1a202c] h-full overflow-y-auto hidden lg:flex">
      <div className="p-6 flex flex-col h-full justify-between">
        <div className="flex flex-col gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex items-center justify-center rounded-xl size-10 text-primary">
              <span className="material-symbols-outlined">smart_toy</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-none tracking-tight">SmartShare AI</h1>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium pt-1">Student Platform</p>
            </div>
          </div>
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <NavLink 
              to="/" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
              <span className="text-sm font-semibold">Home</span>
            </NavLink>
            <NavLink 
              to="/library" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <span className="material-symbols-outlined">menu_book</span>
              <span className="text-sm font-medium">My Library</span>
            </NavLink>
            <NavLink 
              to="/roadmap" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
              <span className="text-sm font-medium">Roadmaps</span>
            </NavLink>
            <NavLink 
              to="/uploads" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <span className="material-symbols-outlined">cloud_upload</span>
              <span className="text-sm font-medium">Uploads</span>
            </NavLink>
            <NavLink 
              to="/favorites" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <span className="material-symbols-outlined">favorite</span>
              <span className="text-sm font-medium">Favorites</span>
            </NavLink>
            <NavLink 
              to="/study-groups" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <span className="material-symbols-outlined">groups</span>
              <span className="text-sm font-medium">Study Groups</span>
            </NavLink>
          </nav>
          {/* Divider */}
          <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
          {/* Secondary Links */}
          <div className="flex flex-col gap-2">
            <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Settings</p>
            <NavLink 
              to="/preferences" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm font-medium">Preferences</span>
            </NavLink>
            <NavLink 
              to="/help-center" 
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <span className="material-symbols-outlined">help</span>
              <span className="text-sm font-medium">Help Center</span>
            </NavLink>
          </div>
        </div>
        {/* CTA & User Profile */}
        <div className="flex flex-col gap-4">

          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-gray-100 dark:ring-gray-700" 
              data-alt="Portrait of Alex, a student user" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAyywXwl8gB4T9Bg9qX9-leZ11D89IRurmjopEmaVLe8fb1_-XmfW1qUAPN3KTlfYeZLGrh9uOinAWO3tx9Cng6KTAzRaGPZO6ssq3XLlkWshY4TdFL5sT7304FdXjnyxvK-TQaIRgl4mIXVSqVdP7URgiFAnEZwYQsjE2ChCLfk5RkWy9766mMFa_vVjnxX4UQP02KzTlFdpcxCUh_GQw3qsS1e_soqV_xAd8Us7trwMTUApJxzEI99yqJ4z0-NIcLKFutPvmtQkg")' }}
            ></div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-bold truncate dark:text-white">Alex Johnson</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Pro Student Plan</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default ClientSidebar;
