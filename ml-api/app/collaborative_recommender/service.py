import joblib
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
MOVIE_MAP_PATH = BASE_DIR / "../../model/movie_map.pkl"
V_PATH = BASE_DIR / "../../model/V.pkl"
U_PATH = BASE_DIR / "../../model/U.pkl"
RATINGS_CSV_PATH = Path(os.getenv("RATINGS_CSV_PATH"))
TMDB_CSV_PATH = Path(os.getenv("TMDB_CSV_PATH"))

class CollaborativeRecommender:
    def __init__(self):
        self.movie_map = joblib.load(MOVIE_MAP_PATH)
        self.V = joblib.load(V_PATH)
        self.U = joblib.load(U_PATH)
        self.ratings = pd.read_csv(RATINGS_CSV_PATH)
        self.user_ids = np.sort(self.ratings["userId"].unique())
        self.movie_ids = np.sort(self.ratings["tmdbId"].unique())
        self.tmdb = pd.read_csv(TMDB_CSV_PATH)


    def build_user_profile_collab(self, ratings_dict):
        _indices = []
        _ratings = []

        for tmdb_id, rating in ratings_dict.items():
            if tmdb_id in self.movie_map:
                _indices.append(self.movie_map[tmdb_id])
                _ratings.append(rating - self.ratings_glob_mean)
            
        V_sub = self.V[:, _indices]
        r = np.array(_ratings)
        user_vector = r @ V_sub.T
        return {
            "vector": user_vector,
            "method": "collab"
        }


    def recommend(self, ratings, k):
        user_vector = self.build_user_profile(ratings)["vector"]
        user_vector = user_vector["vector"]
        scores = user_vector @ self.V

        score_df = pd.DataFrame({
            "id": self.movie_ids,
            "predicted_rating": scores
        })

        results = self.tmdb[["id", "title", "vote_average", "popularity"]].merge(score_df, on="id")
        rated_movie_ids = set(ratings.keys())
        results = results[~results["id"].isin(rated_movie_ids)]

        results["rank"] = results["predicted_rating"].rank(ascending=False).astype(int)
        results["percentile"] = results["predicted_rating"].rank(pct=True) * 100

        top_results = results.sort_values(by="predicted_rating", ascending=False).head(k)

        return top_results.to_dict(orient="records")


collaborative_recommender = CollaborativeRecommender()