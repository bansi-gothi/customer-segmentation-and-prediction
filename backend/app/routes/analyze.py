from fastapi import APIRouter, UploadFile
import pandas as pd
from app.services.preprocess import preprocess_data

router = APIRouter()

@router.post("/analytics")
async def analytics(file: UploadFile):
    try:
        df = pd.read_csv(file.file)
        response = preprocess_data(df)
        return response
    except ValueError as ve:
        # Catch missing column error and return message to frontend
        return {"error": str(ve)}
    except Exception as e:
        # Catch all other errors
        return {"error": "Failed to process file. " + str(e)}