const Home = () => {
  return (
    <main className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* Mobile Header (Visible only on small screens) */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#1a202c] border-b border-gray-200 dark:border-gray-800 z-20">
        <div className="flex items-center gap-2">
          <div className="text-primary bg-primary/10 p-1.5 rounded-lg">
            <span className="material-symbols-outlined">smart_toy</span>
          </div>
          <span className="font-bold text-lg">SmartShare AI</span>
        </div>
        <button className="text-gray-600 dark:text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark scroll-smooth">
        <div className="max-w-7xl mx-auto w-full pb-10">
          {/* Hero / Greeting Section */}
          <div className="pt-8 px-6 md:px-10 pb-2">
            <div className="flex flex-col gap-1">
              <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">Good Morning, Alex 👋</h1>
              <p className="text-[#60708a] dark:text-gray-400 text-base md:text-lg font-normal">Ready to boost your knowledge today?</p>
            </div>
          </div>
          {/* Search Section */}
          <div className="px-6 md:px-10 py-6 sticky top-0 z-10 backdrop-blur-md bg-background-light/80 dark:bg-background-dark/80 transition-all duration-300">
            <div className="max-w-3xl">
              <label className="group flex flex-col w-full relative shadow-sm transition-all focus-within:shadow-md rounded-xl">
                <div className="flex w-full items-stretch rounded-xl h-14 bg-white dark:bg-[#1a202c] border border-gray-200 dark:border-gray-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden">
                  <div className="text-primary flex items-center justify-center pl-4 pr-2">
                    <span className="material-symbols-outlined animate-pulse">colors_spark</span>
                  </div>
                  <input className="flex w-full min-w-0 flex-1 resize-none bg-transparent border-none focus:ring-0 text-[#111318] dark:text-white placeholder:text-[#60708a] px-2 text-base font-normal leading-normal h-full" placeholder="Ask a question or search for 'Calculus notes'..." />
                  <div className="flex items-center pr-2">
                    <button className="bg-primary hover:bg-blue-600 text-white p-2 rounded-lg transition-colors flex items-center justify-center">
                      <span className="material-symbols-outlined">search</span>
                    </button>
                  </div>
                </div>
              </label>
              {/* Chips */}
              <div className="flex gap-2.5 py-4 flex-wrap">
                <button className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#1a202c] border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 pl-3 pr-4 transition-all cursor-pointer shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">science</span>
                  <span className="text-[#111318] dark:text-gray-200 text-sm font-medium">Physics notes</span>
                </button>
                <button className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#1a202c] border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 pl-3 pr-4 transition-all cursor-pointer shadow-sm">
                  <span className="material-symbols-outlined text-green-500 text-[18px]">description</span>
                  <span className="text-[#111318] dark:text-gray-200 text-sm font-medium">Essay drafts</span>
                </button>
                <button className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#1a202c] border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 pl-3 pr-4 transition-all cursor-pointer shadow-sm">
                  <span className="material-symbols-outlined text-orange-500 text-[18px]">calculate</span>
                  <span className="text-[#111318] dark:text-gray-200 text-sm font-medium">Calculus II</span>
                </button>
                <button className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#1a202c] border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 pl-3 pr-4 transition-all cursor-pointer shadow-sm">
                  <span className="material-symbols-outlined text-purple-500 text-[18px]">memory</span>
                  <span className="text-[#111318] dark:text-gray-200 text-sm font-medium">Machine Learning</span>
                </button>
              </div>
            </div>
          </div>
          {/* Content Grid */}
          <div className="flex flex-col gap-10 px-6 md:px-10">
            {/* AI Picks Section */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <h2 className="text-[#111318] dark:text-white text-xl md:text-2xl font-bold leading-tight">AI Picks For You</h2>
                </div>
                <a className="text-sm font-semibold text-primary hover:text-blue-600" href="#">View All</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="group bg-white dark:bg-[#1a202c] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-3">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded-md text-primary shadow-sm z-10 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                      98% Match
                    </div>
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" data-alt="Abstract blue geometric pattern representing economics" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBIv4lyxJq04hcqJkz4XVp-Zn-GOh8qiFnK_6FaX2DktZEwYKmnSFU8oKOcPWBdcJqzubI5HBILJhG_UU7bI1tS6ko0QRgYSuamMEGzYMo02WMdKFI0bXVk1aL7e-yJ295PlmNYq6pwxVYzHtDbru5osxzvMN1pQSNkWBcEGNHjTFErJjWvyIssQqK_sJNRjWsJDj3jKV-4Fd89KWv87qoLNVL_nAwT8cmIsCdnzXhslczTqU7pBnESNUdndVUHw5p66GJZm2TJAp8")' }}></div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">Intro to Microeconomics</h3>
                      <span className="material-symbols-outlined text-gray-400 hover:text-red-500 transition-colors cursor-pointer">favorite</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">Comprehensive notes covering supply and demand, elasticity, and market structures. Perfect for finals.</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="bg-center bg-cover rounded-full size-6" data-alt="User avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAIZLz1QbOrDZ7JPEB4JhUTnicwXE_CiVhYlBowS3eIyAgRGq9FKbySRCNrRhFsYUGFnSEP5ExFWrvaFD_nxUOJbe8BWEJkdVHi-5sHvi2db4L5sNlUgAxpPeTAN42OkR8qE7kBmVTNNwl0JZZyWIslsvRIJjVS2Zb6ipXXqPNKy13cX_FDXvKNa374CFBPAb7Y6c6koXKhnjHw4hqRUZPzSYeQk0UTvCCd4SDn9dJIq5HLp45VNbNpXTL42eGSZQQhoJ6I-czGy5M")' }}></div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Sarah K.</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">visibility</span> 1.2k</span>
                      <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 font-bold uppercase">PDF</span>
                    </div>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="group bg-white dark:bg-[#1a202c] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-3">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded-md text-primary shadow-sm z-10 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                      95% Match
                    </div>
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" data-alt="Hexagonal molecular structure graphic" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDnJFtvCPzselaPt9qZEiyoRX_F4qZEL0OIMO6wghuGtyqI2VHdA1ha9A9C40MQtpgFpVrXYQQ5BUVhsPr3Q-jiBXMo8kRgZ2IDhgTjt2yh56P_UAFDPqsFqy4aqiTlLhk8ttpGeHKmbQg197Dik0XOkKAg0Ry6PXmDYW4gNsDaWxrsZbrGoNJArRcBk56oZ0EcL7xUiFXt3t47CPtrhR_DCtSmH5PshR51BH-ZXYzVRhtzj6vR9J0hrMVp6c73ZzENKJu47-HiV1M")' }}></div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">Organic Chemistry Cheat Sheet</h3>
                      <span className="material-symbols-outlined text-gray-400 hover:text-red-500 transition-colors cursor-pointer">favorite</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">Key reactions, mechanisms, and nomenclature rules summarized in 5 pages.</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="bg-center bg-cover rounded-full size-6" data-alt="User avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuByCcKhbKxVyy4UN3WhicQDaCi4z0QzbwCjIG1KJEqwbZ4FcBM07HYwTC0C7XsglpgIQUPiZ8xLlf3h7z3E4A71bxdG6BF9Cuoh5BOZjIbL_qXzPcHF5MnPGfC8BMrVw2_rJwnF5MbBofDOugBDn50UcU1xENWabN9pVf4_ZeI7Qncc677WOsy5vByoVyRD19DvkW0BW0MY8ILF3MNnLVeE--7wMP5QXq_7LJasXiRq8SYAAF76HUL92gMMScuxaEro1YOs_VNA7AE")' }}></div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">David L.</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">visibility</span> 856</span>
                      <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 font-bold uppercase">DOCX</span>
                    </div>
                  </div>
                </div>
                {/* Card 3 */}
                <div className="group bg-white dark:bg-[#1a202c] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-3">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded-md text-green-600 shadow-sm z-10 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                      Trending
                    </div>
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" data-alt="Vintage map background for history subject" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDpwV0BCH25a-vyfFzeKnnt5q5aphxcsQeucTGT3bE6TfwuwzNbb5cymlDi3mZf1DbuSgzI7OaacGx1joptFANJNQPWuNjPiqtARHky915uExC5csnI6e2BvkwuMqPenYZLefubpxD6L0RHkhbs5kN3r8W7jE_kIBXQ1-3VYVIUCbnuGGqhuiyYWzqjUfN90Ui4-hKk3ypxtgyC2beHdL6ES4FVhHAhavChIKd8-ITLYA2vpPdI3-MvTNyi5Ow77e2ar9z9h3Boeio")' }}></div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">World History: 1900-1950</h3>
                      <span className="material-symbols-outlined text-gray-400 hover:text-red-500 transition-colors cursor-pointer">favorite</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">Detailed timeline and analysis of major global events in the first half of the 20th century.</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="bg-center bg-cover rounded-full size-6" data-alt="User avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLVPiZffXI3y2aw8CadRLBycudHV9WLuWGMFmXcyf07LsmY5OcC13_uYYSPUtCuLOVUAaLYeJEIglvvnz88f4qhBcAYOc4PZlkiO8WI79vkwVV1H74xPjugsqGJBBkCQIkTWBo0NejPLXY2yyVT4HoWr7yf81REEWr2S1TxA121UBWxw060-utAwUtcD3nTHkljUN6qFFcbpnyHGct5oigPuUPnUsEB8OtjOoOy-bW3TulC8aydiN_AzO0g8Rz-5zSwXOOpayvX-s")' }}></div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Emma W.</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">visibility</span> 2.1k</span>
                      <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 font-bold uppercase">PDF</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Trending Topics Section */}
            <section>
              <h2 className="text-[#111318] dark:text-white text-xl font-bold leading-tight mb-5 px-1">🔥 Trending Topics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a className="group relative flex flex-col justify-end h-32 p-4 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1" href="#">
                  <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity">
                    <span className="material-symbols-outlined text-[64px]">school</span>
                  </div>
                  <p className="font-bold text-lg relative z-10">Finals Prep</p>
                  <p className="text-xs text-blue-100 relative z-10">450+ docs</p>
                </a>
                <a className="group relative flex flex-col justify-end h-32 p-4 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1" href="#">
                  <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity">
                    <span className="material-symbols-outlined text-[64px]">code</span>
                  </div>
                  <p className="font-bold text-lg relative z-10">Python</p>
                  <p className="text-xs text-purple-100 relative z-10">320+ docs</p>
                </a>
                <a className="group relative flex flex-col justify-end h-32 p-4 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1" href="#">
                  <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity">
                    <span className="material-symbols-outlined text-[64px]">psychology</span>
                  </div>
                  <p className="font-bold text-lg relative z-10">Psychology</p>
                  <p className="text-xs text-emerald-100 relative z-10">180+ docs</p>
                </a>
                <a className="group relative flex flex-col justify-end h-32 p-4 rounded-xl overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1" href="#">
                  <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity">
                    <span className="material-symbols-outlined text-[64px]">history_edu</span>
                  </div>
                  <p className="font-bold text-lg relative z-10">History 101</p>
                  <p className="text-xs text-orange-100 relative z-10">210+ docs</p>
                </a>
              </div>
            </section>
            {/* Recently Viewed (List View) */}
            <section>
              <h2 className="text-[#111318] dark:text-white text-xl font-bold leading-tight mb-4 px-1">Recently Viewed</h2>
              <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                  <div className="size-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary">Advanced Calculus - Week 4.pdf</h4>
                    <p className="text-xs text-gray-500">Viewed 2 hours ago • 4.5MB</p>
                  </div>
                  <div className="hidden md:block text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">Math</div>
                </div>
                <div className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                  <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                    <span className="material-symbols-outlined">article</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary">Project Management Finals.docx</h4>
                    <p className="text-xs text-gray-500">Viewed yesterday • 1.2MB</p>
                  </div>
                  <div className="hidden md:block text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">Business</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
