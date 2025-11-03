import { NextResponse } from 'next/server';
import { searchYouTubeCached } from '@/lib/youtube';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    if (!query) {
      return NextResponse.json({ error: 'Missing q' }, { status: 400 });
    }
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing YOUTUBE_API_KEY' }, { status: 500 });
    }
    const videoId = await searchYouTubeCached(query, apiKey);
    return NextResponse.json({ videoId }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'YouTube search failed' }, { status: 500 });
  }
}



