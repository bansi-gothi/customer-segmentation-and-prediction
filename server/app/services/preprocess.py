import pandas as pd
import numpy as np
from app.services.ml_service import build_model


def preprocess_data(df):

    df.columns = df.columns.astype(str)

    df = df.loc[:, ~df.columns.str.contains("^Unnamed", case=False)]
    df = df.loc[:, df.columns.notna()]
    df = df.rename(columns=lambda x: x.strip() if isinstance(x, str) else x)
    df = df.loc[:, df.columns != ""]
    try:
        # -----------------------------
        # Convert Date Columns (Optional)
        # -----------------------------
       date_cols = []

       for col in df.columns:
        if isinstance(col, str) and "date" in col.lower():

            df[col] = pd.to_datetime(df[col], errors="coerce")
            date_cols.append(col)

        # -----------------------------
        # Identify Column Types
        # -----------------------------
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = df.select_dtypes(include=["object"]).columns.tolist()

        if not numeric_cols:
            return {"error": "At least one numeric column is required."}

        # -----------------------------
        # Detect Revenue Column
        # -----------------------------
        revenue_keywords = ["income", "revenue", "amount", "invoice", "sales", "expenditure"]

        primary_metric = None
        for col in numeric_cols:
            for keyword in revenue_keywords:
                if keyword in col.lower():
                    primary_metric = col
                    break
            if primary_metric:
                break

        if not primary_metric:
            primary_metric = numeric_cols[0]

        # -----------------------------
        # Detect Customer Column (Still Mandatory)
        # -----------------------------
        customer_col = None
        customer_keywords = ["customer", "client", "user", "name", "id"]

        for col in df.columns:
            for keyword in customer_keywords:
                if keyword in col.lower():
                    customer_col = col
                    break
            if customer_col:
                break

        if not customer_col:
            return {
                "error": "A customer identifier column is required."
            }

        # -----------------------------
        # Prepare Feature Data (Numeric Only)
        # -----------------------------
        X = df[numeric_cols].copy()

        # -----------------------------
        # Send to ML
        # -----------------------------
        result = build_model(
            X=X,
            full_df=df,
            numeric_cols=numeric_cols,
            date_col=date_cols[0] if date_cols else None,
            customer_col=customer_col,
            primary_metric=primary_metric
        )

        return result

    except Exception as e:
        return {"error": str(e)}