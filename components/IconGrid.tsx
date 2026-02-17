'use client';

import { useState } from 'react';
import IconPreviewModal from './IconPreviewModal';

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
    const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCopySVG = async (icon: Icon, e: React.MouseEvent) => {
        e.stopPropagation();
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

    const handleCopyCDN = async (icon: Icon, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(icon.cdnUrl);
            setCopiedIcon(icon.key + icon.style);
            setCopiedType('cdn');
            setTimeout(() => setCopiedIcon(null), 2000);
        } catch (err) {
            console.error('Failed to copy CDN:', err);
        }
    };

    const handleDownload = async (icon: Icon, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await fetch(icon.cdnUrl);
            const svgText = await response.text();

            let coloredSvg = svgText;
            coloredSvg = coloredSvg.replace(/<svg([^>]*)>/, `<svg$1 fill="${color}">`);
            coloredSvg = coloredSvg.replace(/fill="currentColor"/g, `fill="${color}"`);
            coloredSvg = coloredSvg.replace(/fill="#[0-9A-Fa-f]{3,6}"/g, `fill="${color}"`);

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
        }
    };

    const handleIconClick = (icon: Icon) => {
        setSelectedIcon(icon);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {icons.map((icon, idx) => (
                    <div
                        key={`${icon.key}-${icon.style}-${idx}`}
                        onClick={() => handleIconClick(icon)}
                        className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-gray-50 cursor-pointer group relative transition-all hover:shadow-lg hover:border-blue-300"
                        title={`Click to preview ${icon.label}`}
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

                        {/* Quick Action buttons */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => handleCopySVG(icon, e)}
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
                                onClick={(e) => handleCopyCDN(icon, e)}
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
                                onClick={(e) => handleDownload(icon, e)}
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

                        {/* Click hint */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500/10 rounded-xl pointer-events-none">
                            <span className="text-xs font-medium text-blue-600 bg-white px-3 py-1 rounded-full shadow-lg">
                                Click to preview
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview Modal */}
            {selectedIcon && (
                <IconPreviewModal
                    icon={selectedIcon}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedIcon(null);
                    }}
                />
            )}
        </>
    );
}