import config from '../../config/config'
import { Movie } from '../../models/movie'
import { UserProfile } from '../../models/userProfile'
import { movieDB } from '../movieDB/movieDB.service'

class CollaborativeRecommender {
  public async recommend(userProfile: UserProfile): Promise<Array<Movie>> {
    console.log("[collab.service] recommend() called")

    const payload = {
      ratings: userProfile.toDict(),
      k: 2,
    }

    console.log("[collab.service] payload:", payload)

    let result
    try {
      result = await fetch(
        `${config.mlApiIP}/api/v1/recommend_collaborative`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )
    } catch (err) {
      console.error("[collab.service] FETCH FAILED:", err)
      throw err
    }

    console.log("[collab.service] response status:", result.status)

    let data: any
    try {
      data = await result.json()
    } catch (err) {
      console.error("[collab.service] Failed to parse JSON:", err)
      throw err
    }

    console.log("[collab.service] response data:", data)

    if (!result.ok) {
      console.error("[collab.service] API ERROR:", data)
      return Promise.reject(data.error)
    }

    const movies = data
      .map((movieObj: any) => {
        const movie = movieDB.get(movieObj.id)
        if (!movie) {
          console.warn("[collab.service] movie not found in DB:", movieObj)
        }
        return movie
      })
      .filter((movie: Movie | null) => movie !== null)

    console.log("[collab.service] final movies count:", movies.length)

    return movies
  }
}

export const collaborativeRecommender = new CollaborativeRecommender()
