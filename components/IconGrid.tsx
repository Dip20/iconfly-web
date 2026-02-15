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
            setCopiedIcon(icon.key);
            setCopiedType('svg');
            setTimeout(() => setCopiedIcon(null), 2000);
        } catch (err) {
            console.error('Failed to copy SVG:', err);
        }
    };

    const handleCopyCDN = async (icon: Icon) => {
        try {
            await navigator.clipboard.writeText(icon.cdnUrl);
            setCopiedIcon(icon.key);
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
            const coloredSvg = svgText.replace(
                /<svg/,
                `<svg fill="${color}"`
            );
            const blob = new Blob([coloredSvg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${icon.key}-${icon.style}.svg`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download:', err);
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {icons.map((icon, idx) => (
                <div
                    key={`${icon.key}-${icon.style}-${idx}`}
                    className="flex flex-col items-center justify-center p-4 border rounded hover:bg-gray-50 cursor-pointer group relative"
                    title={icon.label}
                >
                    <div
                        className="w-12 h-12 bg-cover bg-center bg-no-repeat"
                        style={{
                            maskImage: `url(${icon.cdnUrl})`,
                            WebkitMaskImage: `url(${icon.cdnUrl})`,
                            maskSize: 'contain',
                            WebkitMaskSize: 'contain',
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
                            className="bg-blue-500 text-white p-1.5 rounded text-xs hover:bg-blue-600"
                            title="Copy SVG"
                        >
                            {copiedIcon === icon.key && copiedType === 'svg' ? '✓' : '📋'}
                        </button>
                        <button
                            onClick={() => handleCopyCDN(icon)}
                            className="bg-purple-500 text-white p-1.5 rounded text-xs hover:bg-purple-600"
                            title="Copy CDN URL"
                        >
                            {copiedIcon === icon.key && copiedType === 'cdn' ? '✓' : '🔗'}
                        </button>
                        <button
                            onClick={() => handleDownload(icon)}
                            className="bg-green-500 text-white p-1.5 rounded text-xs hover:bg-green-600"
                            title="Download SVG"
                        >
                            ⬇
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}