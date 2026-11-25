import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.schema import ClaimInput

app = FastAPI(title="Insurance Claim Fraud Detector")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("model/best_model_rf.pkl")

THRESHOLD = 0.30

@app.get("/health", status_code=200)
async def health_check():
    return {
        "status": "healthy",
        "service": "my-python-api"
    }

@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return {"message": "Insurance Fraud Detection API is running"}


@app.post("/predict")
def predict(claim: ClaimInput):
    data = claim.model_dump()

    # Rename fields back to original column names with special characters
    data["Days:Policy-Accident"] = data.pop("Days_Policy_Accident")
    data["Days:Policy-Claim"] = data.pop("Days_Policy_Claim")
    data["AddressChange-Claim"] = data.pop("AddressChange_Claim")

    df = pd.DataFrame([data])
    probability = model.predict_proba(df)[0][1]
    prediction = int(probability >= THRESHOLD)

    return {
        "fraud": bool(prediction),
        "probability": round(float(probability), 3),
        "threshold_used": THRESHOLD
    }
