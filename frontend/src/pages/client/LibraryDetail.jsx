import { useState } from 'react';

const LibraryDetail = () => {
    return (
        <div className="flex flex-1 h-full overflow-hidden">
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative bg-background-light dark:bg-background-dark">
                {/* Document Header Area */}
                <header className="bg-white dark:bg-[#151c27] border-b border-slate-200 dark:border-slate-800 z-10 shrink-0">
                    {/* Breadcrumbs & Meta */}
                    <div className="px-6 pt-4 pb-2">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                            <a className="hover:text-primary transition-colors" href="#">Home</a>
                            <span className="text-slate-300 dark:text-slate-600">/</span>
                            <a className="hover:text-primary transition-colors" href="#">Biology</a>
                            <span className="text-slate-300 dark:text-slate-600">/</span>
                            <span className="text-slate-900 dark:text-slate-100 font-medium">Intro to Genetics.pdf</span>
                        </div>
                        <div className="flex flex-wrap justify-between items-end gap-4">
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Intro to Genetics.pdf</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last edited 2 hours ago by Dr. Richardson</p>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium transition-colors">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>share</span>
                                    Share
                                </button>
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-blue-600 text-sm font-medium shadow-sm shadow-blue-500/30 transition-colors">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Toolbar */}
                    <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 overflow-x-auto">
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-lg">
                            <button className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-primary hover:shadow-sm transition-all">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
                            </button>
                            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
                            <button className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>remove</span>
                            </button>
                            <span className="px-2 text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[3ch] text-center">100%</span>
                            <button className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Print">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>print</span>
                            </button>
                            <button className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Download">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                            </button>
                        </div>
                    </div>
                </header>
                {/* Scrollable Document Viewport */}
                <div className="flex-1 overflow-y-auto bg-slate-100/50 dark:bg-[#0d121c] p-8 flex justify-center relative">
                    {/* Background pattern for depth */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" data-alt="Abstract dot pattern background" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                    </div>
                    {/* The Document Page */}
                    <div className="relative w-full max-w-[850px] min-h-[1000px] bg-white dark:bg-[#1e1e1e] shadow-lg dark:shadow-black/40 rounded-sm mb-10 ring-1 ring-slate-900/5 dark:ring-white/5">
                        <div className="p-12 md:p-16 flex flex-col gap-6 text-slate-800 dark:text-slate-200 leading-relaxed text-lg">
                            <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">Introduction to Genetics</h1>
                            <p className="text-justify">
                                Genetics is the study of genes, genetic variation, and heredity in organisms. It is an important branch in biology because heredity is vital to organisms' evolution. Gregor Mendel, a Moravian Augustinian friar working in the 19th century in Brno, was the first to study genetics scientifically. Mendel studied "trait inheritance", patterns in the way traits are handed down from parents to offspring. He observed that organisms (pea plants) inherit traits by way of discrete "units of inheritance". This term, still used today, is a somewhat ambiguous definition of what is referred to as a gene.
                            </p>
                            <div className="my-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-primary">
                                <h3 className="text-lg font-bold text-primary mb-2">Key Concept: Alleles</h3>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    An allele is a variant form of a given gene, meaning it is one of two or more versions of a known mutation at the same place on a chromosome.
                                </p>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">Mendelian Inheritance</h2>
                            <p className="text-justify">
                                Trait inheritance and molecular inheritance mechanisms of genes are still primary principles of genetics in the 21st century, but modern genetics has expanded beyond inheritance to studying the function and behavior of genes. Gene structure and function, variation, and distribution are studied within the context of the cell, the organism (e.g. dominance), and within the context of a population. Genetics has given rise to a number of subfields, including molecular genetics, epigenetics and population genetics. Organisms studied within the broad field span the domains of life (archaea, bacteria, and eukarya).
                            </p>
                            <p className="text-justify">
                                Genetic processes work in combination with an organism's environment and experiences to influence development and behavior, often referred to as nature versus nurture. The intracellular or extracellular environment of a living cell or organism may switch gene transcription on or off. A classic example is two seeds of genetically identical corn, one placed in a temperate climate and one in an arid climate (lacking sufficient waterfall or rain). While the average height of the two corn stalks may be genetically determined to be equal, the one in the arid climate only grows to half the height of the one in the temperate climate due to lack of water and nutrients in its environment.
                            </p>
                            {/* Placeholder for image in document */}
                            <div className="my-8 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-video relative group">
                                <div className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity" data-alt="DNA double helix structure illustration" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBdj81z3jo4ythhlIxQ8tedbIBm1A_JuM-yvCA6K_ZKiU9sg2EflN13Hx5pqnfAy5o3HeXnAkWJ3paZk-691wXDnpXXHiDo6U_SXYtuP3oad_NfRGMsZpvBM-HRERvP3a-drje4zVFYSadPhkVzhH_hmgLoYuhjgp5wSVq13QkzvGU-HunjXFdmG29DZIDb0oSlMxGjdVHb2KpcXHG8i9IhDcQjjNYDlh33kmE1300JlB8x62diYBVv3-b9kUDUtUrEB6kXw2XD5CM')" }}>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                    <span className="text-white text-sm font-medium">Fig 1.1 - Double Helix Structure</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* Right AI Sidebar */}
            <aside className="w-96 bg-white dark:bg-[#151c27] border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 shadow-xl z-20">
                {/* AI Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151c27]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary animate-pulse">auto_awesome</span>
                            <h2 className="font-bold text-slate-900 dark:text-white">AI Companion</h2>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                    </div>
                    {/* Segmented Control Tabs */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <button className="flex-1 py-1.5 px-3 text-xs font-medium rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Summary</button>
                        <button className="flex-1 py-1.5 px-3 text-xs font-bold rounded-md bg-white dark:bg-slate-700 text-primary shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">Chat</button>
                        <button className="flex-1 py-1.5 px-3 text-xs font-medium rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Key Terms</button>
                    </div>
                </div>
                {/* Chat Content Area */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/50 dark:bg-[#111620]">
                    {/* Welcome Message (AI) */}
                    <div className="flex gap-3 max-w-[90%]">
                        <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                            <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">StudyAI</span>
                            <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-800 dark:text-slate-200">
                                <p>Hi Sarah! I've analyzed <span className="font-semibold text-primary">Intro to Genetics.pdf</span>. Ask me anything or request a quiz.</p>
                            </div>
                        </div>
                    </div>
                    {/* Suggestion Chips */}
                    <div className="flex flex-wrap gap-2 ml-11">
                        <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors">Summarize this page</button>
                        <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors">Explain "Alleles"</button>
                    </div>
                    {/* Date Separator */}
                    <div className="flex items-center gap-2 my-2">
                        <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium tracking-wider">Today, 2:40 PM</span>
                        <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                    </div>
                    {/* User Message */}
                    <div className="flex flex-row-reverse gap-3 max-w-[90%] self-end">
                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                            <img alt="User" className="w-full h-full object-cover" data-alt="User Avatar Small" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjicDN8OKRwwj-q5WvjK2YQnq-h8Wp5lJ8HuKSb9kR8bYT-s7LWkhB7ich-e2-EdVO6mA4lz_hXrxd-tgjHS2HkcmVDAgD54fLBnGHVUv4qbGzZL9AHdyHPo-4uh6aAnrFXkwWcVXfgm411vsy21t_-tbwtwFrioWPpklxL7MFRU6zpiiCA4FaHd0wBh6vKe3lXgYDtVFNfqauOK8aSJFxfOO6lES4O638va9tOedVjnh7PhSS9NOWGnRJhQziKKU4LNcDi1fZRoc" />
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                            <div className="p-3 bg-primary text-white rounded-2xl rounded-tr-none shadow-sm text-sm">
                                <p>What is the difference between Phenotype and Genotype?</p>
                            </div>
                        </div>
                    </div>
                    {/* AI Response */}
                    <div className="flex gap-3 max-w-[90%]">
                        <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                            <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">StudyAI</span>
                            <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-800 dark:text-slate-200">
                                <p className="mb-2">Here is the difference based on the document:</p>
                                <ul className="list-disc pl-4 space-y-1 mb-2 marker:text-primary">
                                    <li><span className="font-bold">Genotype</span>: The genetic constitution of an individual organism. It is the set of genes in our DNA which is responsible for a particular trait.</li>
                                    <li><span className="font-bold">Phenotype</span>: The physical expression, or characteristics, of that trait (e.g., blue eyes).</li>
                                </ul>
                                <p>Would you like examples?</p>
                            </div>
                        </div>
                    </div>
                    {/* Extracted Key Terms (Contextual) */}
                    <div className="ml-11 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Key Terms Found</p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-300 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors">DNA</span>
                            <span className="px-2 py-1 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-300 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors">Trait</span>
                        </div>
                    </div>
                </div>
                {/* Chat Input Footer */}
                <div className="p-4 bg-white dark:bg-[#151c27] border-t border-slate-200 dark:border-slate-800">
                    <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors shrink-0">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                        </button>
                        <textarea className="w-full bg-transparent border-0 p-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 resize-none max-h-32 min-h-[40px] leading-relaxed" placeholder="Ask a question..." rows="1"></textarea>
                        <button className="p-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shrink-0 shadow-sm">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-slate-400 mt-2">AI can make mistakes. Check important info.</p>
                </div>
            </aside>
        </div>
    );
};

export default LibraryDetail;
