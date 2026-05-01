import express from 'express'
import config from './config/config'
import cors from 'cors';
import { contentBasedRecommenderRoutes } from './modules/contentBasedRecommender/contenBasedRecommender.controller'
import { collaborativeRecommenderRoutes } from './modules/collaborativeRecommender/collaborativeRecommender.controller';
import { movieDBRoutes } from './modules/movieDB/movieDB.controller'

const app = express()

app.use(express.json())
app.use(cors());

app.get('/', (req, res) => {
  res.send('API běží 🚀')
})

app.use("/api/v1/content-based", contentBasedRecommenderRoutes)
app.use("/api/v1/collaborative", collaborativeRecommenderRoutes)
app.use("/api/v1/movie-db", movieDBRoutes)

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`)
})


/* contentBasedRecommender.recommend(new UserProfile([
    { imdbId: 569094, rating: 1 },
    { imdbId: 634649, rating: 0.5 },
    { imdbId: 324857, rating: 1.5 },
    { imdbId: 524434, rating: -2.5 },
    { imdbId: 18224, rating: -3 },
  ],
)).then((res) => console.log(res)) */