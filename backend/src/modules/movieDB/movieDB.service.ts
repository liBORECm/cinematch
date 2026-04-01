import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import type { Movie } from '../../models/movie'

export interface Filters {
  title: string | undefined
}

const IMDB_CSV_PATH = "src/datasets/TMDB_movie_dataset_v11.csv"

class MovieDB {
  private movies: Movie[] = []

  constructor() {
    const fullPath = path.resolve(IMDB_CSV_PATH)
    if (!fs.existsSync(fullPath)) {
      throw new Error(`CSV file not found at path: ${fullPath}`)
    }

    const csvContent = fs.readFileSync(fullPath, 'utf-8')
    this.movies = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    }).map((row: any) => ({
      id: Number(row.imdbId || row.id),
      title: row.title,
    }))
  }

  public getAll(
    limit: number | undefined = undefined,
    offset: number | undefined = undefined,
    filters: Filters | undefined = undefined,
  ): Movie[] {
    let result = this.movies

    if (filters) {
      const { title } = filters
      if (title) {
        const titleLower = title.toLowerCase()
        result = result.filter((m) => m.title.toLowerCase().includes(titleLower))
      }
    }

    offset = offset ?? 0
    limit = limit ?? 100

    return result.slice(offset, offset + limit)
  }
}

export const movieDB = new MovieDB()