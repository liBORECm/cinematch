import os
import zipfile
import requests
from kaggle.api.kaggle_api_extended import KaggleApi
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

def download_data():
    # ========== CONFIG ==========
    
    movielens_url = "https://files.grouplens.org/datasets/movielens/ml-32m.zip"
    movielens_zip = BASE_DIR / "/datasets/raw/ml-32m.zip"
    movielens_dir = BASE_DIR / "/datasets/raw"
    movielens_to_remove = ["tags.csv", "README.txt", "movies.csv", "checksums.txt"]

    kaggle_dataset = "asaniczka/tmdb-movies-dataset-2023-930k-movies"
    kaggle_dir = BASE_DIR / "/datasets/raw/tmdb-movies"

    # ============================


    # ==========================
    # Downloading Movielens dataset
    # ==========================
    def download_file(url, output_path):
        print(f"Downloading {url} ...")
        r = requests.get(url, stream=True)
        r.raise_for_status()
        with open(output_path, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Saved to {output_path}")

    def unzip_file(zip_path, extract_to):
        print(f"Unzipping {zip_path} ...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        print(f"Extracted to {extract_to}")

    os.makedirs(os.path.dirname(movielens_zip), exist_ok=True)
    download_file(movielens_url, movielens_zip)
    unzip_file(movielens_zip, movielens_dir)
    os.remove(movielens_zip)  # smazat ZIP

    for file in movielens_to_remove:
        path = os.path.join(movielens_dir, "ml-32m", file)
        if os.path.exists(path):
            os.remove(path)
            print(f"Removed {path}")

    # ==========================
    # Downloading Kaggle dataset
    # ==========================
    api = KaggleApi()
    api.authenticate()

    if not os.path.exists(kaggle_dir):
        os.makedirs(kaggle_dir)

    print("Downloading Kaggle dataset...")
    api.dataset_download_files(kaggle_dataset, path=kaggle_dir, unzip=True)
    print("Kaggle dataset downloaded and unzipped.")