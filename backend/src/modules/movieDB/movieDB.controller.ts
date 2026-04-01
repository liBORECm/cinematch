import { Router } from 'express'
import { movieDB } from './movieDB.service'

const router = Router()

router.get('/', (req, res) => {
  const { limit, offset, title } = req.query

  const movies = movieDB.getAll(
    limit ? Number(limit) : undefined,
    offset ? Number(offset) : undefined,
    {
      title: title as string | undefined,
    },
  )

  res.status(200).json(movies)
})

export const movieDBRoutes = router