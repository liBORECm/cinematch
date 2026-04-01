import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  mlApiIP: string
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  mlApiIP: process.env.ML_API_IP || "http.//localhost:5000"
};

export default config;