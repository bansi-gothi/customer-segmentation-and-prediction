import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import MiniBatchKMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import silhouette_score
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split


def find_optimal_clusters(X, k_min=2, k_max=7):

    X_train, X_test = train_test_split(X, test_size=0.2, random_state=42)

    best_score = -1
    best_k = k_min

    for k in range(k_min, k_max + 1):

        model = MiniBatchKMeans(
            n_clusters=k,
            random_state=42,
            batch_size=1024,
            n_init=10
        )

        model.fit(X_train)

        test_labels = model.predict(X_test)

        score = silhouette_score(X_test, test_labels)

        if score > best_score:
            best_score = score
            best_k = k

    return best_k, best_score

def build_model(X, full_df, numeric_cols,
                date_col=None,
                customer_col=None,
                primary_metric=None):

    if not numeric_cols:
        return {"error": "At least one numeric column is required."}

    df = full_df.copy()
    columns = df.columns.tolist()

    # ================= Scaling =================
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # ================= Clustering =================
    max_k = min(7, len(df) - 1)
    n_clusters, _ = find_optimal_clusters(X_scaled, 2, max_k)

    kmeans = MiniBatchKMeans(
        n_clusters=n_clusters,
        random_state=42,
        batch_size=1024,
        n_init=10
    )

    labels = kmeans.fit_predict(X_scaled)
    df["cluster"] = labels
    silhouette = silhouette_score(X_scaled, labels)

    # ================= Cluster Naming =================
    metric_col = primary_metric if primary_metric in df.columns else numeric_cols[0]

    cluster_avg = (
        df.groupby("cluster")[metric_col]
        .mean()
        .sort_values(ascending=False)
    )

    ranked_clusters = cluster_avg.index.tolist()

    cluster_name_map = {}
    for i, cluster_id in enumerate(ranked_clusters):
        if i == 0:
            cluster_name_map[cluster_id] = "High Value Customers"
        elif i == len(ranked_clusters) - 1:
            cluster_name_map[cluster_id] = "Low Engagement Customers"
        elif i == 1:
            cluster_name_map[cluster_id] = "Loyal Customers"
        else:
            cluster_name_map[cluster_id] = "Regular Customers"

    df["clusterName"] = df["cluster"].map(cluster_name_map)

    cluster_counts = df["cluster"].value_counts()

    clusters = [
        {
            "id": int(cid),
            "name": cluster_name_map[cid],
            "count": int(cluster_counts.get(cid, 0))
        }
        for cid in ranked_clusters
    ]

    # ================= High Value Detection =================
    high_value_cluster = ranked_clusters[0]
    df["highValue"] = df["cluster"] == high_value_cluster

    clf = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        n_jobs=-1
    )

    clf.fit(df[numeric_cols], df["highValue"])
    df["probability"] = clf.predict_proba(df[numeric_cols])[:, 1]

    # ================= Metrics =================
    total_rows = len(df)
    high_value_count = int(df["highValue"].sum())

    metrics = {
        "totalCustomers": int(total_rows),
        "highValuePercent": round(high_value_count / total_rows * 100, 1),
        "clustersFound": int(df["cluster"].nunique()),
    }

    # ================= Top Customers =================
    top_customers = []

    if customer_col and customer_col in df.columns:
        top_ids = (
            df.groupby(customer_col)[metric_col]
            .sum()
            .sort_values(ascending=False)
            .head(20)
            .index
            .tolist()
        )

        top_df = df[df[customer_col].isin(top_ids)].copy()
        top_df = top_df.sort_values("probability", ascending=False)
        top_customers = top_df.to_dict(orient="records")

    # ================= Trends =================
    trends = {}

    if date_col and date_col in df.columns:
        df["week"] = df[date_col].dt.isocalendar().week
        df["month"] = df[date_col].dt.month
        df["year"] = df[date_col].dt.year

        trends = {
            "weekly": df.groupby("week")[metric_col].sum().to_dict(),
            "monthly": df.groupby("month")[metric_col].sum().to_dict(),
            "yearly": df.groupby("year")[metric_col].sum().to_dict(),
        }

    # ================= Scatter =================
    if len(numeric_cols) > 2:
        pca = PCA(n_components=2)
        df[["PC1", "PC2"]] = pca.fit_transform(X_scaled)

        x_axis, y_axis = "PC1", "PC2"
        x_label = "Customer Profile Score"
        y_label = "Spending Behavior Score"

    elif len(numeric_cols) >= 2:
        x_axis, y_axis = numeric_cols[:2]
        x_label = x_axis.replace("_", " ").title()
        y_label = y_axis.replace("_", " ").title()

    else:
        x_axis = numeric_cols[0]
        y_axis = "probability"
        x_label = x_axis.replace("_", " ").title()
        y_label = "High Value Score"

    scatter_plot_axes = {
        "x": {"label": x_label, "values": df[x_axis].tolist()},
        "y": {"label": y_label, "values": df[y_axis].tolist()},
        "color": df["clusterName"].tolist(),
        "colorLabel": "Customer Segment",
        "size": df["probability"].tolist(),
        "sizeLabel": "High Value Score"
    }

    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.fillna(0, inplace=True)

    return {
        "metrics": metrics,
        "clusters": clusters,
        "topCustomers": top_customers,
        "trends": trends,
        "scatterPlotAxes": scatter_plot_axes,
        "data": df.to_dict(orient="records"),
        "columns": columns
    }
    clf.fit(df[numeric_cols], df["highValue"])

    df["probability"] = clf.predict_proba(df[numeric_cols])[:, 1]

    # ===============================
    # Metrics
    # ===============================
    total_rows = len(df)
    high_value_count = int(df["highValue"].sum())

    metrics = {
        "totalCustomers": int(total_rows),
        "highValuePercent": round(high_value_count / total_rows * 100, 1),
        "clustersFound": int(df["cluster"].nunique()),
        "accuracy": round(float(silhouette), 3)
    }

    # ===============================
    # Top Customers
    # ===============================
    top_customers = []

    if customer_col and customer_col in df.columns:

        # Get top 20 customers by total metric
        top_ids = (
            df.groupby(customer_col)[metric_col]
            .sum()
            .sort_values(ascending=False)
            .head(20)
            .index
            .tolist()
        )

        # Get full rows for those customers
        top_df = df[df[customer_col].isin(top_ids)].copy()

        # Optional: sort by probability
        top_df = top_df.sort_values("probability", ascending=False)

        top_customers = top_df.to_dict(orient="records")

    # ===============================
    # Trends (Only if Date Exists)
    # ===============================
    trends = {}

    if date_col and date_col in df.columns:
        df["week"] = df[date_col].dt.isocalendar().week
        df["month"] = df[date_col].dt.month
        df["year"] = df[date_col].dt.year

        trends = {
            "weekly": df.groupby("week")[metric_col].sum().to_dict(),
            "monthly": df.groupby("month")[metric_col].sum().to_dict(),
            "yearly": df.groupby("year")[metric_col].sum().to_dict(),
        }

    # ===============================
    # User-Friendly Scatter Plot
    # ===============================
    if len(numeric_cols) > 2:
        pca = PCA(n_components=2)
        df[["PC1", "PC2"]] = pca.fit_transform(X_scaled)

        x_axis = "PC1"
        y_axis = "PC2"

        x_label = "Customer Profile Score"
        y_label = "Spending Behavior Score"

    elif len(numeric_cols) >= 2:
        x_axis = numeric_cols[0]
        y_axis = numeric_cols[1]

        x_label = f"{x_axis.replace('_', ' ').title()}"
        y_label = f"{y_axis.replace('_', ' ').title()}"

    else:
        x_axis = numeric_cols[0]
        y_axis = "probability"

        x_label = f"{x_axis.replace('_', ' ').title()}"
        y_label = "High Value Score"

    scatter_plot_axes = {
        "x": {
            "label": x_label,
            "values": df[x_axis].tolist()
        },
        "y": {
            "label": y_label,
            "values": df[y_axis].tolist()
        },
        "color": df["clusterName"].tolist(),
        "colorLabel": "Customer Segment",
        "size": df["probability"].tolist(),
        "sizeLabel": "High Value Score"
    }

    # ===============================
    # FINAL RESPONSE
    # ===============================
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.fillna(0, inplace=True)

    # ===============================
    # FINAL RESPONSE
    # ===============================
    return {
        "metrics": metrics,
        "clusters": clusters,
        "topCustomers": top_customers, 
        "trends": trends,
        "scatterPlotAxes": scatter_plot_axes,
        "data": df.to_dict(orient="records"),
        "columns":columns
    }