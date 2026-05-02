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
        self.ratings_glob_mean = 2.5
        print("CollaborativeRecommender initialized.")

    def build_user_profile(self, ratings_dict):
        print("Building user profile...")

        _indices = []
        _ratings = []

        for tmdb_id, rating in ratings_dict.items():
            tmdb_id = int(tmdb_id)
            print(f"Processing movie with tmdb_id: {tmdb_id}, rating: {rating}")
            if tmdb_id in self.movie_map:
                _indices.append(self.movie_map[tmdb_id])
                _ratings.append(rating - self.ratings_glob_mean)

        print(f"Total movies processed: {len(_indices)}")
        V_sub = self.V[:, _indices]
        r = np.array(_ratings)
        user_vector = r @ V_sub.T

        print("User profile created successfully.")
        return {
            "vector": user_vector,
            "method": "collab"
        }


    def recommend(self, ratings, k):
        print("Starting recommendation process...")

        user_vector = self.build_user_profile(ratings)["vector"]
        print("User vector calculated.")

        scores = user_vector @ self.V
        print(f"Scores calculated for all movies: {scores[:10]}...")  # First 10 scores for a quick preview

        score_df = pd.DataFrame({
            "id": self.movie_ids,
            "predicted_rating": scores
        })

        results = self.tmdb[["id", "title", "vote_average", "popularity"]].merge(score_df, on="id")
        print(f"Movies after merging: {results.shape[0]}")

        rated_movie_ids = set(int(id) for id in ratings.keys())
        results = results[~results["id"].isin(rated_movie_ids)]
        print(f"Movies not yet rated: {results.shape[0]}")

        results["rank"] = results["predicted_rating"].rank(ascending=False).astype(int)
        results["percentile"] = results["predicted_rating"].rank(pct=True) * 100

        top_results = results.sort_values(by="predicted_rating", ascending=False).head(k)

        print(f"Top {k} recommended movies:")
        print(top_results[["title", "predicted_rating", "rank"]])

        return top_results.to_dict(orient="records")


collaborative_recommender = CollaborativeRecommender()