import config from '../../config/config'
import { Movie } from '../../models/movie'
import { UserProfile } from '../../models/userProfile'
import { movieDB } from '../movieDB/movieDB.service'

class ContentBasedRecommender {
  public async recommend(userProfile: UserProfile): Promise<Array<Movie>> {
    console.log("[content.service] recommend() called")

    const payload = {
      ratings: userProfile.toDict(),
      k: 30,
    }

    console.log("[content.service] payload:", payload)

    let result
    try {
      result = await fetch(
        `${config.mlApiIP}/api/v1/recommend_content_based`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )
    } catch (err) {
      console.error("[content.service] FETCH FAILED:", err)
      throw err
    }

    console.log("[content.service] response status:", result.status)

    let data: any
    try {
      data = await result.json()
    } catch (err) {
      console.error("[content.service] Failed to parse JSON:", err)
      throw err
    }

    console.log("[content.service] response data:", data)

    if (!result.ok) {
      console.error("[content.service] API ERROR:", data)
      return Promise.reject(data.error)
    }

    const movies = data
      .map((movieObj: any) => {
        const movie = movieDB.get(movieObj.id)
        if (!movie) {
          console.warn("[content.service] movie not found in DB:", movieObj)
        }
        return movie
      })
      .filter((movie: Movie | null) => movie !== null)

    console.log("[content.service] final movies count:", movies.length)

    return movies
  }
}

export const contentBasedRecommender = new ContentBasedRecommender()
