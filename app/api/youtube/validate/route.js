import { NextResponse } from 'next/server';
import { extractYouTubeVideoId } from '@/lib/utils/youtube';

// Validates a YouTube video for public/playable/embeddable status using Data API v3
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const raw = searchParams.get('id') || searchParams.get('videoId') || searchParams.get('url') || '';
    if (!raw) {
      return NextResponse.json({ ok: false, error: 'Missing id or url' }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'Missing YOUTUBE_API_KEY' }, { status: 500 });
    }

    const id = extractYouTubeVideoId(raw) || raw;
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ ok: false, error: 'Invalid video id/url' }, { status: 400 });
    }

    const params = new URLSearchParams({
      key: apiKey,
      id,
      part: 'status,contentDetails,snippet',
      maxResults: '1'
    });

    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params.toString()}`);
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: 'YouTube API error' }, { status: 502 });
    }

    const data = await res.json();
    const item = data?.items?.[0];

    if (!item) {
      return NextResponse.json({ ok: false, playable: false, reason: 'not_found' }, { status: 404 });
    }

    const status = item.status || {};
    const snippet = item.snippet || {};

    // Basic playability rules for embedding
    const isPublic = status.privacyStatus === 'public';
    const embeddable = Boolean(status.embeddable);
    const uploadOk = ['processed', 'uploaded'].includes(status.uploadStatus);

    const playable = isPublic && embeddable && uploadOk;

    // Best-effort thumbnail selection
    const t = snippet.thumbnails || {};
    const thumb = t.maxres || t.standard || t.high || t.medium || t.default || null;

    return NextResponse.json({
      ok: true,
      playable,
      id,
      title: snippet.title || null,
      channelTitle: snippet.channelTitle || null,
      thumbnail: thumb?.url || null,
      reason: playable ? null : 'unplayable'
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Unexpected server error' }, { status: 500 });
  }
}
