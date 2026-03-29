export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    
    const term = url.searchParams.get("term");
    const country = (url.searchParams.get("country") || "us").toLowerCase().replace(/[^a-z]/g, "").substring(0, 2);
    const entity = url.searchParams.get("entity") || "songs";

    if (!term) {
        return new Response(JSON.stringify({ error: "Missing search term" }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        // 1. Use token from your Cloudflare env variable (recommended), you may also hardcode your token here (risky)
        const token = env.APPLE_MUSIC_TOKEN;

        if (!token) throw new Error("Apple Music token not found");

        // 2. Query the Apple Music API
        let data;
        
        if (entity === 'idAlbum') {
            // Validation: Ensure the Apple ID is numeric
            if (!/^\d+$/.test(term)) {
                return new Response(JSON.stringify({ error: "Invalid Apple ID format. ID must be numeric." }), { 
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }

            // Try Album ID first
            let amUrl = `https://amp-api.music.apple.com/v1/catalog/${country}/albums/${encodeURIComponent(term)}`;
            let searchResponse = await fetch(amUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Origin': 'https://music.apple.com',
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            // If Album not found, try Song ID
            if (!searchResponse.ok) {
                amUrl = `https://amp-api.music.apple.com/v1/catalog/${country}/songs/${encodeURIComponent(term)}`;
                searchResponse = await fetch(amUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Origin': 'https://music.apple.com',
                        'User-Agent': 'Mozilla/5.0'
                    }
                });
            }

            if (!searchResponse.ok) throw new Error(`Apple API returned ${searchResponse.status}`);
            const rawData = await searchResponse.json();
            
            if (!rawData.data || rawData.data.length === 0) {
                 return new Response(JSON.stringify({ results: {} }), { headers: { "Content-Type": "application/json" } });
            }

            const resultType = rawData.data[0].type === 'songs' ? 'songs' : 'albums';
            data = {
                results: {
                    [resultType]: {
                        data: rawData.data
                    }
                }
            };

        } else {
            const type = (entity === 'album') ? 'albums' : 'songs';
            const appleMusicUrl = `https://amp-api.music.apple.com/v1/catalog/${country}/search?term=${encodeURIComponent(term)}&types=${type}&limit=10`;

            const searchResponse = await fetch(appleMusicUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Origin': 'https://music.apple.com',
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            if (!searchResponse.ok) throw new Error(`Apple API returned ${searchResponse.status}`);
            data = await searchResponse.json();
        }

        // 3. Return the JSON to frontend
        return new Response(JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}