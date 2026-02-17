'use client';

import { useEffect, useState } from 'react';
import { getIcons } from './lib/iconApi';
import IconGrid from '@/components/IconGrid';
import ThemeToggle from '@/components/ThemeToggle'
// Add this once, anywhere outside the component (top of file)
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
export default function Home() {
  const [q, setQ] = useState('');
  const [style, setStyle] = useState('all');
  const [color, setColor] = useState('#3B82F6');
  const [icons, setIcons] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(90);
  const [totalDocs, setTotalDocs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);


 
  const beep = (frequency: number, duration: number) => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Voice search not supported in this browser.'); return; }

    if (listening) {
      beep(440, 0.15);                    // ← low beep on stop
      (window as any).__sr?.abort();
      setListening(false);
      return;
    }

    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      beep(880, 0.15);                    // ← high beep on start
      setListening(true);
    };
    recognition.onend = () => {
      if ((window as any).__srActive) {
        recognition.start();
      } else {
        setListening(false);
      }
    };
    recognition.onerror = (e: any) => {
      if (e.error === 'no-speech') return;
      (window as any).__srActive = false;
      setListening(false);
    };
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setQ(transcript);
    };

    (window as any).__srActive = true;
    (window as any).__sr = recognition;
    recognition.start();
  };

  const fetchIcons = async () => {
    setLoading(true);
    try {
      const res = await getIcons({ q, page, limit, style });
      let data = res.icons.data;
      setIcons(data);
      setTotalDocs(res.icons.totalDocs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [q, style]);

  useEffect(() => {
    fetchIcons();
  }, [q, style, page]);

  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => p + 1);
  const totalPages = Math.ceil(totalDocs / limit);

  return (

    <div className="min-h-screen 
  bg-gradient-to-br from-blue-50 via-white to-purple-50 
  dark:from-gray-900 dark:via-gray-950 dark:to-gray-900
  transition-colors">

      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 
  backdrop-blur-md shadow-sm border-b 
  border-gray-200 dark:border-gray-700 
  transition-colors">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">I</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                IconFly
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a>
              <a href="#credits" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Credits</a>
              <a
                href="https://github.com/Dip20/iconfly"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
              <ThemeToggle />

            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Beautiful Icons
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-100">for Every Platform</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Self-hosted, blazingly fast icon library built on FontAwesome Free.
            Search, customize, and download icons for web, mobile, and desktop apps.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">⚡</span>
              <span className="text-gray-700 dark:text-gray-200 font-medium">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">🎨</span>
              <span className="text-gray-700 dark:text-gray-200 font-medium">Fully Customizable</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">📱</span>
              <span className="text-gray-700 dark:text-gray-200 font-medium">Cross-Platform</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">🆓</span>
              <span className="text-gray-700 dark:text-gray-200 font-medium">Free & Open Source</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 mb-12 border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="flex flex-col md:flex-row gap-4">
          
            <div className="flex-1 relative group">
              {/* Animated AI glow border when listening */}
              {listening && (
                <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x opacity-80 blur-[2px] z-0" />
              )}

              {/* Search icon */}
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 z-10"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              <input
                type="text"
                placeholder="Search 2,000+ icons..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className={`relative z-10 w-full pl-12 pr-28 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
      bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500
      ${listening ? 'border-transparent' : 'border-gray-200 dark:border-gray-700'}`}
              />

              {/* Right side badges */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">

                {/* AI badge */}
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-200/50 dark:border-blue-700/50">
                  <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
                  </svg>
                  <span className="text-[10px] font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent tracking-wide">AI</span>
                </div>

                {/* Divider */}
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-600" />

                {/* Mic button */}
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`relative w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200
        ${listening
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 scale-110'
                      : 'text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10'
                    }`}
                  title={listening ? 'Stop listening' : 'Search by voice'}
                >
                  {/* Ripple ring when listening */}
                  {listening && (
                    <>
                      <span className="absolute inset-0 rounded-lg bg-red-400 animate-ping opacity-30" />
                      <span className="absolute inset-[-4px] rounded-xl border-2 border-red-400 animate-pulse opacity-50" />
                    </>
                  )}

                  {listening ? (
                    <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="appearance-none px-6 py-3 pr-10 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 cursor-pointer transition-all font-medium"
              >
                <option value="all">All Styles</option>
                <option value="solid">Solid</option>
                <option value="regular">Regular</option>
                <option value="brands">Brands</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 transition-colors">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Color:</span>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600"
              />
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{color.toUpperCase()}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Found <span className="font-semibold text-blue-600 dark:text-blue-400">{totalDocs.toLocaleString()}</span> icons
            </span>
            {totalPages > 1 && (
              <span className="text-gray-500 dark:text-gray-400">
                Page {page} of {totalPages}
              </span>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        )}

        {!loading && icons.length > 0 && (
          <>
            <IconGrid icons={icons} color={color} />

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  onClick={prevPage}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="hidden sm:flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${page === pageNum
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={nextPage}
                  disabled={page >= totalPages}
                  className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                  Next
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {!loading && icons.length === 0 && q && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">No icons found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try a different search term or filter</p>
          </div>
        )}
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-gray-100">Why IconFly?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 border border-blue-200 dark:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400">Custom indexing algorithm delivers instant search results across thousands of icons.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 border border-purple-200 dark:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Fully Customizable</h3>
              <p className="text-gray-600 dark:text-gray-400">Change colors, download SVGs, or copy code. Make icons match your brand perfectly.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 border border-green-200 dark:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Cross-Platform</h3>
              <p className="text-gray-600 dark:text-gray-400">SVG icons work flawlessly on web, mobile, and desktop apps with zero pixel loss.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-800 dark:to-gray-900 border border-pink-200 dark:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">CDN Hosted</h3>
              <p className="text-gray-600 dark:text-gray-400">All icons available via jsDelivr CDN for fast, reliable access worldwide.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-900 border border-orange-200 dark:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🆓</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Free Forever</h3>
              <p className="text-gray-600 dark:text-gray-400">No API costs, no subscriptions. Built on FontAwesome Free and open source.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 border border-indigo-200 dark:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Self-Hosted</h3>
              <p className="text-gray-600 dark:text-gray-400">No external dependencies. Host it yourself for complete control and privacy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">About IconFly</h2>
          <div className="prose prose-lg max-w-none">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">The Problem I Faced</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                While building applications across multiple platforms—mobile apps, desktop applications, and web interfaces—I needed a consistent icon solution. The icons had to be:
              </p>
              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                  <span>Identical across iOS, Android, Desktop, and Web</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                  <span>Highly customizable (colors, sizes, styles)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                  <span>Fast loading with zero pixel loss at any resolution</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                  <span>Free from external API dependencies and costs</span>
                </li>
              </ul>

              <h3 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">Why SVG?</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                After researching cross-platform solutions, SVG emerged as the perfect format:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Universal Support</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-400">Every major platform natively supports SVG rendering</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                  <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2">Perfect Scaling</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-400">Zero pixel loss at any size or resolution</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl border border-green-200 dark:border-green-700">
                  <h4 className="font-bold text-green-900 dark:text-green-300 mb-2">Lightweight</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-400">Small file sizes mean faster loading times</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 p-4 rounded-xl border border-pink-200 dark:border-pink-700">
                  <h4 className="font-bold text-pink-900 dark:text-pink-300 mb-2">Customizable</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-400">Easy to modify colors and properties programmatically</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">The Solution</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                I could have used FontAwesome directly, but that would mean:
              </p>
              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Paying for API access</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Depending on external services</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Limited customization and control</span>
                </li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Instead, I downloaded FontAwesome Free icons and built IconFly—a complete self-hosted solution with:
              </p>
              <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <span>Powerful search and filtering</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <span>Custom Node.js indexing for fast queries</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <span>CDN hosting via jsDelivr</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <span>Zero external dependencies</span>
                </li>
              </ul>

              <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Future Plans</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                IconFly is just getting started. I plan to expand it with:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">→</span>
                  <span>React component library for easy integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">→</span>
                  <span>Next.js standalone icon packages</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">→</span>
                  <span>Enhanced CDN delivery for all icons</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">→</span>
                  <span>Advanced search algorithms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Credits Section */}
      <section id="credits" className="py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">Credits & Attribution</h2>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-4xl">❤️</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-blue-900 dark:text-blue-300">FontAwesome</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    IconFly is built on top of <a href="https://fontawesome.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">FontAwesome Free</a>,
                    an incredible icon library created by the FontAwesome team.
                  </p>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <p className="font-semibold mb-2 text-gray-800 dark:text-gray-200">FontAwesome Free License:</p>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-400">
                      <li>• Icons: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">CC BY 4.0 License</a></li>
                      <li>• Fonts: <a href="https://scripts.sil.org/OFL" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">SIL OFL 1.1 License</a></li>
                      <li>• Code: <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">MIT License</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🚀</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-purple-900 dark:text-purple-300">jsDelivr CDN</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Special thanks to <a href="https://www.jsdelivr.com/" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">jsDelivr</a> for
                    providing free, fast, and reliable CDN hosting for all IconFly icons.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    CDN Base URL: <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-400">
                      https://cdn.jsdelivr.net/gh/Dip20/iconfly@main/
                    </code>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-8 border border-green-200 dark:border-green-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🌟</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-green-900 dark:text-green-300">Open Source Community</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    IconFly is built with amazing open source technologies including Next.js, React, TypeScript, and Tailwind CSS.
                    Thank you to all the maintainers and contributors who make these tools possible.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">IconFly License</h3>
              <p className="mb-4">
                IconFly is open source and licensed under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">MIT License</a>.
              </p>
              <p className="text-gray-300 text-sm">
                You are free to use, modify, and distribute IconFly for both personal and commercial projects.
                The icons themselves remain under FontAwesome's CC BY 4.0 License.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">I</span>
                </div>
                <span className="text-xl font-bold">IconFly</span>
              </div>
              <p className="text-gray-400 text-sm">
                Self-hosted icon library for modern applications.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#credits" className="hover:text-white transition-colors">Credits</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="https://github.com/Dip20/iconfly" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://fontawesome.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    FontAwesome
                  </a>
                </li>
                <li>
                  <a href="https://www.jsdelivr.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    jsDelivr CDN
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a
                  href="https://github.com/Dip20/iconfly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M448 96c0-35.3-28.7-64-64-64L64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320zM265.8 407.7c0-1.8 0-6 .1-11.6 .1-11.4 .1-28.8 .1-43.7 0-15.6-5.2-25.5-11.3-30.7 37-4.1 76-9.2 76-73.1 0-18.2-6.5-27.3-17.1-39 1.7-4.3 7.4-22-1.7-45-13.9-4.3-45.7 17.9-45.7 17.9-26.6-7.5-56.6-7.5-83.2 0 0 0-31.8-22.2-45.7-17.9-9.1 22.9-3.5 40.6-1.7 45-10.6 11.7-15.6 20.8-15.6 39 0 63.6 37.3 69 74.3 73.1-4.8 4.3-9.1 11.7-10.6 22.3-9.5 4.3-33.8 11.7-48.3-13.9-9.1-15.8-25.5-17.1-25.5-17.1-16.2-.2-1.1 10.2-1.1 10.2 10.8 5 18.4 24.2 18.4 24.2 9.7 29.7 56.1 19.7 56.1 19.7 0 9 .1 21.7 .1 30.6 0 4.8 .1 8.6 .1 10 0 4.3-3 9.5-11.5 8-66-22.1-112.2-84.9-112.2-158.3 0-91.8 70.2-161.5 162-161.5S388 165.6 388 257.4c.1 73.4-44.7 136.3-110.7 158.3-8.4 1.5-11.5-3.7-11.5-8zm-90.5-54.8c-.2-1.5 1.1-2.8 3-3.2 1.9-.2 3.7 .6 3.9 1.9 .3 1.3-1 2.6-3 3-1.9 .4-3.7-.4-3.9-1.7zm-9.1 3.2c-2.2 .2-3.7-.9-3.7-2.4 0-1.3 1.5-2.4 3.5-2.4 1.9-.2 3.7 .9 3.7 2.4 0 1.3-1.5 2.4-3.5 2.4zm-14.3-2.2c-1.9-.4-3.2-1.9-2.8-3.2s2.4-1.9 4.1-1.5c2 .6 3.3 2.1 2.8 3.4-.4 1.3-2.4 1.9-4.1 1.3zm-12.5-7.3c-1.5-1.3-1.9-3.2-.9-4.1 .9-1.1 2.8-.9 4.3 .6 1.3 1.3 1.8 3.3 .9 4.1-.9 1.1-2.8 .9-4.3-.6zm-8.5-10c-1.1-1.5-1.1-3.2 0-3.9 1.1-.9 2.8-.2 3.7 1.3 1.1 1.5 1.1 3.3 0 4.1-.9 .6-2.6 0-3.7-1.5zm-6.3-8.8c-1.1-1.3-1.3-2.8-.4-3.5 .9-.9 2.4-.4 3.5 .6 1.1 1.3 1.3 2.8 .4 3.5-.9 .9-2.4 .4-3.5-.6zm-6-6.4c-1.3-.6-1.9-1.7-1.5-2.6 .4-.6 1.5-.9 2.8-.4 1.3 .7 1.9 1.8 1.5 2.6-.4 .9-1.7 1.1-2.8 .4z" /></svg>
                </a>
                <a
                  href="https://linkedin.com/in/santu2030"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm5 170.2l66.5 0 0 213.8-66.5 0 0-213.8zm71.7-67.7a38.5 38.5 0 1 1 -77 0 38.5 38.5 0 1 1 77 0zM317.9 416l0-104c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9l0 105.8-66.4 0 0-213.8 63.7 0 0 29.2 .9 0c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9l0 117.2-66.4 0z" /></svg> 
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2024 IconFly. Built with ❤️ by <a href="https://github.com/Dip20" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Dip</a>
            </p>
            <p className="text-sm text-gray-400">
              Icons from <a href="https://fontawesome.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">FontAwesome</a> •
              Hosted on <a href="https://www.jsdelivr.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">jsDelivr</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}