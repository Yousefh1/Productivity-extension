# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

user_data = {
    "userId": "",
    "activities": [],
    "goals": {},
}

@app.route("/api/user-data", methods=["POST"])
def receive_user_data():
    try:
        data = request.get_json()
        global user_data
        user_data = {
            "userId": data.get("userId", ""),
            "activities": data.get("activities", []),
            "goals": data.get("goals", {}),
        }

        # Process the user data as needed

        return jsonify({"message": "User data received successfully!"})
    except Exception as e:
        print(f"Error receiving user data: {e}")
        return jsonify({"error": "An error occurred while processing the data."}), 500

if __name__ == "__main__":
    app.run(debug=True)
