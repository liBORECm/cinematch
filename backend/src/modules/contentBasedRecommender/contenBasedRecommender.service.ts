import config from '../../config/config'
import { Movie } from '../../models/movie'
import { UserProfile } from '../../models/userProfile'
import { movieDB } from '../movieDB/movieDB.service'

class ContentBasedRecommender {
  public async recommend(
    userProfile: UserProfile,
  ): Promise<Array<Movie>> {
    const result = await fetch(
      `${config.mlApiIP}/api/v1/recommend_content_based`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          ratings: userProfile.toDict(),
          k: 2,
        }),
      },
    )

    const data: any = await result.json()
    if (!result.ok) return Promise.reject(data.error)

    const movies = data
      .map((movieObj: any) => movieDB.get(movieObj))
      .filter((movie: Movie | null) => movie !== null)

    return movies
  }
}

export const contentBasedRecommender = new ContentBasedRecommender()
