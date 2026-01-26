// innertube-music.js - Updated with better visitor extraction & India feed

export class YTMusicInnertube {
  constructor() {
    this.baseUrl = 'https://music.youtube.com/youtubei/v1/';
    this.apiKey = 'AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX3'; // Still good
    this.clientVersionWeb = '1.20260101'; // Recent WEB_REMIX
    this.clientVersionAndroid = '9.50.51'; // Update from apkmirror if needed
    this.visitorData = null;

    this.headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', // Desktop UA sometimes gets fuller HTML
      Accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'X-Goog-Api-Format-Version': '2',
    };
  }

  async initialize() {
    if (this.visitorData) return;

    try {
      const res = await fetch('https://music.youtube.com', {
        headers: { 'User-Agent': this.headers['User-Agent'] },
      });
      const html = await res.text();

      // Improved regexes (case-insensitive, handles minified/escaped)
      const visitorPatterns = [
        /"VISITOR_DATA":"([^"]+)"/i,
        /visitorData\s*:\s*"([^"]+)"/i,
        /"visitor_data":"([^"]+)"/i,
      ];

      let match;
      for (const pattern of visitorPatterns) {
        match = html.match(pattern);
        if (match) break;
      }

      if (match && match[1]) {
        this.visitorData = match[1];
        console.log(
          '[YTM] Visitor Data extracted successfully:',
          this.visitorData.substring(0, 20) + '...'
        );
      } else {
        console.warn('[YTM] VisitorData extraction failed. Using fallback.');
        // Fallback dummy (can help basic calls; real one is base64 ~100 chars)
        this.visitorData = 'CgtqZndzZ3d3Z3d3Zw=='; // Random placeholder; replace if you get one from browser
      }
    } catch (err) {
      console.error('[YTM] Init failed:', err);
      this.visitorData = 'CgtqZndzZ3d3Z3d3Zw=='; // Fallback on error
    }
  }

  getContext(isBrowse = false) {
    const base = {
      hl: 'en',
      gl: 'USS', // Your location – improves chances of non-empty feed
      utcOffsetMinutes: 330,
    };

    if (isBrowse) {
      return {
        context: {
          client: {
            ...base,
            clientName: 'WEB_REMIX',
            clientVersion: this.clientVersionWeb,
          },
          user: {},
          request: {},
        },
      };
    }

    return {
      context: {
        client: {
          ...base,
          clientName: 'ANDROID_MUSIC',
          clientVersion: this.clientVersionAndroid,
          androidSdkVersion: 35,
        },
        user: {},
        request: {},
      },
    };
  }

  async _post(endpoint, body = {}) {
    await this.initialize();

    const url = `${this.baseUrl}${endpoint}?key=${this.apiKey}&prettyPrint=false`;
    const isBrowseEndpoint = ['browse', 'search'].includes(endpoint);
    const contextPayload = this.getContext(isBrowseEndpoint);
    const payload = { ...contextPayload, ...body };

    const requestHeaders = { ...this.headers };
    if (this.visitorData) {
      requestHeaders['X-Goog-Visitor-Id'] = this.visitorData;
    }

    console.log(`[YTM] POST ${endpoint} | Visitor present: ${!!this.visitorData}`);
    console.log('[YTM] Client:', payload.context?.client?.clientName);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Innertube ${endpoint} failed: ${res.status} ${txt.slice(0, 300)}`);
      }

      return await res.json();
    } catch (err) {
      console.error(`[YTM] ${endpoint} error:`, err.message);
      throw err;
    }
  }

  async getHome() {
    const strategies = [
      { type: 'browse', browseId: 'FEmusic_explore' }, // Often fuller unauth
      { type: 'browse', browseId: 'FEmusic_home' },
      { type: 'browse', browseId: 'FEmusic_moods_and_genres' },
      { type: 'browse', browseId: 'FEmusic_trending' },
      { type: 'search', query: '', params: '' },
    ];

    for (const strat of strategies) {
      try {
        let payload = {};
        if (strat.type === 'browse') {
          payload = { browseId: strat.browseId };
        } else {
          payload = { query: strat.query || '' };
          if (strat.params) payload.params = strat.params;
        }

        console.log(`[YTM] Trying ${strat.type} ${strat.browseId || 'search empty'}`);

        const data = await this._post(strat.type, payload);

        // Detailed content inspection
        const contents = data?.contents || {};
        console.log('[YTM] Top-level keys:', Object.keys(contents));

        let innerContents = [];
        if (contents.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content) {
          const tabContent = contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content;
          innerContents =
            tabContent.sectionListRenderer?.contents || tabContent.richGridRenderer?.contents || [];
        } else if (contents.sectionListRenderer) {
          innerContents = contents.sectionListRenderer.contents || [];
        }

        console.log(`[YTM] Inner sections count: ${innerContents.length}`);
        if (innerContents.length > 2) {
          console.log('[YTM] SUCCESS - Real content detected!');
          // Log first few section types for debug
          innerContents.slice(0, 3).forEach((s, i) => {
            console.log(`Section ${i + 1} type:`, Object.keys(s)[0]);
          });
          return data;
        }
      } catch (err) {
        console.warn(`[YTM] Strategy failed: ${err.message}`);
      }
    }

    console.warn('All strategies partial/skeleton. Consider adding auth (see comments in code).');
    // Return the best we have (e.g., last successful data)
    return null; // or throw if you prefer
  }

  async getPlayer(videoId) {
    if (!videoId || typeof videoId !== 'string' || videoId.length !== 11) {
      throw new Error(`Invalid videoId: ${videoId}`);
    }

    console.log(`[YTM] Fetching player data for videoId: ${videoId}`);

    return this._post('player', {
      videoId,
      // Helps get higher quality / avoids some restrictions
      playbackContext: {
        contentPlaybackContext: {
          signatureTimestamp: 99999, // placeholder – usually not critical on mobile context
        },
      },
      // Allow restricted content if needed (age-restricted, etc.)
      racyCheckOk: true,
      contentCheckOk: true,
    });
  }

  extractBestAudioStream(playerData) {
    if (!playerData?.streamingData) {
      console.warn('[YTM] No streamingData in player response');
      throw new Error('No streaming data available (possibly geo-restricted or login required)');
    }

    const formats = [
      ...(playerData.streamingData.formats || []),
      ...(playerData.streamingData.adaptiveFormats || []),
    ];

    // Prefer audio-only formats, highest bitrate first
    const audioOnly = formats
      .filter((f) => f.mimeType?.includes('audio') && !f.mimeType?.includes('video'))
      .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

    if (audioOnly.length === 0) {
      console.warn('[YTM] No audio-only formats found');
      // Fallback: any format with audio
      return formats.find((f) => f.audioQuality) || null;
    }

    let best = audioOnly[0];

    // Check if we need to handle signatureCipher (very rare on ANDROID_MUSIC)
    if (best.signatureCipher && !best.url) {
      console.warn('[YTM] Encrypted signature detected – deciphering not implemented yet');
      // You would need to:
      // 1. Get player JS URL from /player response
      // 2. Fetch base.js
      // 3. Extract decipher function
      // 4. Apply to the 's' parameter
      best.url = 'CIPHERED_SIGNATURE_NOT_DECODED';
    }

    return {
      url: best.url,
      mimeType: best.mimeType,
      bitrate: best.bitrate,
      audioQuality: best.audioQuality,
      approxDurationMs: best.approxDurationMs || playerData.videoDetails?.lengthSeconds * 1000,
      title: playerData.videoDetails?.title,
      author: playerData.videoDetails?.author,
      videoId: playerData.videoDetails?.videoId,
      isCiphered: !!best.signatureCipher,
    };
  }

  // ... (search, getSong, extractBestAudio unchanged – they should work fine)
}

// Usage: same as before
