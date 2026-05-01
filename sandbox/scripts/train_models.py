import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import csr_matrix
from sklearn.decomposition import TruncatedSVD
import joblib
import os
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent



def train_models():
  CLEAN_TMDB_FILE_PATH = BASE_DIR / "datasets/clean/tmdb-movies/TMDB_movie_dataset_v11.csv"
  CLEAN_MOVIELENS_RATINGS_PATH = BASE_DIR / "datasets/clean/ml-32m/ratings.csv"
  MODEL_DIR = "../../ml-api/model/"


  tmdb_og = pd.read_csv(CLEAN_TMDB_FILE_PATH)
  ratings_og = pd.read_csv(CLEAN_MOVIELENS_RATINGS_PATH)



  tmdb = tmdb_og
  ratings = ratings_og

  ratings_glob_mean = 2.5


  # CONTENT BASED

  tfidf = TfidfVectorizer(
      max_features=5000,
      min_df=5,
      max_df=0.7,
      stop_words="english"
  )

  tfidf_matrix = tfidf.fit_transform(tmdb["content"])



  # COLLABORATIVE

  ratings_current = ratings.copy()


  user_ids = np.sort(ratings_current["userId"].unique())
  movie_ids = np.sort(ratings_current["tmdbId"].unique())

  user_map = {u: i for i, u in enumerate(user_ids)}
  movie_map = {m: i for i, m in enumerate(movie_ids)}

  n_users = len(user_ids)
  n_items = len(movie_ids)

  rows = ratings_current["userId"].map(user_map)
  cols = ratings_current["tmdbId"].map(movie_map)
  data = ratings_current["rating"]

  R = csr_matrix((data, (rows, cols)), shape=(n_users, n_items))

  svd = TruncatedSVD(n_components=35)
  U = svd.fit_transform(R)
  V = svd.components_


  os.makedirs(MODEL_DIR, exist_ok=True)

  joblib.dump(U, MODEL_DIR + "U.pkl")
  joblib.dump(V, MODEL_DIR + "V.pkl")
  joblib.dump(tfidf_matrix, MODEL_DIR + "tfidf.pkl")
  joblib.dump(tfidf, MODEL_DIR + "tfidf_vectorizer.pkl")
  joblib.dump(user_map, MODEL_DIR + "user_map.pkl")
  joblib.dump(movie_map, MODEL_DIR + "movie_map.pkl")
  joblib.dump(tmdb, MODEL_DIR + "movies_metadata.pkl")


  print("DONT FORGET TO COPY:")
  print(MODEL_DIR + "U.pkl")
  print(MODEL_DIR + "V.pkl")
  print(MODEL_DIR + "tfidf.pkl")
  print(MODEL_DIR + "tfidf_vectorizer.pkl")
  print(MODEL_DIR + "user_map.pkl")
  print(MODEL_DIR + "movie_map.pkl")
  print(MODEL_DIR + "movies_metadata.pkl")