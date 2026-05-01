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