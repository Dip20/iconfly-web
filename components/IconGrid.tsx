'use client';

import { useState } from 'react';

interface Icon {
    key: string;
    label: string;
    style: string;
    cdnUrl: string;
}

interface IconGridProps {
    icons: Icon[];
    color: string;
}

export default function IconGrid({ icons, color }: IconGridProps) {
    const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
    const [copiedType, setCopiedType] = useState<string>('');

    const handleCopySVG = async (icon: Icon) => {
        try {
            const response = await fetch(icon.cdnUrl);
            const svgText = await response.text();
            const coloredSvg = svgText.replace(
                /<svg/,
                `<svg fill="${color}"`
            );
            await navigator.clipboard.writeText(coloredSvg);
            setCopiedIcon(icon.key + icon.style);
            setCopiedType('svg');
            setTimeout(() => setCopiedIcon(null), 2000);
        } catch (err) {
            console.error('Failed to copy SVG:', err);
        }
    };

    const handleCopyCDN = async (icon: Icon) => {
        try {
            await navigator.clipboard.writeText(icon.cdnUrl);
            setCopiedIcon(icon.key + icon.style);
            setCopiedType('cdn');
            setTimeout(() => setCopiedIcon(null), 2000);
        } catch (err) {
            console.error('Failed to copy CDN:', err);
        }
    };

    const handleDownload = async (icon: Icon) => {
        try {
            const response = await fetch(icon.cdnUrl);
            const svgText = await response.text();

            // Apply the selected color to the SVG by replacing all path fills
            let coloredSvg = svgText;

            // Method 1: Add fill to the SVG root element
            coloredSvg = coloredSvg.replace(
                /<svg([^>]*)>/,
                `<svg$1 fill="${color}">`
            );

            // Method 2: Also replace any existing fill attributes in paths
            coloredSvg = coloredSvg.replace(
                /fill="currentColor"/g,
                `fill="${color}"`
            );

            // Method 3: Replace any other fill colors
            coloredSvg = coloredSvg.replace(
                /fill="#[0-9A-Fa-f]{3,6}"/g,
                `fill="${color}"`
            );

            const blob = new Blob([coloredSvg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${icon.key}-${icon.style}-${color.replace('#', '')}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download:', err);
            alert('Failed to download icon. Please try again.');
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {icons.map((icon, idx) => (
                <div
                    key={`${icon.key}-${icon.style}-${idx}`}
                    className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 cursor-pointer group relative transition-all hover:shadow-lg"
                    title={icon.label}
                >
                    <div
                        className="w-12 h-12 bg-cover bg-center bg-no-repeat"
                        style={{
                            maskImage: `url(${icon.cdnUrl})`,
                            WebkitMaskImage: `url(${icon.cdnUrl})`,
                            maskSize: 'contain',
                            WebkitMaskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskPosition: 'center',
                            backgroundColor: color,
                        }}
                    />
                    <span className="text-xs mt-2 text-center truncate w-full">
                        {icon.label}
                    </span>

                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => handleCopySVG(icon)}
                            className="bg-blue-500 text-white p-1.5 rounded-lg text-xs hover:bg-blue-600 transition-colors shadow-md"
                            title="Copy SVG Code"
                        >
                            {copiedIcon === icon.key + icon.style && copiedType === 'svg' ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={() => handleCopyCDN(icon)}
                            className="bg-purple-500 text-white p-1.5 rounded-lg text-xs hover:bg-purple-600 transition-colors shadow-md"
                            title="Copy CDN URL"
                        >
                            {copiedIcon === icon.key + icon.style && copiedType === 'cdn' ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={() => handleDownload(icon)}
                            className="bg-green-500 text-white p-1.5 rounded-lg text-xs hover:bg-green-600 transition-colors shadow-md"
                            title="Download SVG"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </button>
                    </div>

                    {/* Style badge */}
                    <span className="absolute bottom-2 left-2 text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        {icon.style}
                    </span>
                </div>
            ))}
        </div>
    );
}