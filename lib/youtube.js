import fs from 'fs';
import path from 'path';

const CACHE_FILENAME = 'youtubeCache.json';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getCacheFilePath() {
  // Store alongside this file in lib/
  return path.join(process.cwd(), 'mindcourse', 'lib', CACHE_FILENAME);
}

function readCache() {
  try {
    const filePath = getCacheFilePath();
    if (!fs.existsSync(filePath)) return {};
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

function writeCache(cache) {
  try {
    const filePath = getCacheFilePath();
    fs.writeFileSync(filePath, JSON.stringify(cache, null, 2), 'utf8');
  } catch {
    // ignore cache write errors
  }
}

export async function searchYouTubeCached(query, apiKey) {
  if (!query || !apiKey) return null;
  const key = query.trim().toLowerCase();
  const cache = readCache();
  const entry = cache[key];
  const now = Date.now();

  if (entry && typeof entry === 'object') {
    const isFresh = now - (entry.timestamp || 0) < CACHE_TTL_MS;
    if (entry.videoId && isFresh) {
      return entry.videoId;
    }
  }

  try {
    const params = new URLSearchParams({
      key: apiKey,
      q: query,
      part: 'snippet',
      type: 'video',
      maxResults: '1',
      safeSearch: 'moderate'
    });
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    const videoId = data?.items?.[0]?.id?.videoId || null;
    // Update cache
    cache[key] = { videoId, timestamp: now };
    writeCache(cache);
    return videoId;
  } catch {
    return null;
  }
}



