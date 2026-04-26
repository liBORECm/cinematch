from flask import Blueprint, request, jsonify
from .content_based_recommender.service import content_based_recommender

bp = Blueprint("routes", __name__)

@bp.route("/api/v1/recommend_content_based", methods=["POST"])
def recommend_content_based():
    data = request.get_json()

    ratings = data.get("ratings", [])
    k = data.get("k", 20)

    print(f"Received request: \n    k: {k}\n    ratings: {ratings}")

    try:
        result = content_based_recommender.recommend(ratings, k)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@bp.route("/api/v1/check_recommended_content_based", methods=["POST"])
def check_recommended_content_based():
    data = request.get_json()

    ratings = data.get("ratings", [])
    movie_id = data.get("movie_id", 1)

    print(f"Received request: \n    movie_id: {movie_id}\n    ratings: {ratings}")

    try:
        result = content_based_recommender.check_recommended(ratings, movie_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400