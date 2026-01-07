import { Link } from 'react-router-dom';

const Roadmap = () => {
  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Top Header Mobile Only (Usually hidden on desktop but good for responsive completeness) */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] border-b border-slate-200 dark:border-slate-800">
        <div className="font-bold text-lg">SmartDocs</div>
        <button className="text-gray-600 dark:text-gray-300">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>
      {/* Scrollable Canvas */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-10">
          {/* Hero / Input Section */}
          <section className="flex flex-col gap-6 animate-fade-in-down">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                AI Learning Generator
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
                Turn your documents into a structured learning path. Tell us what you want to master today.
              </p>
            </div>
            {/* Input Card */}
            <div className="bg-white dark:bg-[#1e293b] p-2 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 ring-1 ring-slate-100 dark:ring-slate-800">
              <div className="flex items-stretch gap-2">
                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">auto_awesome</span>
                  </div>
                  <input className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-[#151e2e] border-none rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 text-base md:text-lg transition-all" placeholder="e.g., I want to learn React Hooks from my lecture notes..." type="text" defaultValue="Learn React Components & Props" />
                </div>
                <button className="bg-primary hover:bg-blue-600 text-white px-6 md:px-8 rounded-lg font-bold text-base md:text-lg transition-colors flex items-center gap-2">
                  <span>Generate</span>
                  <span className="material-symbols-outlined text-[20px] hidden md:inline-block">arrow_forward</span>
                </button>
              </div>
            </div>
            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-400 py-1.5 px-2">Popular:</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[16px]">code</span> React
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[16px]">analytics</span> Data Science
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[16px]">brush</span> UX Design
              </button>
            </div>
          </section>
          <hr className="border-slate-200 dark:border-slate-800" />
          {/* Generated Roadmap Section */}
          <section className="flex flex-col gap-6">
            {/* Roadmap Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Roadmap: React Mastery
                  <span className="px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wide">Active</span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Generated from 4 documents • Est. 12 hours</p>
              </div>
              {/* Progress */}
              <div className="w-full md:w-64">
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-primary">35%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
            {/* Timeline Visualization */}
            <div className="relative pl-4 md:pl-8 py-4">
              {/* Vertical Line */}
              <div className="absolute left-[27px] md:left-[43px] top-4 bottom-10 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
              {/* Step 1: Completed */}
              <div className="relative flex gap-6 md:gap-10 mb-12 group">
                {/* Node Icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="size-6 md:size-8 rounded-full bg-primary flex items-center justify-center ring-4 ring-background-light dark:ring-background-dark">
                    <span className="material-symbols-outlined text-white text-sm md:text-base font-bold">check</span>
                  </div>
                </div>
                {/* Content Card */}
                <div className="flex-1 bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer opacity-75 hover:opacity-100">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Foundations: JavaScript & ES6</h3>
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                    Review key JavaScript concepts essential for React, including Arrow Functions, Destructuring, and Modules.
                  </p>
                  {/* Attached Doc */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#151e2e] rounded-lg border border-slate-100 dark:border-slate-800/50">
                    <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded p-1.5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">CS101_Intro_to_JS_Week1.pdf</span>
                      <span className="text-xs text-gray-500">Pages 12-45 • 15 mins read</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Step 2: Active */}
              <div className="relative flex gap-6 md:gap-10 mb-12">
                {/* Node Icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="size-6 md:size-8 rounded-full bg-white dark:bg-[#1e293b] border-4 border-primary flex items-center justify-center ring-4 ring-background-light dark:ring-background-dark shadow-[0_0_0_4px_rgba(59,128,247,0.2)]">
                    <div className="size-2 md:size-2.5 rounded-full bg-primary animate-pulse"></div>
                  </div>
                </div>
                {/* Content Card */}
                <div className="flex-1 bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-primary/30 shadow-[0_4px_20px_-4px_rgba(59,128,247,0.15)] ring-1 ring-primary/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white text-primary">Components & Props</h3>
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold uppercase">Current</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                    Understanding the building blocks of React. Learn how to create functional components and pass data via props.
                  </p>
                  {/* Attached Docs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#151e2e] rounded-lg border border-slate-100 dark:border-slate-800/50 hover:border-primary/30 cursor-pointer transition-colors group">
                      <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded p-1.5 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">description</span>
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">React_Basics_Lecture.docx</span>
                        <span className="text-xs text-gray-500">Summary & Notes</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#151e2e] rounded-lg border border-slate-100 dark:border-slate-800/50 hover:border-primary/30 cursor-pointer transition-colors group">
                      <div className="bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded p-1.5 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">slideshow</span>
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">Component_Tree_Diagram.ppt</span>
                        <span className="text-xs text-gray-500">Slide 4-10</span>
                      </div>
                    </div>
                  </div>
                  {/* Action Footer */}
                  <div className="mt-4 flex gap-3">
                    <button className="flex-1 bg-primary hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors">Start Lesson</button>
                    <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-colors" title="Ask AI about this step">
                      <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Step 3: Locked/Upcoming */}
              <div className="relative flex gap-6 md:gap-10 mb-12 opacity-60">
                {/* Node Icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="size-6 md:size-8 rounded-full bg-white dark:bg-[#1e293b] border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center ring-4 ring-background-light dark:ring-background-dark">
                    <span className="material-symbols-outlined text-gray-400 text-xs md:text-sm">lock</span>
                  </div>
                </div>
                {/* Content Card */}
                <div className="flex-1 bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">State Management & Hooks</h3>
                    <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-gray-500 text-xs font-bold uppercase">Locked</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mb-4 leading-relaxed">
                    Deep dive into useState and useEffect. Managing complex state logic.
                  </p>
                  <div className="flex items-center gap-3 p-2 rounded border border-transparent border-dashed bg-slate-50 dark:bg-[#151e2e]">
                    <span className="material-symbols-outlined text-gray-400">folder_open</span>
                    <span className="text-xs text-gray-400 italic">Content locked until previous step is complete</span>
                  </div>
                </div>
              </div>
              {/* Step 4: Locked/Upcoming */}
              <div className="relative flex gap-6 md:gap-10 opacity-60">
                {/* Node Icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="size-6 md:size-8 rounded-full bg-white dark:bg-[#1e293b] border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center ring-4 ring-background-light dark:ring-background-dark">
                    <span className="material-symbols-outlined text-gray-400 text-xs md:text-sm">lock</span>
                  </div>
                </div>
                {/* Content Card */}
                <div className="flex-1 bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">Final Project: Task App</h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-500 text-sm leading-relaxed">
                    Apply all concepts to build a functioning task management application.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* Spacer for scrolling */}
          <div className="h-20"></div>
        </div>
      </div>
    </main>
  );
};

export default Roadmap;
