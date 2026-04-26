import joblib
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
TF_IDF_MATRIX_PATH = BASE_DIR / "../../model/tf_idf_matrix.pkl"
TMDB_CSV_PATH = BASE_DIR / "../../datasets/TMDB_movie_dataset_v11.csv"

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

        return user_profile

    def recommend(self, ratings, k):
        ##Rating are expected to be from 0 to 5
        ##TODO do a check
        k_temp = k + len(ratings.items())
        user_vector = self.build_user_profile(ratings)
        sims = cosine_similarity(user_vector, self.tfidf_matrix).flatten()
        top_idx = sims.argsort()[-k_temp:][::-1]

        rated_ids = set(int(tmdb_id) for tmdb_id in ratings.keys())
        filtered_idx = []
        for idx in top_idx:
            movie_id = self.tmdb.iloc[idx]["id"]

            if movie_id not in rated_ids:
                filtered_idx.append(idx)

        results = self.tmdb.iloc[filtered_idx][["title", "vote_average", "id"]]

        return results.to_dict(orient="records")
    
    def check_recommended(self, ratings, movie_id):
        user_vector = self.build_user_profile(ratings)
        sims = cosine_similarity(user_vector, self.tfidf_matrix).flatten()
        
        weighted_sims = sims * self.tmdb["popularity_log"].values
        results = self.tmdb[["id", "title", "vote_average", "popularity"]].copy()
        results["match_score"] = weighted_sims

        results["rank"] = results["match_score"].rank(ascending=False).astype(int)
        results["percentile"] = results["match_score"].rank(pct=True) * 100

        return results[results["id"] == movie_id][0]


content_based_recommender = ContenBasedRecommender()