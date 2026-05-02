import type { Movie } from './models/movie'
import type { UserProfile } from './models/userProfile'
import { LogAgent } from './LogService'

export class Service {
  private static BACKEND_URL = import.meta.env.VITE_BE_URL

  public static LogAgentRecommenderCollab = new LogAgent(
    '[Recommender Collab]',
  )
  public static LogAgentRecommenderContent = new LogAgent(
    '[Recommender Content]',
  )

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
    console.log(Service.BACKEND_URL)
    const result = await fetch(
      `${Service.BACKEND_URL}/api/v1/movie-db${vars}`,
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
      `${Service.BACKEND_URL}/api/v1/content-based/recommend`,
      {
        method: 'POST',
        body: JSON.stringify({
          ratings: userProfile.movieRatings.map(
            ({ movie, rating }) => ({ imdbId: movie.id, rating }),
          ),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const data = await result.json()
    Service.LogAgentRecommenderContent.write(
      `User requested movies. Profile: ${JSON.stringify(userProfile)}`,
      JSON.stringify(data),
    )

    if (!result.ok) return []

    return data
  }

  public static async recommendCollab(
    userProfile: UserProfile,
  ): Promise<Array<Movie>> {
    const result = await fetch(
      `${Service.BACKEND_URL}/api/v1/collab/recommend`,
      {
        method: 'POST',
        body: JSON.stringify({
          ratings: userProfile.movieRatings.map(
            ({ movie, rating }) => ({ imdbId: movie.id, rating }),
          ),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const data = await result.json()
    Service.LogAgentRecommenderCollab.write(
      `User requested movies. Profile: ${JSON.stringify(userProfile)}`,
      JSON.stringify(data),
    )

    if (!result.ok) return []

    return data
  }
}
