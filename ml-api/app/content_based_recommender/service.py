import joblib
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
TF_IDF_MATRIX_PATH = BASE_DIR / "../../model/tfidf.pkl"
TMDB_CSV_PATH = Path(os.getenv("TMDB_CSV_PATH"))

class ContenBasedRecommender:
    def __init__(self):
        self.tfidf_matrix = joblib.load(TF_IDF_MATRIX_PATH)
        self.tmdb = pd.read_csv(TMDB_CSV_PATH)
        self.tmdb_id_to_index = pd.Series(self.tmdb.index, index=self.tmdb["id"]).to_dict()

    def build_user_profile(self, ratings_dict):
        vectors = []
        weights = []

        for tmdb_id, rating in ratings_dict.items():
            tmdb_id = int(tmdb_id)
            if tmdb_id in self.tmdb_id_to_index:
                idx = self.tmdb_id_to_index[tmdb_id]
                vectors.append(self.tfidf_matrix[idx].toarray()[0])
                weights.append(rating - 2.5)

        vectors = np.array(vectors)
        weights = np.array(weights)

        user_profile = np.sum(vectors * weights[:, np.newaxis], axis=0)
        user_profile = user_profile.reshape(1, -1)

        return {
            "vector": user_profile,
            "method": "content"
        }

    def recommend(self, ratings, k):
        ##Rating are expected to be from 0 to 5
        ##TODO do a check
        user_vector = self.build_user_profile(ratings)["vector"]
        sims = cosine_similarity(user_vector, self.tfidf_matrix).flatten()
        weighted_sims = sims * self.tmdb["popularity_log"].values
        results = self.tmdb[["id", "title", "vote_average", "popularity"]].copy()
        results["match_score"] = weighted_sims
        
        rated_movie_ids = set(ratings.keys())
        results = results[~results["id"].isin(rated_movie_ids)]

        results["rank"] = results["match_score"].rank(ascending=False).astype(int)
        results["percentile"] = results["match_score"].rank(pct=True) * 100

        top_results = results.sort_values(by="match_score", ascending=False).head(k)

        return top_results.to_dict(orient="records")


content_based_recommender = ContenBasedRecommender()