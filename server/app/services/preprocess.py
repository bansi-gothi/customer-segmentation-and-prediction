import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from app.services.ml_service import build_model


REQUIRED_COLUMNS = ['CustomerID', 'Date', 'Revenue', 'Transactions']


def preprocess_data(df):

    df.columns = df.columns.astype(str)

    # Lowercase comparison
    df_columns_lower = [col.lower() for col in df.columns]

    # Check required columns
    missing_cols = [
        col for col in REQUIRED_COLUMNS
        if col.lower() not in df_columns_lower
    ]

    if missing_cols:
        raise ValueError(
            f"The following required columns are missing from CSV: {missing_cols}"
        )

    # Convert Date column
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')

    if df['Date'].isna().all():
        raise ValueError("Date column contains invalid or empty values.")

    # Remove duplicates
    df = df.drop_duplicates()

    # -----------------------------
    # Aggregate by CustomerID
    # -----------------------------
    customer_df = df.groupby('CustomerID').agg({
        'Revenue': 'sum',
        'Transactions': 'sum',
        'Date': 'max'
    }).reset_index()

    # Calculate AvgTransactionValue
    customer_df['AvgTransactionValue'] = (
        customer_df['Revenue'] /
        customer_df['Transactions'].replace(0, 1)
    )

    # Calculate Recency
    today = pd.Timestamp('today')
    customer_df['Recency'] = (today - customer_df['Date']).dt.days

    # -----------------------------
    # Feature Selection
    # -----------------------------
    X = customer_df[
        ['Revenue', 'Transactions', 'AvgTransactionValue', 'Recency']
    ]

    # Clean numeric issues
    X = X.replace([np.inf, -np.inf], np.nan)
    X = X.fillna(X.mean())

    # Scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_scaled_df = pd.DataFrame(X_scaled, columns=X.columns)

    return build_model(X_scaled_df, customer_df)