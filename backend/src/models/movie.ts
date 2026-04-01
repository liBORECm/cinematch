//TODO enrich with some year, cast, ... or make MovieEnriched type
export class Movie {
  id: number
  title: string

  public constructor(id: number, title: string) {
    this.id = id
    this.title = title
  }

  public static GetMovie(obj: any) {
    if(obj.id && typeof(obj.id) === "number" && obj.title && typeof(obj.title) === "string") {
      return new Movie(obj.id, obj.title)
    }

    return null
  }
}