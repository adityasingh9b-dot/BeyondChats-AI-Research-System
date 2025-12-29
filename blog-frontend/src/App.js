import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, ExternalLink, ArrowLeft, ChevronRight } from 'lucide-react';

const API_URL = "http://127.0.0.1:8000/api/articles";

function App() {
  const [allArticles, setAllArticles] = useState([]);
  const [displayArticles, setDisplayArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(API_URL);
      // Data format handling for Firebase
      const dataArray = response.data ? Object.keys(response.data).map(key => ({
        id: key,
        ...response.data[key]
      })) : [];
      
      setAllArticles(dataArray);

      // Filter: Sirf "Original" articles Home screen ke liye
      const originals = dataArray.filter(a => !a.title.includes("(AI Enhanced)"));
      
      // Sort by latest and take top 5
      setDisplayArticles(originals.reverse().slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error("Fetch Error:", error);
      setLoading(false);
    }
  };

  const handleCardClick = (article) => {
    setSelectedArticle(article);
    setShowAI(false);
    window.scrollTo(0, 0); // View change hone par top par scroll kare
  };

  const getAIContent = () => {
    if (!selectedArticle) return "";
    // Base title nikalne ke liye (agar original title bada hai)
    const baseTitle = selectedArticle.title.trim();
    const aiVersion = allArticles.find(a => 
      a.title.includes(baseTitle) && a.title.includes("(AI Enhanced)")
    );
    return aiVersion ? aiVersion.content : "AI Research in progress... Please run your node script to generate optimized version.";
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-bold text-slate-600 tracking-widest uppercase text-xs">Syncing Research Data</p>
    </div>
  );

  // --- VIEW 1: DETAILED SINGLE ARTICLE VIEW ---
  if (selectedArticle) {
    const currentContent = showAI ? getAIContent() : selectedArticle.content;

    return (
      <div className="min-h-screen bg-white">
        <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-10 px-6 py-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="flex items-center text-slate-500 hover:text-blue-600 font-bold transition-all"
            >
              <ArrowLeft size={20} className="mr-2" /> Back
            </button>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setShowAI(false)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${!showAI ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
              >
                Original
              </button>
              <button 
                onClick={() => setShowAI(true)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${showAI ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}
              >
                AI Optimized
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto p-6 md:p-12">
          <header className="mb-10">
            <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
              {showAI ? "Refined by Llama-3.3" : "Original Publication"}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              {selectedArticle.title}
            </h1>
          </header>

          <article className="prose prose-slate max-w-none">
            {/* whitespace-pre-line se formatting bani rahegi */}
            <div className="text-slate-700 text-lg leading-relaxed whitespace-pre-line font-medium">
              {currentContent}
            </div>
          </article>

          <footer className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <button 
              onClick={() => window.open(selectedArticle.url, "_blank")}
              className="group flex items-center bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
            >
              Read Original Article <ExternalLink size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="text-right">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Source Platform</p>
              <p className="text-slate-900 font-black text-sm">{selectedArticle.source || "BeyondChats Blog"}</p>
            </div>
          </footer>
        </main>
      </div>
    );
  }

  // --- VIEW 2: TOP 5 CARDS LIST VIEW ---
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-4">
            Research<span className="text-blue-600">.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg border-l-4 border-blue-600 pl-4">
            Showing the 5 most recent insights from BeyondChats.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayArticles.map((article, index) => (
            <div 
              key={article.id} 
              onClick={() => handleCardClick(article)}
              className={`group bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm cursor-pointer hover:shadow-2xl hover:border-blue-500 transition-all flex flex-col justify-between relative overflow-hidden ${index === 0 ? 'lg:col-span-2' : ''}`}
            >
              <div className="relative z-10">
                <div className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-6 bg-blue-50 w-fit px-3 py-1 rounded-full">
                  Recent Analysis
                </div>
                <h2 className={`font-black text-slate-900 mb-6 group-hover:text-blue-600 transition-colors leading-tight ${index === 0 ? 'text-3xl md:text-5xl' : 'text-2xl'}`}>
                  {article.title}
                </h2>
                <p className="text-slate-500 text-lg line-clamp-2 font-medium mb-8">
                  {article.content}
                </p>
              </div>
              
              <div className="flex items-center text-slate-900 font-black text-sm">
                View Deep Dive <ChevronRight size={20} className="ml-1 group-hover:translate-x-2 transition-transform text-blue-600" />
              </div>

              {/* Decorative Number for UI Polish */}
              <div className="absolute -bottom-10 -right-4 text-[120px] font-black text-slate-50 opacity-[0.03] select-none">
                0{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
