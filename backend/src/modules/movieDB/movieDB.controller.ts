import { Router } from 'express'
import { movieDB } from './movieDB.service'

const router = Router()

router.get('/', (req, res) => {
  const start = Date.now()

  const { limit, offset, title } = req.query

  console.log(`[MovieDB API] GET /movies`)
  console.log(`[MovieDB API] query:`, { limit, offset, title })

  const movies = movieDB.getAll(
    limit ? Number(limit) : undefined,
    offset ? Number(offset) : undefined,
    {
      title: title as string | undefined,
    },
  )

  console.log(`[MovieDB API] returned: ${movies.length} movies in ${Date.now() - start}ms`)

  res.status(200).json(movies)
})

export const movieDBRoutes = router