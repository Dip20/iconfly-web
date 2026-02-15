export default function IconCard({ icon, color }: any) {
    const svgUrl = `${icon.cdnUrl}?color=${encodeURIComponent(color)}`;

    const copy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        alert('Copied!');
    };

    const download = async () => {
        const res = await fetch(svgUrl);
        const svg = await res.text();
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${icon.key}-${icon.style}.svg`;
        a.click();
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition-shadow">
            <img src={svgUrl} alt={icon.label} className="w-12 h-12 mb-2" />
            <div className="text-sm font-medium mb-2 text-center">{icon.key}</div>

            <div className="flex gap-2">
                <button
                    onClick={() => copy(svgUrl)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                >
                    CDN
                </button>
                <button
                    onClick={download}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                >
                    SVG
                </button>
            </div>
        </div>
    );
}
