import type { Movie } from "./movie"

export class Rating {
  movie: Movie
  rating: number

  public constructor(movie: Movie, rating: number) {
    this.movie = movie
    this.rating = rating
  }
}