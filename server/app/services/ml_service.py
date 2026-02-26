
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score


DEFAULT_CLUSTER_COUNT_MAX = 8
PREFERRED_NUMERIC_COLUMNS = ['Revenue', 'Transactions', 'AvgTransactionValue', 'Recency']

def find_best_k(X):
    best_k = 3
    best_score = -1

    for k in range(2, DEFAULT_CLUSTER_COUNT_MAX):
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = km.fit_predict(X)
        score = silhouette_score(X, labels)

        if score > best_score:
            best_score = score
            best_k = k
    return best_k


def build_model(X: pd.DataFrame, df: pd.DataFrame) -> dict:

    df = df.replace([np.nan, np.inf, -np.inf], 0)

    n_samples = len(df)
    if n_samples == 0:
        raise ValueError("No data available for clustering.")

    n_clusters = find_best_k(X)

    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    df['Cluster'] = kmeans.fit_predict(X)

    # -------------------------
    # Cluster Summary
    # -------------------------

    clusters = []

    overall_avg_revenue = df['Revenue'].mean()
    overall_avg_transactions = df['Transactions'].mean()
    overall_avg_recency = df['Recency'].mean()

    for i in range(n_clusters):
        cluster_df = df[df['Cluster'] == i]
        cluster_count = len(cluster_df)

        avg_revenue = cluster_df['Revenue'].mean()
        avg_transactions = cluster_df['Transactions'].mean()
        avg_recency = cluster_df['Recency'].mean()

        if avg_revenue > overall_avg_revenue and avg_transactions > overall_avg_transactions:
            cluster_name = "VIP Customers"
        elif avg_revenue > overall_avg_revenue:
            cluster_name = "High Spenders"
        elif avg_transactions > overall_avg_transactions:
            cluster_name = "Frequent Buyers"
        elif avg_recency > overall_avg_recency:
            cluster_name = "Inactive Customers"
        else:
            cluster_name = "Low Value Customers"

        clusters.append({
            "id": i,
            "name": cluster_name,
            "count": int(cluster_count)
        })

    # -------------------------
    # Future Prediction Logic (Moved Outside Loop)
    # -------------------------

    max_recency = df['Recency'].max() if df['Recency'].max() > 0 else 1

    # Risk score (0 to 1)
    df['CustomerRiskScore'] = (df['Recency'] / max_recency).round(3)

    # Repeat purchase likelihood
    df['RepeatPurchaseLikelihood'] = (1 - df['CustomerRiskScore']).round(3)

    # Expected next month revenue
    df['ExpectedRevenueNextMonth'] = (
        df['Revenue'] * df['RepeatPurchaseLikelihood']
    ).round(2)

    # Revenue at risk
    df['RevenueAtRisk'] = (
        df['Revenue'] * df['CustomerRiskScore']
    ).round(2)

    # -------------------------
    # Metrics
    # -------------------------

    metrics = {
        "total_customers": int(n_samples),
        "total_revenue": float(df['Revenue'].sum()),
        "avg_revenue_per_customer": float(df['Revenue'].mean()),
        "total_transactions": int(df['Transactions'].sum()),
        "avg_transactions_per_customer": float(df['Transactions'].mean()),
    }

    # -------------------------
    # Top Customers
    # -------------------------

    top_customers = (
        df.sort_values(by='Revenue', ascending=False)
        .head(10)
        .to_dict(orient="records")
    )

    # -------------------------
    # Scatter Plot Data
    # -------------------------

    scatter_plot_axes = {
        "x": {
            "label": "Transactions",
            "values": df['Transactions'].astype(float).tolist()
        },
        "y": {
            "label": "Revenue",
            "values": df['Revenue'].astype(float).tolist()
        },
        "color": df['Cluster'].astype(str).tolist(),
        "size": df['Revenue'].astype(float).tolist()
    }

    # -------------------------
    # Prediction Charts (Business Friendly Naming)
    # -------------------------

    prediction_charts = {

        "revenue_forecast": {
            "current_total": float(df['Revenue'].sum()),
            "expected_next_month": float(df['ExpectedRevenueNextMonth'].sum()),
            "revenue_at_risk": float(df['RevenueAtRisk'].sum())
        },

        "repeat_purchase_likelihood": {
            "very_likely": int((df['RepeatPurchaseLikelihood'] > 0.7).sum()),
            "possibly": int(((df['RepeatPurchaseLikelihood'] > 0.4) &
                             (df['RepeatPurchaseLikelihood'] <= 0.7)).sum()),
            "unlikely": int((df['RepeatPurchaseLikelihood'] <= 0.4).sum())
        },

        "cluster_expected_revenue": (
            df.groupby('Cluster')['ExpectedRevenueNextMonth']
            .sum()
            .round(2)
            .to_dict()
        )
    }

    # -------------------------
    # Final Response
    # -------------------------

    response = {
        "metrics": metrics,
        "clusters": clusters,
        "topCustomers": top_customers,
        "scatterPlotAxes": scatter_plot_axes,
        "data": df.to_dict(orient="records"),
        "columns": df.columns.tolist(),
        "prediction_charts": prediction_charts,
    }

    return response