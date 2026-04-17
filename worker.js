// ============================================
// OPC Alliance — Unified API Proxy (Cloudflare Worker)
// 
// 代理两个 API：
// 1. SecondMe (app.mindos.com/gate/lab)
// 2. MIMO AI (api.xiaomimimo.com/v1)
//
// 部署步骤:
// 1. 打开 https://dash.cloudflare.com
// 2. Workers & Pages → Create Worker
// 3. 粘贴此代码 → Deploy
// 4. 记下 Worker URL (如 https://opc-proxy.xxx.workers.dev)
// 5. 更新 OPC Alliance 的代理 URL
// ============================================

// ===== API 配置 =====
const SECONDME = {
    target: 'https://app.mindos.com/gate/lab',
    token: 'lba_at_b68964ac5cbb50eee8ac87eaadfe122fe5d8261684971e379656435f019f7b4d'
};

const MIMO = {
    target: 'https://api.xiaomimimo.com',
    token: 'sk-ccwzuzw9e1t42xjok84nfx7wrv4geuzc590ojipwfqga5uxl'
};

// 允许的来源
const ALLOWED_ORIGINS = [
    'https://mokangmedical.github.io',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:3000'
];

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const origin = request.headers.get('Origin') || '';

        // CORS 响应头
        const corsHeaders = {
            'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
        };

        // CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Health check
        if (url.pathname === '/' || url.pathname === '/health') {
            return new Response(JSON.stringify({
                status: 'ok',
                service: 'OPC Alliance — Unified API Proxy',
                targets: {
                    secondme: SECONDME.target,
                    mimo: MIMO.target
                },
                time: new Date().toISOString()
            }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }

        // ---- 代理逻辑 ----
        // 支持两种调用方式：
        // 方式1: ?path=/api/xxx&other=params  (SecondMe 用)
        // 方式2: /v1/xxx  直接路径 (MIMO 用，兼容 OpenAI 格式)

        let targetBase, authToken, targetUrl;

        // 判断用哪个 API
        if (url.pathname.startsWith('/v1/')) {
            // MIMO API (OpenAI 兼容路径)
            targetBase = MIMO.target;
            authToken = `Bearer ${MIMO.token}`;
            targetUrl = new URL(url.pathname + url.search, MIMO.target);
        } else {
            // SecondMe API (通过 ?path= 参数)
            const apiPath = url.searchParams.get('path');
            if (!apiPath) {
                return new Response(JSON.stringify({
                    error: 'Missing ?path= parameter',
                    usage: 'GET/POST ?path=/api/secondme/... 或 /v1/chat/completions',
                    endpoints: {
                        secondme: '?path=/api/secondme/plaza/feed&pageNo=1&pageSize=10',
                        mimo: '/v1/chat/completions (POST, OpenAI格式)'
                    }
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }
            targetBase = SECONDME.target;
            authToken = `Bearer ${SECONDME.token}`;
            targetUrl = new URL(SECONDME.target + apiPath);
            // 传递除 path 以外的 query params
            url.searchParams.forEach((value, key) => {
                if (key !== 'path') targetUrl.searchParams.set(key, value);
            });
        }

        // 转发请求
        try {
            const fetchOpts = {
                method: request.method,
                headers: {
                    'Authorization': authToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            };

            if (request.method !== 'GET' && request.method !== 'HEAD') {
                const body = await request.text();
                if (body) fetchOpts.body = body;
            }

            const resp = await fetch(targetUrl.toString(), fetchOpts);
            const data = await resp.text();

            return new Response(data, {
                status: resp.status,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                    'Cache-Control': 'no-cache',
                }
            });
        } catch (err) {
            return new Response(JSON.stringify({
                code: 502,
                message: `Proxy error: ${err.message}`,
                target: targetUrl.toString()
            }), {
                status: 502,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
    }
};
