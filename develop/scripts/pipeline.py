from download_data import download_data
from train_models import train_models
from clean_data import clean_data

if __name__ == "__main__":
  download_data()
  clean_data()
  train_models()