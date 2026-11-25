import joblib
import numpy as np
import pandas as pd
import shap
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
preprocessor = model.named_steps["preprocessor"]
classifier = model.named_steps["classifier"]
explainer = shap.TreeExplainer(classifier)

THRESHOLD = 0.30


@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return {"message": "Insurance Fraud Detection API is running"}


@app.post("/predict")
def predict(claim: ClaimInput):
    data = claim.model_dump()

    data["Days:Policy-Accident"] = data.pop("Days_Policy_Accident")
    data["Days:Policy-Claim"] = data.pop("Days_Policy_Claim")
    data["AddressChange-Claim"] = data.pop("AddressChange_Claim")

    df = pd.DataFrame([data])

    # Prediction
    probability = model.predict_proba(df)[0][1]
    prediction = int(probability >= THRESHOLD)

    # SHAP explanation
    transformed = preprocessor.transform(df)
    shap_values = explainer.shap_values(transformed)

    # newer SHAP returns (n_samples, n_features, n_classes) — we want class1 (fraud)
    if isinstance(shap_values, list):
        fraud_shap = shap_values[1][0]
    else:
        fraud_shap = shap_values[0, :, 1]

    # Get feature names after preprocessing
    num_features = preprocessor.transformers_[0][2]
    cat_features = preprocessor.transformers_[1][1].get_feature_names_out(
        preprocessor.transformers_[1][2]
    ).tolist()
    all_features = list(num_features) + cat_features

    # Map original input value to each feature name
    transformed_dense = transformed if isinstance(transformed, np.ndarray) else transformed.toarray()
    feature_values = transformed_dense[0]

    # Pair feature names with shap values, sort by absolute impact
    shap_pairs = sorted(
        zip(all_features, fraud_shap),
        key=lambda x: abs(x[1]),
        reverse=True
    )

    # Clean up OHE feature names and take top 5
    # OHE names look like: "Make_Honda", "BasePolicy_Liability"
    # We want: "Make: Honda", "BasePolicy: Liability"
    cat_col_names = preprocessor.transformers_[1][2]

    top_reasons = []
    for name, impact in shap_pairs[:5]:
        clean_name = name
        for col in cat_col_names:
            if name.startswith(col + "_"):
                value = name[len(col) + 1:]
                clean_name = f"{col}: {value}"
                break
        top_reasons.append({
            "feature": clean_name,
            "impact": round(float(impact), 4),
            "direction": "↑ suspicious" if impact > 0 else "↓ normal"
        })

    return {
        "fraud": bool(prediction),
        "probability": round(float(probability), 3),
        "threshold_used": THRESHOLD,
        "top_reasons": top_reasons
    }

