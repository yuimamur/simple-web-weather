import os
from flask import Flask, request, jsonify, send_from_directory
import requests

# Simple backend proxy to keep API key on the server
# Usage:
#   export OPENWEATHER_API_KEY="your_api_key"
#   python server.py
#
# Then open http://localhost:5000/

app = Flask(__name__, static_folder='.', static_url_path='')

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")


@app.route('/')
def root():
    # Serve the frontend
    return send_from_directory('.', 'index.html')


@app.route('/api/weather')
def api_weather():
    if not OPENWEATHER_API_KEY:
        return jsonify({"message": "Server misconfiguration: API key is not set", "cod": 500}), 500

    lat = request.args.get('lat')
    lon = request.args.get('lon')

    try:
        lat_f = float(lat) if lat is not None else None
        lon_f = float(lon) if lon is not None else None
    except ValueError:
        return jsonify({"message": "Invalid coordinates", "cod": 400}), 400

    if lat_f is None or lon_f is None:
        return jsonify({"message": "Missing coordinates", "cod": 400}), 400

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "lat": lat_f,
        "lon": lon_f,
        "appid": OPENWEATHER_API_KEY,
    }

    try:
        resp = requests.get(url, params=params, timeout=10)
    except requests.RequestException as e:
        return jsonify({"message": f"Upstream request failed: {e}", "cod": 502}), 502

    # Forward JSON payload and use upstream status where applicable
    try:
        data = resp.json()
    except ValueError:
        return jsonify({"message": "Invalid response from upstream", "cod": 502}), 502

    status = resp.status_code
    # Normalize: OpenWeather sometimes returns 200 with error codes in body; keep body but map HTTP code when possible
    if "cod" in data:
        try:
            status = int(data["cod"])
        except Exception:
            pass

    return jsonify(data), status


# Serve static assets (css/js/images) via Flask's static handling
@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('.', path)


if __name__ == '__main__':
    port = int(os.getenv("PORT", "5000"))
    # Do not enable debug by default; safe default
    app.run(host='0.0.0.0', port=port)