#!/bin/bash

ssh vpspojebane2 "mkdir -p /root/cinematch/sandbox/datasets/clean/tmdb-movies"
ssh vpspojebane2 "mkdir -p /root/cinematch/sandbox/datasets/clean/ml-32m"
ssh vpspojebane2 "mkdir -p /root/cinematch/ml-api/model/"
scp ./sandbox/datasets/clean/tmdb-movies/TMDB_movie_dataset_v11.csv vpspojebane2:/root/cinematch/sandbox/datasets/clean/tmdb-movies/TMDB_movie_dataset_v11.csv
scp ./sandbox/datasets/clean/ml-32m/ratings.csv vpspojebane2:/root/cinematch/sandbox/datasets/clean/ml-32m/ratings.csv
scp ./ml-api/model/U.pkl vpspojebane2:/root/cinematch/ml-api/model/U.pkl
scp ./ml-api/model/V.pkl vpspojebane2:/root/cinematch/ml-api/model/V.pkl
scp ./ml-api/model/tfidf.pkl vpspojebane2:/root/cinematch/ml-api/model/tfidf.pkl
scp ./ml-api/model/tfidf_vectorizer.pkl vpspojebane2:/root/cinematch/ml-api/model/tfidf_vectorizer.pkl
scp ./ml-api/model/user_map.pkl vpspojebane2:/root/cinematch/ml-api/model/user_map.pkl
scp ./ml-api/model/movie_map.pkl vpspojebane2:/root/cinematch/ml-api/model/movie_map.pkl
scp ./ml-api/model/movies_metadata.pkl vpspojebane2:/root/cinematch/ml-api/model/movies_metadata.pkl