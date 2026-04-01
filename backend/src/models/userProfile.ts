export class UserProfile {
  movieRatings: Array<{imdbId: number, rating: number}>

  public constructor(movieRatings: Array<{imdbId: number, rating: number}>) {
    this.movieRatings = movieRatings
  }

  public toDict() {
    return Object.fromEntries(
      this.movieRatings.map(r => [r.imdbId, r.rating])
    )
  }
}