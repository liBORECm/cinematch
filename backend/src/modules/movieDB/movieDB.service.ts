import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import type { Movie } from '../../models/movie'
import config from '../../config/config'

export interface Filters {
  title: string | undefined
}

class MovieDB {
  private movies: Movie[] = []

  constructor() {
    const fullPath = config.tmdbCSVPath;
    if (!fs.existsSync(fullPath)) {
      throw new Error(`CSV file not found at path: ${fullPath}`);
    }

    const csvContent = fs.readFileSync(fullPath, 'utf-8')
    this.movies = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    }).map((row: any) => ({
      id: Number(row.imdbId || row.id),
      title: row.title,
      overview: row.overview,
      genres: row.genres.split(", "),
      keywords: row.keywords.split(", "),
      release_date: new Date(row.release_date),
      runtime: Number(row.runtime),
      original_language: row.original_language,
      poster_path: row.poster_path,
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

  public get(
    id: number
  ): Movie | undefined {
    return this.movies.find((val) => val.id === id)
  }
}

export const movieDB = new MovieDB()