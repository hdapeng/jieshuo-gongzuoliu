interface YouTubeVideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string; width: number; height: number; };
    medium: { url: string; width: number; height: number; };
    high: { url: string; width: number; height: number; };
  };
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: string;
}

/* interface YouTubeVideoDetails { // Temporarily commented out as it's not used yet
  statistics: {
    viewCount: string;
    likeCount?: string;
    dislikeCount?: string;
    favoriteCount: string;
    commentCount?: string;
  };
  contentDetails: {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
    licensedContent: boolean;
    regionRestriction?: {
      allowed?: string[];
      blocked?: string[];
    };
  };
  snippet: YouTubeVideoSnippet;
  durationSeconds: number;
  durationLabel: string;
} */

interface YouTubeVideoFilters {
  q?: string;
  order?: string;
  sortDirection?: string;
  pageToken?: string;
  publishedAfter?: string;
  publishedBefore?: string;
  relevanceLanguage?: string;
  regionCode?: string;
  safeSearch?: string;
  videoDuration?: string;
  videoCaption?: string;
  videoEmbeddable?: string;
  videoLicense?: string;
  videoSyndicated?: string;
  videoType?: string;
  videoCategoryId?: string;
  maxResults?: number;
}

interface YouTubeVideoSearchResult {
  items: Array<Record<string, unknown>>; // We can refine this later if needed
  nextPageToken?: string;
  snippets: Record<string, YouTubeVideoSnippet>;
}

export async function searchVideos(apiKey: string, filters: YouTubeVideoFilters): Promise<YouTubeVideoSearchResult> {
  try {
    // 构建YouTube API请求URL
    const baseUrl = 'https://www.googleapis.com/youtube/v3/search';
    const params = new URLSearchParams({
      part: 'snippet',
      key: apiKey,
      q: filters.q || '',
      maxResults: filters.maxResults?.toString() || '20',
      type: 'video',
      order: filters.order || 'relevance',
    });

    // 添加可选筛选参数
    if (filters.publishedAfter) params.append('publishedAfter', filters.publishedAfter);
    if (filters.publishedBefore) params.append('publishedBefore', filters.publishedBefore);
    if (filters.relevanceLanguage) params.append('relevanceLanguage', filters.relevanceLanguage);
    if (filters.regionCode) params.append('regionCode', filters.regionCode);
    if (filters.safeSearch) params.append('safeSearch', filters.safeSearch);
    if (filters.videoDuration) params.append('videoDuration', filters.videoDuration);
    if (filters.videoCaption) params.append('videoCaption', filters.videoCaption);
    if (filters.videoEmbeddable) params.append('videoEmbeddable', filters.videoEmbeddable);
    if (filters.videoLicense) params.append('videoLicense', filters.videoLicense);
    if (filters.videoSyndicated) params.append('videoSyndicated', filters.videoSyndicated);
    if (filters.videoType) params.append('videoType', filters.videoType);
    if (filters.videoCategoryId) params.append('videoCategoryId', filters.videoCategoryId);
    if (filters.pageToken) params.append('pageToken', filters.pageToken);

    const url = `${baseUrl}?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `YouTube API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const snippets: Record<string, YouTubeVideoSnippet> = {};

    // 处理返回的视频数据
    const items = data.items.map((item: Record<string, unknown>) => {
      snippets[item.id.videoId] = item.snippet;
      return item;
    });

    return {
      items,
      nextPageToken: data.nextPageToken,
      snippets
    };
  } catch (error) {
    console.error('YouTube视频搜索失败:', error);
    throw new Error(`YouTube视频搜索失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function parseIsoDurationToSeconds(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  const h = Number(m[1] || 0);
  const min = Number(m[2] || 0);
  const s = Number(m[3] || 0);
  return h * 3600 + min * 60 + s;
}

// function formatDuration(sec: number): string { // Temporarily commented out as it's not used yet
//   const h = Math.floor(sec / 3600);
//   const m = Math.floor((sec % 3600) / 60);
//   const s = sec % 60;
//   const pad = (n: number) => String(n).padStart(2, '0');
//   if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
//   return `${m}:${pad(s)}`;
// }
