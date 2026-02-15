const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getIcons({
    q = '',
    page = 1,
    limit = 50,
    style = 'all',
}: {
    q?: string;
    page?: number;
    limit?: number;
    style?: string;
}) {
    const res = await fetch(
        `${API_BASE_URL}/icons?q=${q}&page=${page}&limit=${limit}&style=${style}`
    );

    if (!res.ok) throw new Error('Failed to fetch icons');

    return res.json();
}
