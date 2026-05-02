from flask import Blueprint, request, jsonify
from .content_based_recommender.service import content_based_recommender
from .collaborative_recommender.service import collaborative_recommender

bp = Blueprint("routes", __name__)

@bp.route("/api/v1/recommend_content_based", methods=["POST"])
def recommend_content_based():
    data = request.get_json()

    ratings = data.get("ratings", [])
    k = data.get("k", 20)

    print(f"Received request for content: \n    k: {k}\n    ratings: {ratings}")

    try:
        result = content_based_recommender.recommend(ratings, k)
        print(f"Returning predicted: {result}")
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@bp.route("/api/v1/recommend_collaborative", methods=["POST"])
def recommend_collaborative():
    data = request.get_json()

    ratings = data.get("ratings", [])
    k = data.get("k", 20)

    print(f"Received request for collab: \n    k: {k}\n    ratings: {ratings}")

    try:
        result = collaborative_recommender.recommend(ratings, k)
        print(f"Returning predicted: {result}")
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@bp.route("/", methods=["GET"])
def health_check():
    return "ML-API běží 🚀", 200