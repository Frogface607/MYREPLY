import { NextRequest, NextResponse } from 'next/server';

/**
 * Universal AI API proxy for Moltbot VPS.
 * Russian VPS IP is geo-blocked by Groq/Gemini — this Vercel route forwards requests.
 * 
 * Usage: set OpenClaw baseUrl to https://my-reply.ru/api/ai-proxy/groq/openai/v1
 * Then OpenClaw appends /audio/transcriptions → full URL:
 *   https://my-reply.ru/api/ai-proxy/groq/openai/v1/audio/transcriptions
 * This proxy forwards to:
 *   https://api.groq.com/openai/v1/audio/transcriptions
 */

const TARGETS: Record<string, string> = {
  groq: 'https://api.groq.com',
  gemini: 'https://generativelanguage.googleapis.com',
};

const PROXY_SECRET = process.env.AI_PROXY_SECRET;

function checkAuth(request: NextRequest): boolean {
  // If AI_PROXY_SECRET is set, require it via header or query param
  if (PROXY_SECRET) {
    const headerSecret = request.headers.get('x-proxy-secret');
    if (headerSecret === PROXY_SECRET) return true;
    
    const urlSecret = request.nextUrl.searchParams.get('proxy_secret');
    if (urlSecret === PROXY_SECRET) return true;
    
    return false;
  }
  
  // No secret configured — accept requests that have an Authorization header
  // (only someone with an API key can use this, and without it the proxy is useless)
  const auth = request.headers.get('authorization');
  return !!auth;
}

type RouteContext = { params: Promise<{ target: string; path: string[] }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const { target, path } = await context.params;
  
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const baseUrl = TARGETS[target];
  if (!baseUrl) {
    return NextResponse.json({ error: `Unknown target: ${target}` }, { status: 400 });
  }

  const targetPath = '/' + path.join('/');
  const targetUrl = `${baseUrl}${targetPath}`;

  try {
    const forwardHeaders: Record<string, string> = {};
    
    const authorization = request.headers.get('authorization');
    if (authorization) forwardHeaders['Authorization'] = authorization;

    const apiKey = request.headers.get('x-goog-api-key');
    if (apiKey) forwardHeaders['x-goog-api-key'] = apiKey;

    const contentType = request.headers.get('content-type');
    if (contentType) forwardHeaders['Content-Type'] = contentType;

    const body = await request.arrayBuffer();

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: forwardHeaders,
      body: body,
    });

    const responseData = await response.arrayBuffer();

    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    console.error(`AI Proxy error [${target}${targetPath}]:`, error);
    return NextResponse.json(
      { error: 'Proxy error', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { target, path } = await context.params;

  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const baseUrl = TARGETS[target];
  if (!baseUrl) {
    return NextResponse.json({ error: `Unknown target: ${target}` }, { status: 400 });
  }

  const targetPath = '/' + path.join('/');
  const url = new URL(request.url);
  url.searchParams.delete('proxy_secret');
  const queryString = url.searchParams.toString();
  const targetUrl = `${baseUrl}${targetPath}${queryString ? '?' + queryString : ''}`;

  try {
    const forwardHeaders: Record<string, string> = {};
    
    const authorization = request.headers.get('authorization');
    if (authorization) forwardHeaders['Authorization'] = authorization;

    const apiKey = request.headers.get('x-goog-api-key');
    if (apiKey) forwardHeaders['x-goog-api-key'] = apiKey;

    const response = await fetch(targetUrl, { headers: forwardHeaders });
    const data = await response.arrayBuffer();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}
