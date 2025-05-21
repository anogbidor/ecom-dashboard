from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import timedelta, datetime
from sklearn.linear_model import LinearRegression
import mysql.connector
from dotenv import load_dotenv
import os

# ✅ Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS

# ✅ Simple in-memory cache
forecast_cache = {
    "data": None,
    "timestamp": None
}
CACHE_DURATION_SECONDS = 60 * 5  # 5 minutes

# ✅ Connect to MySQL and retrieve sales data
def get_sales_data():
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

    query = "SELECT sale_date AS date, total_price AS total FROM sales ORDER BY sale_date ASC"
    df = pd.read_sql(query, conn)
    conn.close()
    return df

@app.route('/api/forecast')
def forecast_sales():
    now = datetime.now()

    # ✅ Return cached result if still valid
    if (
        forecast_cache["data"] is not None and
        forecast_cache["timestamp"] is not None and
        (now - forecast_cache["timestamp"]).total_seconds() < CACHE_DURATION_SECONDS
    ):
        return jsonify(forecast_cache["data"])

    # 🧠 Otherwise re-calculate forecast
    data = get_sales_data()
    data['date'] = pd.to_datetime(data['date'])
    data['day'] = (data['date'] - data['date'].min()).dt.days

    model = LinearRegression()
    model.fit(data[['day']], data['total'])

    future_days = [data['day'].max() + i for i in range(1, 8)]
    future_dates = [data['date'].max() + timedelta(days=i) for i in range(1, 8)]
    predictions = model.predict([[d] for d in future_days])

    forecast = [
        {'date': d.strftime('%Y-%m-%d'), 'forecast': round(p, 2)}
        for d, p in zip(future_dates, predictions)
    ]

    # ✅ Store in cache
    forecast_cache["data"] = forecast
    forecast_cache["timestamp"] = now

    return jsonify(forecast)

if __name__ == '__main__':
    app.run(port=5001, debug=True)
