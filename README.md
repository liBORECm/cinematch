# CineMatch — Movie Recommendation System

A full-stack movie recommendation system built for PA026. Given a user's rated movies, it returns a personalised ranked list of unseen films.

## Architecture

| Service | Stack | Port |
|---------|-------|------|
| Frontend | React + TypeScript (Vite) | 5173 |
| Backend | Node.js + TypeScript | 7777 |
| ML API | Python + Flask | 5000 |

All services are containerised and orchestrated with Docker Compose.

## Quick Start

> **Prerequisite:** model artefacts must be present in `ml-api/model/` before starting (see [Training](#training-pipeline)).

```bash
docker-compose up --build
```

## Training Pipeline

```bash
cd develop/scripts
pip install -r requirements.txt
python pipeline.py   # download → clean → train
```

The pipeline runs three steps:

1. **`download_data.py`** — fetches MovieLens 32M and TMDB via the Kaggle API (`~/.kaggle/kaggle.json` required).
2. **`clean_data.py`** — filters, merges datasets, and mean-centres ratings ($r' = r - 2.5$).
3. **`train_models.py`** — fits TF-IDF and SVD models; saves artefacts to `ml-api/model/`.

## ML API Endpoints

```
POST /api/v1/recommend_content_based
POST /api/v1/recommend_collaborative
```

Request body:
```json
{ "ratings": { "<tmdbId>": 4.5, "<tmdbId>": 2.0 }, "k": 20 }
```

## Recommendation Approaches

| Method | How it works |
|--------|-------------|
| **Content-based** | TF-IDF on movie metadata; profile = rating-weighted vector sum |
| **Collaborative (SVD)** | Truncated SVD ($k=35$) on the rating matrix; dot-product scoring |
| **Collab Sim** | Same as SVD but cosine-similarity scoring in latent space |
| **Hybrid** | Routes to content-based if median `vote_count` < 1000, else SVD |

Only content-based and collaborative endpoints are deployed; hybrid and collab-sim are evaluated in the notebook.

## Evaluation

**Offline** (14 033 test users, Hit Rate / Precision / Recall @ 20):

| Method | HR@20 | P@20 | R@20 | Sem. TF-IDF | Sem. SVD |
|--------|------:|-----:|-----:|------------:|---------:|
| Content-based | 0.0011 | 0.0001 | 0.0003 | 0.044 | 0.299 |
| **Collaborative (SVD)** | **0.149** | **0.010** | **0.015** | **0.108** | 0.245 |
| Collab Sim | 0.0011 | 0.0001 | 0.0003 | 0.077 | 0.185 |
| Hybrid | 0.143 | 0.009 | 0.014 | 0.105 | **0.250** |

**Online** (74 real user sessions):

| Method | Median rating | Success@4 |
|--------|:------------:|:---------:|
| Collaborative | **4.20** | **71%** |
| Content-based | 3.93 | 48% |

## Notebooks

```bash
cd develop
jupyter lab
```

- `notebooks/model_training.ipynb` — trains and evaluates all four approaches
- `notebooks/evaluations.ipynb` — reproduces the user-study analysis
