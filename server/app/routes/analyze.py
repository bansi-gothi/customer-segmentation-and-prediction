from fastapi import APIRouter, UploadFile
import pandas as pd
from app.services.preprocess import preprocess_data

router = APIRouter()

@router.post("/analytics")
async def analytics(file: UploadFile):
    df = pd.read_csv(file.file)
    return preprocess_data(df)