'use client';

import { useEffect, useState } from 'react';
import { getIcons } from '../lib/iconApi';
import IconGrid from '@/components/IconGrid';

export default function Home() {
    const [q, setQ] = useState('');
    const [style, setStyle] = useState('all');
    const [color, setColor] = useState('#000000');
    const [icons, setIcons] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(90); // icons per page
    const [totalDocs, setTotalDocs] = useState(0);

    const fetchIcons = async () => {
        try {
            const res = await getIcons({ q, page, limit, style });
            let data = res.icons.data;
            // if (style !== 'all') {
            //   // data = data.filter((i: any) => i.style === style);
            // }
            setIcons(data);
            setTotalDocs(res.icons.totalDocs);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        setPage(1); // reset to first page on search / filter change
    }, [q, style]);

    useEffect(() => {
        fetchIcons();
    }, [q, style, page]);

    const prevPage = () => setPage((p) => Math.max(1, p - 1));
    const nextPage = () => setPage((p) => p + 1);

    return (
        <main className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">IconFly</h1>

            {/* Search + filter */}
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search icons..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 flex-1"
                />
                <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    <option value="all">All</option>
                    <option value="solid">Solid</option>
                    <option value="regular">Regular</option>
                    <option value="brands">Brands</option>
                </select>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-12 p-0 border-none"
                />
            </div>

            {/* Total results */}
            <div className="text-sm text-gray-600 mb-4">
                Total icons found: {totalDocs}
            </div>

            {/* Icons grid */}
            <IconGrid icons={icons} color={color} />

            {/* Pagination buttons */}
            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={prevPage}
                    disabled={page === 1}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={nextPage}
                    disabled={icons.length < limit}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </main>
    );
}
