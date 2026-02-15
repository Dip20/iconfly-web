'use client';

import { useEffect, useState } from 'react';
import { getIcons } from './lib/iconApi';
import IconGrid from '@/components/IconGrid';

export default function Home() {
  const [q, setQ] = useState('');
  const [style, setStyle] = useState('all');
  const [color, setColor] = useState('#3B82F6');
  const [icons, setIcons] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(90);
  const [totalDocs, setTotalDocs] = useState(0);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
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
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#credits" className="text-gray-600 hover:text-blue-600 transition-colors">Credits</a>
              <a
                href="https://github.com/Dip20/iconfly"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
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
            <span className="text-gray-800">for Every Platform</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Self-hosted, blazingly fast icon library built on FontAwesome Free.
            Search, customize, and download icons for web, mobile, and desktop apps.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">⚡</span>
              <span className="text-gray-700 font-medium">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">🎨</span>
              <span className="text-gray-700 font-medium">Fully Customizable</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">📱</span>
              <span className="text-gray-700 font-medium">Cross-Platform</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">🆓</span>
              <span className="text-gray-700 font-medium">Free & Open Source</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search 2,000+ icons..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="relative">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="appearance-none px-6 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer transition-all font-medium"
              >
                <option value="all">All Styles</option>
                <option value="solid">Solid</option>
                <option value="regular">Regular</option>
                <option value="brands">Brands</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-xl bg-white">
              <span className="text-sm font-medium text-gray-700">Color:</span>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
              />
              <span className="text-sm font-mono text-gray-600">{color.toUpperCase()}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Found <span className="font-semibold text-blue-600">{totalDocs.toLocaleString()}</span> icons
            </span>
            {totalPages > 1 && (
              <span className="text-gray-500">
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
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
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
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
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
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
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
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No icons found</h3>
            <p className="text-gray-600">Try a different search term or filter</p>
          </div>
        )}
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Why IconFly?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Custom indexing algorithm delivers instant search results across thousands of icons.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Fully Customizable</h3>
              <p className="text-gray-600">Change colors, download SVGs, or copy code. Make icons match your brand perfectly.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Cross-Platform</h3>
              <p className="text-gray-600">SVG icons work flawlessly on web, mobile, and desktop apps with zero pixel loss.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold mb-2">CDN Hosted</h3>
              <p className="text-gray-600">All icons available via jsDelivr CDN for fast, reliable access worldwide.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🆓</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Free Forever</h3>
              <p className="text-gray-600">No API costs, no subscriptions. Built on FontAwesome Free and open source.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Self-Hosted</h3>
              <p className="text-gray-600">No external dependencies. Host it yourself for complete control and privacy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-8">About IconFly</h2>
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">The Problem I Faced</h3>
              <p className="text-gray-700 mb-6">
                While building applications across multiple platforms—mobile apps, desktop applications, and web interfaces—I needed a consistent icon solution. The icons had to be:
              </p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Identical across iOS, Android, Desktop, and Web</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Highly customizable (colors, sizes, styles)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Fast loading with zero pixel loss at any resolution</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Free from external API dependencies and costs</span>
                </li>
              </ul>

              <h3 className="text-2xl font-bold mb-4 text-purple-600">Why SVG?</h3>
              <p className="text-gray-700 mb-6">
                After researching cross-platform solutions, SVG emerged as the perfect format:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                  <h4 className="font-bold text-blue-900 mb-2">Universal Support</h4>
                  <p className="text-sm text-gray-700">Every major platform natively supports SVG rendering</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                  <h4 className="font-bold text-purple-900 mb-2">Perfect Scaling</h4>
                  <p className="text-sm text-gray-700">Zero pixel loss at any size or resolution</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                  <h4 className="font-bold text-green-900 mb-2">Lightweight</h4>
                  <p className="text-sm text-gray-700">Small file sizes mean faster loading times</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl">
                  <h4 className="font-bold text-pink-900 mb-2">Customizable</h4>
                  <p className="text-sm text-gray-700">Easy to modify colors and properties programmatically</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4 text-green-600">The Solution</h3>
              <p className="text-gray-700 mb-4">
                I could have used FontAwesome directly, but that would mean:
              </p>
              <ul className="space-y-2 mb-6 text-gray-700">
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

              <p className="text-gray-700 mb-4">
                Instead, I downloaded FontAwesome Free icons and built IconFly—a complete self-hosted solution with:
              </p>
              <ul className="space-y-2 mb-6 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Powerful search and filtering</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Custom Node.js indexing for fast queries</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>CDN hosting via jsDelivr</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Zero external dependencies</span>
                </li>
              </ul>

              <h3 className="text-2xl font-bold mb-4 text-indigo-600">Future Plans</h3>
              <p className="text-gray-700 mb-4">
                IconFly is just getting started. I plan to expand it with:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold">→</span>
                  <span>React component library for easy integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold">→</span>
                  <span>Next.js standalone icon packages</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold">→</span>
                  <span>Enhanced CDN delivery for all icons</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold">→</span>
                  <span>Advanced search algorithms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Credits Section */}
      <section id="credits" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Credits & Attribution</h2>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">❤️</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-blue-900">FontAwesome</h3>
                  <p className="text-gray-700 mb-4">
                    IconFly is built on top of <a href="https://fontawesome.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">FontAwesome Free</a>,
                    an incredible icon library created by the FontAwesome team.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <p className="font-semibold mb-2 text-gray-800">FontAwesome Free License:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Icons: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">CC BY 4.0 License</a></li>
                      <li>• Fonts: <a href="https://scripts.sil.org/OFL" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SIL OFL 1.1 License</a></li>
                      <li>• Code: <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">MIT License</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🚀</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-purple-900">jsDelivr CDN</h3>
                  <p className="text-gray-700 mb-2">
                    Special thanks to <a href="https://www.jsdelivr.com/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">jsDelivr</a> for
                    providing free, fast, and reliable CDN hosting for all IconFly icons.
                  </p>
                  <p className="text-sm text-gray-600">
                    CDN Base URL: <code className="bg-white px-2 py-1 rounded border border-purple-200 text-purple-700">
                      https://cdn.jsdelivr.net/gh/Dip20/iconfly@main/
                    </code>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🌟</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-green-900">Open Source Community</h3>
                  <p className="text-gray-700">
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
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
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