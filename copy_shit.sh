#!/bin/bash

ssh vpspojebane "mkdir -p /root/cinematch/sandbox/datasets/clean/tmdb-movies"
ssh vpspojebane "mkdir -p /root/cinematch/sandbox/datasets/clean/ml-32m"
ssh vpspojebane "mkdir -p /root/cinematch/ml-api/model/"
scp ./sandbox/datasets/clean/tmdb-movies/TMDB_movie_dataset_v11.csv vpspojebane:/root/cinematch/sandbox/datasets/clean/tmdb-movies/TMDB_movie_dataset_v11.csv
scp ./sandbox/datasets/clean/ml-32m/ratings.csv vpspojebane:/root/cinematch/sandbox/datasets/clean/ml-32m/ratings.csv
scp ./ml-api/model/U.pkl vpspojebane:/root/cinematch/ml-api/model/U.pkl
scp ./ml-api/model/V.pkl vpspojebane:/root/cinematch/ml-api/model/V.pkl
scp ./ml-api/model/tfidf.pkl vpspojebane:/root/cinematch/ml-api/model/tfidf.pkl
scp ./ml-api/model/tfidf_vectorizer.pkl vpspojebane:/root/cinematch/ml-api/model/tfidf_vectorizer.pkl
scp ./ml-api/model/user_map.pkl vpspojebane:/root/cinematch/ml-api/model/user_map.pkl
scp ./ml-api/model/movie_map.pkl vpspojebane:/root/cinematch/ml-api/model/movie_map.pkl
scp ./ml-api/model/movies_metadata.pkl vpspojebane:/root/cinematch/ml-api/model/movies_metadata.pkl