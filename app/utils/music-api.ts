export type MusicServer = 'netease' | 'tencent' | 'kugou' | 'baidu' | 'kuwo'

export type MusicType = 'search' | 'song' | 'album' | 'artist' | 'playlist' | 'lrc' | 'url' | 'pic'

export interface MusicSong {
  title: string
  author: string
  url: string
  pic: string
  lrc: string
  album?: string
}

export interface MetingApiOptions {
  /**
   * The base URL of the Meting API.
   * @example "https://api.i-meto.com/meting/api"
   */
  baseUrl: string
}

export class MetingApi {
  private baseUrl: string

  constructor(options: MetingApiOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '')
  }

  /**
   * Search for songs, albums, artists, or playlists.
   * @param server The music platform.
   * @param keyword The keyword to search for.
   * @param options Optional pagination (page, limit). Note: Support depends on the Meting API server version.
   */
  async search(
    server: MusicServer,
    keyword: string,
    options?: { page?: number; limit?: number },
  ): Promise<MusicSong[]> {
    const params: Record<string, string> = {
      server,
      type: 'search',
      id: keyword,
    }
    if (options?.page) params.page = options.page.toString()
    if (options?.limit) params.limit = options.limit.toString()

    return this._request<MusicSong[]>(params)
  }

  /**
   * Get details of a song.
   * @param server The music platform.
   * @param id The song ID.
   */
  async getSong(server: MusicServer, id: string | number): Promise<MusicSong[]> {
    return this._request<MusicSong[]>({
      server,
      type: 'song',
      id: id.toString(),
    })
  }

  /**
   * Get details of an album.
   * @param server The music platform.
   * @param id The album ID.
   */
  async getAlbum(server: MusicServer, id: string | number): Promise<MusicSong[]> {
    return this._request<MusicSong[]>({
      server,
      type: 'album',
      id: id.toString(),
    })
  }

  /**
   * Get details of an artist (songs by artist).
   * @param server The music platform.
   * @param id The artist ID.
   */
  async getArtist(server: MusicServer, id: string | number): Promise<MusicSong[]> {
    return this._request<MusicSong[]>({
      server,
      type: 'artist',
      id: id.toString(),
    })
  }

  /**
   * Get details of a playlist.
   * @param server The music platform.
   * @param id The playlist ID.
   */
  async getPlaylist(server: MusicServer, id: string | number): Promise<MusicSong[]> {
    return this._request<MusicSong[]>({
      server,
      type: 'playlist',
      id: id.toString(),
    })
  }

  /**
   * Get lyrics text.
   * Note: This usually requires a token if calling the API directly with type=lrc.
   * However, the `MusicSong` object already contains an `lrc` URL which is pre-signed.
   * Use `fetchLrc` to get the content from that URL.
   * This method is for querying the API directly if you have the ID.
   */
  async getLrc(server: MusicServer, id: string | number): Promise<string> {
    // Note: The return type for lrc is plain text
    return this._request<string>(
      {
        server,
        type: 'lrc',
        id: id.toString(),
      },
      'text',
    )
  }

  /**
   * Helper to fetch lyrics content from a URL (e.g. the one returned in MusicSong).
   */
  async fetchLrc(url: string): Promise<string> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch LRC: ${response.statusText}`)
    }
    return response.text()
  }

  /**
   * Construct the URL for the API request.
   */
  private _buildUrl(params: Record<string, string>): string {
    const url = new URL(this.baseUrl)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
    return url.toString()
  }

  /**
   * Internal request method.
   */
  private async _request<T>(
    params: Record<string, string>,
    responseType: 'json' | 'text' = 'json',
  ): Promise<T> {
    const url = this._buildUrl(params)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Meting API Error: ${response.status} ${response.statusText}`)
    }

    if (responseType === 'text') {
      return (await response.text()) as unknown as T
    }

    return response.json()
  }
}
