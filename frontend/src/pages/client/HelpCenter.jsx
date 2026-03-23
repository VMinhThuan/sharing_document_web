import { useState, useMemo } from 'react';
import { Modal, Input, Empty, Tag } from 'antd';
import TopHeader from '../../components/TopHeader/TopHeader';

const HELP_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'auto_stories',
    color: 'purple',
    description: 'Learn the basics of uploading documents and using core features.',
    articles: [
      {
        id: 'upload-guide',
        title: 'How to upload your first document',
        content: `Uploading documents to SmartShare AI is quick and easy. Follow these steps:
        1. Navigate to the "Uploads" page from the sidebar.
        2. Click the "New Upload" button.
        3. Drag and drop your file or click to select from your computer.
        4. Provide a title and description to help others find your content.
        5. Select the appropriate category for better organization.
        6. Click "Start Upload" and wait for admin approval (usually within 24 hours).`,
        tags: ['Basic', 'Upload', 'Guide']
      },
      {
        id: 'account-setup',
        title: 'Setting up your profile',
        content: `A complete profile helps you connect with other students. To update your settings:
        1. Go to "Preferences" in the sidebar.
        2. Update your full name, bio, and interests.
        3. Click on the camera icon to upload a profile picture.
        4. Choose your preferred theme (Light, Dark, or System) to customize your experience.`,
        tags: ['Profile', 'Settings']
      },
      {
        id: 'smart-search',
        title: 'Using the AI Search Engine',
        content: `Our AI search goes beyond keywords. You can search by topics, questions, or specific concepts. The search results will prioritize documents that best match the semantic meaning of your query.`,
        tags: ['Search', 'AI']
      }
    ]
  },
  {
    id: 'ai-features',
    title: 'AI Features Guide',
    icon: 'psychology',
    color: 'blue',
    description: 'Master the AI learning generator, quiz creation, and summarization tools.',
    articles: [
      {
        id: 'ai-summary',
        title: 'Understanding AI Summaries',
        content: `Every approved document is automatically analyzed by our AI. You can find the AI Insights in the "Explore Documents" section. These summaries highlight the key points, core concepts, and educational value of the material.`,
        tags: ['AI', 'Summary', 'Learning']
      },
      {
        id: 'smart-chat',
        title: 'Chatting with your documents',
        content: `Coming soon! You will be able to ask questions directly to any document in your library. Our AI will read the context and provide precise answers based the content.`,
        tags: ['AI', 'Chat', 'Future']
      }
    ]
  },
  {
    id: 'billing-account',
    title: 'Account & Billing',
    icon: 'manage_accounts',
    color: 'green',
    description: 'Manage your subscription, update profile settings, and payment methods.',
    articles: [
      {
        id: 'password-reset',
        title: 'How to reset your password',
        content: `If you have forgotten your password, use the "Forgot Password" link on the login page. We will send a secure link to your registered email address to help you create a new one.`,
        tags: ['Security', 'Auth']
      },
      {
        id: 'storage-limits',
        title: 'Storage and file limits',
        content: `Each student account starts with 5GB of free cloud storage. If you reach your limit, you can delete old documents or contact support for a storage increase request.`,
        tags: ['Storage', 'Account']
      }
    ]
  }
];

const FAQS = [
  {
    question: "How accurate are the AI-generated insights?",
    answer: "Our AI model is trained specifically on educational content, providing 98% conceptual accuracy. It identifies core terminology and summarizes complex sections effectively for study purposes."
  },
  {
    question: "What file formats are supported?",
    answer: "We currently support PDF, DOCX, TXT, and MD files. Images and PPTX support are coming in the next release."
  },
  {
    question: "Can I use the platform for free?",
    answer: "Yes! SmartShare AI is free for students. You can upload, share, and use AI features without any hidden costs."
  }
];

const HelpCenter = () => {
    const [searchText, setSearchText] = useState("");
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const filteredCategories = useMemo(() => {
        if (!searchText) return HELP_CATEGORIES;
        
        return HELP_CATEGORIES.map(cat => ({
            ...cat,
            articles: cat.articles.filter(art => 
                art.title.toLowerCase().includes(searchText.toLowerCase()) ||
                art.content.toLowerCase().includes(searchText.toLowerCase()) ||
                art.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
            )
        })).filter(cat => cat.articles.length > 0);
    }, [searchText]);

    return (
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f9fafb] dark:bg-background-dark relative transition-colors duration-300">
            <TopHeader title="Help Center" />
            <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6">
                {/* Hero Section */}
                <div className="mb-12 text-center max-w-2xl mx-auto pt-8">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-[#0f172a] dark:text-white mb-4 tracking-tight">How can we help you?</h1>
                    <p className="text-base md:text-lg text-slate-500 dark:text-gray-400 mb-8">Search for guides, articles, or frequently asked questions below.</p>
                    <div className="relative group max-w-xl mx-auto">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
                        <input 
                            className="block w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-xl shadow-gray-200/50 dark:shadow-none" 
                            placeholder="Type keywords like 'upload', 'password'..." 
                            type="text" 
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="max-w-6xl mx-auto mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {HELP_CATEGORIES.map(cat => (
                            <div 
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat)}
                                className={`group bg-white dark:bg-surface-dark p-6 rounded-3xl border border-white dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer`}
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-${cat.color}-50 dark:bg-${cat.color}-500/10 text-${cat.color}-600 dark:text-${cat.color}-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cat.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">{cat.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Search Results or Featured Articles */}
                <div className="max-w-5xl mx-auto mb-16">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">article</span>
                        {searchText ? `Found in ${searchText}` : "Popular Articles"}
                    </h2>
                    
                    {filteredCategories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredCategories.flatMap(cat => cat.articles).slice(0, 6).map(article => (
                                <div 
                                    key={article.id}
                                    onClick={() => setSelectedArticle(article)}
                                    className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/40 transition-all cursor-pointer group flex items-start justify-between shadow-sm"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-2">{article.title}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {article.tags.map(tag => <Tag key={tag} className="m-0 text-[10px] font-bold uppercase rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-gray-400">{tag}</Tag>)}
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 bg-white dark:bg-surface-dark rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                             <Empty description="No articles found matching your query." />
                        </div>
                    )}
                </div>

                {/* FAQs */}
                <div className="max-w-4xl mx-auto mb-20 bg-white dark:bg-surface-dark rounded-[32px] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Quick Answers</h2>
                            <p className="text-sm text-slate-500">Fast solutions for common problems.</p>
                        </div>
                        <button className="text-sm font-bold text-primary px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors">Browse all FAQs</button>
                    </div>
                    <div className="space-y-3">
                        {FAQS.map((faq, i) => (
                            <details key={i} className="group overflow-hidden rounded-2xl border border-gray-50 dark:border-gray-800 transition-all">
                                <summary className="flex items-center justify-between p-5 cursor-pointer list-none bg-slate-50/30 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-900/30">
                                    <span className="font-bold text-gray-800 dark:text-white text-[15px]">{faq.question}</span>
                                    <span className="transition-transform group-open:rotate-180">
                                        <span className="material-symbols-outlined text-gray-400">expand_more</span>
                                    </span>
                                </summary>
                                <div className="px-5 pb-5 pt-2 text-slate-600 dark:text-gray-400 text-sm leading-relaxed antialiased">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>

                {/* CTA Box */}
                <div className="max-w-4xl mx-auto mb-20">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                        
                        <div className="relative z-10 text-center md:text-left">
                            <h2 className="text-3xl font-extrabold mb-4">Still need assistance?</h2>
                            <p className="text-blue-100 mb-8 max-w-md">Our support specialists are here to guide you through any challenges you're facing.</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <a className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors" href="mailto:support@smartshare.ai">
                                    <span className="material-symbols-outlined text-[18px]">email</span>
                                    Email Support
                                </a>
                                <a className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors" href="#">
                                    <span className="material-symbols-outlined text-[18px]">chat</span>
                                    Live Chat
                                </a>
                            </div>
                        </div>
                        <div className="relative z-10 shrink-0">
                            <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-2xl shadow-xl shadow-black/20 transition-all hover:-translate-y-1 active:scale-95">
                                Contact Experts
                            </button>
                        </div>
                    </div>
                </div>

                <footer className="max-w-5xl mx-auto py-12 text-center border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">© 2024 SmartShare AI Inc. All rights reserved.</p>
                    <div className="flex justify-center space-x-6">
                        <a className="text-xs font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors" href="#">Privacy Policy</a>
                        <a className="text-xs font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors" href="#">Terms & Conditions</a>
                    </div>
                </footer>
            </div>

            {/* Article Detail Modal */}
            <Modal
                title={null}
                footer={null}
                open={!!selectedArticle}
                onCancel={() => setSelectedArticle(null)}
                centered
                width={700}
                className="help-article-modal"
                bodyStyle={{ padding: 0 }}
            >
                {selectedArticle && (
                    <div className="p-8">
                        <div className="flex items-center gap-2 mb-4">
                            {selectedArticle.tags.map(tag => <Tag key={tag} color="blue" className="rounded-md font-bold uppercase text-[10px]">{tag}</Tag>)}
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{selectedArticle.title}</h2>
                        <div className="text-gray-600 leading-relaxed space-y-4 whitespace-pre-wrap">
                            {selectedArticle.content}
                        </div>
                        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Was this helpful?</span>
                                <div className="flex gap-4 mt-2">
                                    <button className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">thumb_up</span> Yes
                                    </button>
                                    <button className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">thumb_down</span> No
                                    </button>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedArticle(null)}
                                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Category Articles Modal */}
            <Modal
                title={selectedCategory?.title || "Help Articles"}
                footer={null}
                open={!!selectedCategory}
                onCancel={() => setSelectedCategory(null)}
                centered
                width={800}
            >
                <div className="py-4">
                    <div className="grid grid-cols-1 gap-4">
                        {selectedCategory?.articles.map(article => (
                            <div 
                                key={article.id}
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setSelectedArticle(article);
                                }}
                                className="p-5 bg-slate-50 hover:bg-white rounded-2xl border border-transparent hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer group flex items-start justify-between"
                            >
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-primary mb-1">{article.title}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-1">{article.content}</p>
                                </div>
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-all">chevron_right</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </main>
    )
}

export default HelpCenter;

