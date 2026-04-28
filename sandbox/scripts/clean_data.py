import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os

# =========================
# CONFIG
# =========================

RAW_TMDB_FILE_PATH = "../datasets/raw/tmdb-movies/TMDB_movie_dataset_v11.csv"
RAW_MOVIELENS_LINKS_PATH = "../datasets/raw/ml-32m/links.csv"
RAW_MOVIELENS_RATINGS_PATH = "../datasets/raw/ml-32m/ratings.csv"

CLEAN_TMDB_FILE_PATH = "../datasets/clean/tmdb-movies/TMDB_movie_dataset_v11.csv"
CLEAN_MOVIELENS_RATINGS_PATH = "../datasets/clean/ml-32m/ratings.csv"

debug=True
API_TMDB_FILE_PATH = "../../ml-api/datasets/TMDB_movie_dataset_v11.csv"
API_MOVIELENS_RATINGS_PATH = "../../ml-api/datasets/ratings.csv"

# =========================
# LOAD TMDB DATA
# =========================
# Keep only relevant columns, drop unknow movies
# fill NaNs and make one mage column for tf-idf transform

tmdb = pd.read_csv(RAW_TMDB_FILE_PATH)
KEEP = [
    "id",
    "title",
    "overview",
    "genres",
    "keywords",
    "vote_average",
    "vote_count",
    "popularity",
    "release_date"
]
tmdb = tmdb[KEEP]
tmdb = tmdb[tmdb["vote_count"] > 30]
tmdb["overview"] = tmdb["overview"].fillna("")
tmdb["genres"] = tmdb["genres"].fillna("")
tmdb["keywords"] = tmdb["keywords"].fillna("")


tmdb["popularity_log"] = np.log1p(tmdb["popularity"])
tmdb["content"] = tmdb["overview"] + " " + tmdb["genres"] + " " + tmdb["keywords"]

# =========================
# LOAD MOVIELENS LINKS
# =========================

movie_lens_links = pd.read_csv(RAW_MOVIELENS_LINKS_PATH)

movie_lens_links = movie_lens_links[movie_lens_links["tmdbId"].notna()]
movie_lens_links["tmdbId"] = movie_lens_links["tmdbId"].astype("int64")

# =========================
# LOAD MOVIELENS RATINGS
# =========================
# Merge ratings with ids from tmdb
# and drop those movies which have less than 5 rating

movie_lens_ratings = pd.read_csv(RAW_MOVIELENS_RATINGS_PATH)
ratings = pd.merge(
    movie_lens_ratings[['userId', 'rating', 'movieId']],
    movie_lens_links[['movieId', 'tmdbId']],
    on='movieId',
    how='left'
)

ratings = ratings[ratings["tmdbId"].notna()]
ratings["tmdbId"] = ratings["tmdbId"].astype("int64")

min_user_ratings = 5
min_movie_ratings = 5

user_counts = ratings.groupby('userId').size()
movie_counts = ratings.groupby('tmdbId').size()

rating = ratings[
    ratings['userId'].isin(user_counts[user_counts >= min_user_ratings].index) &
    ratings['tmdbId'].isin(movie_counts[movie_counts >= min_movie_ratings].index)
]

# =========================
# SAVE CLEANED CSV FILES
# =========================
def ensure_dir(file_path):
    """Create directory if it doesn't exist"""
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

ensure_dir(CLEAN_TMDB_FILE_PATH)
tmdb.to_csv(CLEAN_TMDB_FILE_PATH, index=False)
print(f"✅ TMDB cleaned CSV saved: {CLEAN_TMDB_FILE_PATH}")
if(not debug):
    ensure_dir(API_TMDB_FILE_PATH)
    tmdb.to_csv(API_TMDB_FILE_PATH, index=False)
    print(f"✅ TMDB cleaned CSV saved: {API_TMDB_FILE_PATH}")

ensure_dir(CLEAN_MOVIELENS_RATINGS_PATH)
rating.to_csv(CLEAN_MOVIELENS_RATINGS_PATH, index=False)
print(f"✅ MovieLens ratings CSV saved: {CLEAN_MOVIELENS_RATINGS_PATH}")
if(not debug):
    ensure_dir(API_MOVIELENS_RATINGS_PATH)
    rating.to_csv(API_MOVIELENS_RATINGS_PATH, index=False)
    print(f"✅ MovieLens ratings CSV saved: {API_MOVIELENS_RATINGS_PATH}")