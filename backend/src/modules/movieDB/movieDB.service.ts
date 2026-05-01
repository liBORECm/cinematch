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
    console.log('[MovieDB] Initializing...')

    const fullPath = config.tmdbCSVPath
    console.log('[MovieDB] CSV path:', fullPath)

    if (!fs.existsSync(fullPath)) {
      console.error('[MovieDB] ❌ CSV file not found!')
      throw new Error(`CSV file not found at path: ${fullPath}`)
    }

    const csvContent = fs.readFileSync(fullPath, 'utf-8')
    console.log('[MovieDB] CSV loaded, parsing...')

    this.movies = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    }).map((row: any) => ({
      id: Number(row.imdbId || row.id),
      title: row.title,
      overview: row.overview,
      genres: row.genres.split(', '),
      keywords: row.keywords.split(', '),
      release_date: new Date(row.release_date),
      runtime: Number(row.runtime),
      original_language: row.original_language,
      poster_path: row.poster_path,
    }))

    console.log(`[MovieDB] ✅ Loaded ${this.movies.length} movies`)
  }

  public getAll(
    limit: number | undefined = undefined,
    offset: number | undefined = undefined,
    filters: Filters | undefined = undefined,
  ): Movie[] {
    console.log('[MovieDB] getAll called', { limit, offset, filters })

    let result = this.movies

    if (filters?.title) {
      const titleLower = filters.title.toLowerCase()
      const before = result.length

      result = result.filter((m) =>
        m.title.toLowerCase().includes(titleLower),
      )

      console.log(`[MovieDB] title filter "${filters.title}": ${before} → ${result.length}`)
    }

    offset = offset ?? 0
    limit = limit ?? 100

    const sliced = result.slice(offset, offset + limit)

    console.log(`[MovieDB] pagination offset=${offset}, limit=${limit}, returned=${sliced.length}`)

    return sliced
  }

  public get(id: number): Movie | undefined {
    console.log(`[MovieDB] get movie id=${id}`)

    const movie = this.movies.find((val) => val.id === id)

    if (!movie) {
      console.log(`[MovieDB] ❌ movie id=${id} not found`)
    }

    return movie
  }
}

export const movieDB = new MovieDB()