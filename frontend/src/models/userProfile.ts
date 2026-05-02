import type { Rating } from "./rating"

export class UserProfile {
  movieRatings: Array<Rating>

  public constructor(movieRatings: Array<Rating>) {
    this.movieRatings = movieRatings
  }

  public toDict() {
    return Object.fromEntries(
      this.movieRatings.map(r => [r.movie.id, r.rating])
    )
  }
}