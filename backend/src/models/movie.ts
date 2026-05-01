export class Movie {
  id: number
  title: string
  overview: string
  genres: Array<string>
  keywords: Array<string>
  release_date: Date
  runtime: number
  original_language: string
  poster_path: string

  public constructor(
    id: number,
    title: string,
    overview: string,
    genres: Array<string>,
    keywords: Array<string>,
    release_date: Date,
    runtime: number,
    original_language: string,
    poster_path: string,
  ) {
    this.id = id
    this.title = title
    this.overview = overview
    this.genres = genres
    this.keywords = keywords
    this.release_date = release_date
    this.runtime = runtime
    this.original_language = original_language
    this.poster_path = poster_path
  }
}