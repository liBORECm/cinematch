import dotenv from 'dotenv'

dotenv.config()

interface Config {
  port: number
  mlApiIP: string
  tmdbCSVPath: string
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  mlApiIP: process.env.ML_API_IP || 'http.//localhost:5000',
  tmdbCSVPath: process.env.TMDB_CSV_PATH || "src/datasets/TMDB_movie_dataset_v11.csv",
}

export default config
