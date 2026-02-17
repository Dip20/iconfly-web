'use client';

import { useState, useEffect } from 'react';

interface IconPreviewModalProps {
    icon: {
        key: string;
        label: string;
        style: string;
        cdnUrl: string;
        styles?: string[];
    };
    isOpen: boolean;
    onClose: () => void;
}

const PRESET_COLORS = [
    '#3B82F6',
    '#8B5CF6',
    '#EF4444',
    '#10B981',
    '#F59E0B',
];

export default function IconPreviewModal({ icon, isOpen, onClose }: IconPreviewModalProps) {

    const [selectedColor, setSelectedColor] = useState('#3B82F6');
    const [customColor, setCustomColor] = useState('#3B82F6');
    const [selectedStyle, setSelectedStyle] = useState(icon.style);
    const [showColorPicker, setShowColorPicker] = useState(false);

    // Read the global dark class from <html> as the default
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof document !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });

    // Sync with the ThemeProvider whenever the modal opens or the global class changes
    useEffect(() => {
        if (!isOpen) return;

        const syncWithTheme = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };

        // Set initial value when modal opens
        syncWithTheme();

        // Watch for external theme changes (e.g. ThemeToggle button)
        const observer = new MutationObserver(syncWithTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, [isOpen]);

    const availableStyles = icon.styles || [icon.style];

    if (!isOpen) return null;

    const handleDownload = async () => {
        try {
            const cdnUrl = icon.cdnUrl.replace(icon.style, selectedStyle);
            const response = await fetch(cdnUrl);
            const svgText = await response.text();

            let coloredSvg = svgText;
            coloredSvg = coloredSvg.replace(/<svg([^>]*)>/, `<svg$1 fill="${selectedColor}">`);
            coloredSvg = coloredSvg.replace(/fill="currentColor"/g, `fill="${selectedColor}"`);
            coloredSvg = coloredSvg.replace(/fill="#[0-9A-Fa-f]{3,6}"/g, `fill="${selectedColor}"`);

            const blob = new Blob([coloredSvg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${icon.key}-${selectedStyle}-${selectedColor.replace('#', '')}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download:', err);
        }
    };

    const handleCopySVG = async () => {
        try {
            const cdnUrl = icon.cdnUrl.replace(icon.style, selectedStyle);
            const response = await fetch(cdnUrl);
            const svgText = await response.text();

            let coloredSvg = svgText;
            coloredSvg = coloredSvg.replace(/<svg([^>]*)>/, `<svg$1 fill="${selectedColor}">`);
            coloredSvg = coloredSvg.replace(/fill="currentColor"/g, `fill="${selectedColor}"`);

            await navigator.clipboard.writeText(coloredSvg);
            alert('SVG copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                        } rounded-3xl shadow-2xl max-w-2xl w-full pointer-events-auto animate-scale-in overflow-hidden border transition-colors`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                        <div>
                            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {icon.label}
                            </h2>
                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {icon.key}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Dark Mode Toggle — overrides the ThemeProvider default locally */}
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                                    } flex items-center justify-center transition-colors`}
                                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {isDarkMode ? (
                                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </svg>
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                                    } flex items-center justify-center transition-colors`}
                            >
                                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Large Preview Area */}
                    <div className={`p-12 ${isDarkMode
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                        : 'bg-gradient-to-br from-gray-50 to-gray-100'
                        } flex items-center justify-center`}>
                        <div className="relative">
                            <div
                                className="w-48 h-48 bg-cover bg-center bg-no-repeat transform transition-all duration-300 hover:scale-110"
                                style={{
                                    maskImage: `url(${icon.cdnUrl.replace(icon.style, selectedStyle)})`,
                                    WebkitMaskImage: `url(${icon.cdnUrl.replace(icon.style, selectedStyle)})`,
                                    maskSize: 'contain',
                                    WebkitMaskSize: 'contain',
                                    maskRepeat: 'no-repeat',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskPosition: 'center',
                                    WebkitMaskPosition: 'center',
                                    backgroundColor: selectedColor,
                                }}
                            />
                            <div
                                className="absolute inset-0 blur-3xl opacity-30 -z-10"
                                style={{ backgroundColor: selectedColor }}
                            />
                        </div>
                    </div>

                    {/* Style Selector */}
                    <div className={`px-6 py-4 border-y ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                        }`}>
                        <label className={`text-sm font-medium mb-3 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>Style</label>
                        <div className="flex gap-2">
                            {availableStyles.map((style) => (
                                <button
                                    key={style}
                                    onClick={() => setSelectedStyle(style)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedStyle === style
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                        : isDarkMode
                                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                        }`}
                                >
                                    {style.charAt(0).toUpperCase() + style.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selector */}
                    <div className={`p-6 ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                        <label className={`text-sm font-medium mb-3 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>Color</label>

                        <div className="flex gap-3 mb-4">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => {
                                        setSelectedColor(color);
                                        setCustomColor(color);
                                        setShowColorPicker(false);
                                    }}
                                    className={`w-12 h-12 rounded-xl transition-all hover:scale-110 ${selectedColor === color && !showColorPicker
                                        ? 'ring-4 ring-white ring-offset-2 ring-offset-gray-900 shadow-lg'
                                        : 'hover:ring-2 hover:ring-white/50'
                                        }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}

                            <button
                                onClick={() => setShowColorPicker(!showColorPicker)}
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 transition-all hover:scale-110 ${showColorPicker
                                    ? 'ring-4 ring-white ring-offset-2 ring-offset-gray-900 shadow-lg'
                                    : 'hover:ring-2 hover:ring-white/50'
                                    }`}
                                title="Custom color"
                            />
                        </div>

                        {showColorPicker && (
                            <div className={`flex items-center gap-3 p-3 rounded-xl animate-fade-in ${isDarkMode ? 'bg-gray-700/50' : 'bg-white border border-gray-200'
                                }`}>
                                <input
                                    type="color"
                                    value={customColor}
                                    onChange={(e) => {
                                        setCustomColor(e.target.value);
                                        setSelectedColor(e.target.value);
                                    }}
                                    className={`w-16 h-16 rounded-lg cursor-pointer border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'
                                        }`}
                                />
                                <div className="flex-1">
                                    <label className={`text-xs mb-1 block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>Hex Color</label>
                                    <input
                                        type="text"
                                        value={customColor}
                                        onChange={(e) => {
                                            setCustomColor(e.target.value);
                                            setSelectedColor(e.target.value);
                                        }}
                                        className={`w-full px-4 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode
                                            ? 'bg-gray-800 border-gray-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        placeholder="#000000"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className={`p-6 flex gap-3 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                        }`}>
                        <button
                            onClick={handleCopySVG}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${isDarkMode
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy SVG
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
        </>
    );
}