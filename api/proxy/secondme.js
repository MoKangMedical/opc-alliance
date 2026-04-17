// Vercel Serverless Proxy — SecondMe API
// Routes: /api/proxy/secondme/*

const TARGET = 'https://app.mindos.com/gate/lab';
const TOKEN = 'lba_at_b68964ac5cbb50eee8ac87eaadfe122fe5d8261684971e379656435f019f7b4d';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Build target path from query
    const path = req.query.path || '';
    const queryString = Object.entries(req.query)
        .filter(([k]) => k !== 'path')
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&');

    const url = `${TARGET}${path}${queryString ? '?' + queryString : ''}`;

    try {
        const fetchOptions = {
            method: req.method,
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        };

        if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
            fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        }

        const resp = await fetch(url, fetchOptions);
        const data = await resp.json();

        res.status(resp.status).json(data);
    } catch (err) {
        res.status(502).json({
            code: 502,
            message: `Proxy error: ${err.message}`,
            subCode: 'proxy_error'
        });
    }
}
