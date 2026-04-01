import type { Movie } from './models/movie'
import type { UserProfile } from './models/userProfile'

export class DataManager {
  private static BACKEND_URL = 'http://localhost:7777'

  private static getVars(obj: Record<string, unknown>): string {
    if (Object.keys(obj).length === 0) {
      return ''
    }

    const queryParams = new URLSearchParams()

    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    }

    return `?${queryParams.toString()}`
  }

  public static async getMovies(
    limit: number | undefined = undefined,
    offset: number | undefined = undefined,
    title: string | undefined = undefined,
  ): Promise<Array<Movie>> {
    const vars = this.getVars({ limit, offset, title })
    console.log(DataManager.BACKEND_URL)
    const result = await fetch(
      `${DataManager.BACKEND_URL}/api/v1/movie-db${vars}`,
      {
        method: 'GET',
      },
    )

    const data = await result.json()
    if (!result.ok) return []

    return data
  }

  public static async recommendContentBased(
    userProfile: UserProfile,
  ): Promise<Array<Movie>> {
    const result = await fetch(
      `${DataManager.BACKEND_URL}/api/v1/content-based/recommend`,
      {
        method: 'POST',
        body: JSON.stringify({
          ratings: userProfile.movieRatings,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const data = await result.json()
    if (!result.ok) return []

    return data
  }
}
