from flask import Flask, jsonify, request
import json
import math

app = Flask(__name__)

with open('data/drugs.json', 'r', encoding='utf-8') as f:
    DRUGS_DATA = json.load(f)

@app.route("/api/drugs", methods=["GET"])
def get_drugs():
    return jsonify(DRUGS_DATA)

@app.route("/api/drug_curve", methods=["GET"])
def get_drug_curve():
    # クエリパラメータ: name, duration_hoursなど
    name = request.args.get("name", None)
    duration = float(request.args.get("duration", 24))  # デフォルト24時間分など
    intervals = int(request.args.get("intervals", 100)) # 分解数
    
    drug = next((d for d in DRUGS_DATA if d["name"] == name), None)
    if not drug:
        return jsonify({"error": "Drug not found"}), 404

    tmax = drug["tmax_h"]
    half_life = drug["half_life_h"]
    cmax = drug["cmax_ng_ml"]
    
    times = [i * (duration / intervals) for i in range(intervals + 1)]
    concentrations = []
    for t in times:
        if t <= tmax:
            # シンプルにt/tmaxで線形上昇
            c = cmax * (t / tmax)
        else:
            # 半減期に沿った指数減衰
            c = cmax * (0.5 ** ((t - tmax) / half_life))
        concentrations.append(c)
    
    return jsonify({
        "times": times,
        "concentrations": concentrations
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
