"""
Health API - FastAPI backend for health optimization platform
Integrates ML models, device data, and provides real-time health insights
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import asyncio
import json
import os
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from ml_pipeline.models.cardiovascular_risk_model import CardiovascularRiskModel, ModelConfig
from device_integrations.device_manager import DeviceManager, UserDeviceProfile
from device_integrations.common.base_device import HealthMetric

# Initialize FastAPI app
app = FastAPI(
    title="Health Optimization API",
    description="Clinical-grade health optimization platform with ML-driven insights",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Global instances
device_manager = DeviceManager()
cardio_model = CardiovascularRiskModel()

# Pydantic models for API
class UserProfile(BaseModel):
    user_id: str
    name: str
    email: str
    date_of_birth: str
    sex: str
    height_cm: Optional[int] = None
    weight_kg: Optional[float] = None

class DeviceAuthRequest(BaseModel):
    device_type: str
    credentials: Dict[str, str]

class RiskPredictionResponse(BaseModel):
    risk_category: str
    risk_probability: float
    risk_percentile: int
    sd_band: str
    shap_explanations: List[Dict[str, Any]]
    confidence_interval: List[float]
    model_version: str
    last_updated: datetime

class HealthMetricResponse(BaseModel):
    metric_type: str
    value: float
    unit: str
    timestamp: datetime
    source_device: str
    quality_score: float
    percentile: Optional[int] = None
    sd_band: Optional[str] = None

class DashboardData(BaseModel):
    user_id: str
    risk_predictions: Dict[str, RiskPredictionResponse]
    current_metrics: List[HealthMetricResponse]
    device_status: List[Dict[str, Any]]
    trend_data: List[Dict[str, Any]]
    data_quality_summary: Dict[str, Any]

# Mock user database (in production, use proper database)
mock_users = {
    "user_123": {
        "user_id": "user_123",
        "name": "John Doe",
        "email": "john@example.com",
        "date_of_birth": "1985-06-15",
        "sex": "male",
        "height_cm": 180,
        "weight_kg": 75.0
    }
}

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # In production, validate JWT token here
    # For demo, we'll use a simple token check
    token = credentials.credentials
    if token == "demo_token_123":
        return mock_users["user_123"]
    raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Health Optimization API",
        "version": "1.0.0",
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/auth/device")
async def authenticate_device(
    request: DeviceAuthRequest,
    user: dict = Depends(get_current_user)
):
    """Authenticate user with a health device"""
    try:
        connection = await device_manager.authenticate_device(
            user["user_id"], 
            request.device_type, 
            request.credentials
        )
        
        return {
            "success": True,
            "device_type": request.device_type,
            "status": connection.status,
            "permissions": connection.permissions,
            "last_sync": connection.last_sync
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/devices/status")
async def get_device_status(user: dict = Depends(get_current_user)):
    """Get status of all connected devices for user"""
    try:
        profile = device_manager.get_user_profile(user["user_id"])
        if not profile:
            return {"connected_devices": [], "data_quality_summary": {}}
        
        device_status = []
        for device_type, connection in profile.connected_devices.items():
            status_info = {
                "device_type": device_type,
                "status": connection.status,
                "last_sync": connection.last_sync,
                "data_quality": profile.data_quality_scores.get(device_type, 0.0),
                "permissions": connection.permissions
            }
            device_status.append(status_info)
        
        quality_summary = device_manager.get_data_quality_summary(user["user_id"])
        
        return {
            "connected_devices": device_status,
            "data_quality_summary": quality_summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/devices/sync")
async def sync_device_data(
    background_tasks: BackgroundTasks,
    device_types: Optional[List[str]] = None,
    user: dict = Depends(get_current_user)
):
    """Trigger data synchronization for user's devices"""
    try:
        # Run sync in background
        background_tasks.add_task(
            device_manager.sync_user_data,
            user["user_id"],
            device_types=device_types
        )
        
        return {
            "success": True,
            "message": "Data synchronization started",
            "user_id": user["user_id"],
            "devices": device_types or "all"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health/metrics/current")
async def get_current_metrics(user: dict = Depends(get_current_user)):
    """Get current health metrics for user"""
    try:
        # Get aggregated metrics from device manager
        aggregated = await device_manager.get_aggregated_metrics(user["user_id"])
        
        metrics_response = []
        for metric_type, metric in aggregated.metrics.items():
            # Calculate percentile and SD band (mock for demo)
            percentile = min(max(int(metric.value * 1.2), 1), 99)  # Mock calculation
            sd_band = "green" if metric.quality_score > 0.8 else "yellow"
            
            metrics_response.append(HealthMetricResponse(
                metric_type=metric.metric_type,
                value=metric.value,
                unit=metric.unit,
                timestamp=metric.timestamp,
                source_device=metric.source_device,
                quality_score=metric.quality_score,
                percentile=percentile,
                sd_band=sd_band
            ))
        
        return {
            "metrics": metrics_response,
            "overall_quality": aggregated.overall_quality_score,
            "completeness": aggregated.completeness_score,
            "last_updated": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health/risk/predict")
async def predict_health_risks(user: dict = Depends(get_current_user)):
    """Get ML-based health risk predictions"""
    try:
        # Mock patient data for ML model (in production, get from database)
        mock_patient_data = {
            'apoB_mg_dl': 120.0,
            'lp_a_mg_dl': 45.0,
            'ldl_c_mg_dl': 110.0,
            'hdl_c_mg_dl': 55.0,
            'triglycerides_mg_dl': 120.0,
            'hba1c_percent': 5.8,
            'fasting_glucose_mg_dl': 95.0,
            'homa_ir': 2.1,
            'hs_crp_mg_l': 1.2,
            'homocysteine_umol_l': 8.5,
            'systolic_bp_mmhg': 125.0,
            'diastolic_bp_mmhg': 80.0,
            'resting_hr_bpm': 58.0,
            'vo2_max_ml_kg_min': 42.1,
            'grip_strength_kg': 45.0,
            'sleep_efficiency_percent': 88.0,
            'hrv_rmssd_ms': 45.2,
            'physical_activity_min_week': 180.0,
            'smoking_status': 'never',
            'alcohol_drinks_week': 3.0,
            'age_years': 39.0,
            'sex': 'male',
            'family_history_cad': 'no'
        }
        
        # Mock risk predictions (in production, use trained models)
        risk_predictions = {
            "cardiovascular": RiskPredictionResponse(
                risk_category="cardiovascular",
                risk_probability=0.15,
                risk_percentile=75,
                sd_band="yellow",
                shap_explanations=[
                    {
                        "feature": "apoB_mg_dl",
                        "impact": 0.35,
                        "explanation": "Your ApoB level (120 mg/dL) increases cardiovascular risk"
                    },
                    {
                        "feature": "vo2_max_ml_kg_min",
                        "impact": -0.15,
                        "explanation": "Your fitness level (VO2 Max: 42.1) helps lower risk"
                    },
                    {
                        "feature": "sleep_efficiency_percent",
                        "impact": -0.10,
                        "explanation": "Your sleep quality (88% efficiency) is protective"
                    }
                ],
                confidence_interval=[0.12, 0.18],
                model_version="CardioRisk-RF-v1.2",
                last_updated=datetime.now()
            ),
            "metabolic": RiskPredictionResponse(
                risk_category="metabolic",
                risk_probability=0.08,
                risk_percentile=45,
                sd_band="green",
                shap_explanations=[
                    {
                        "feature": "hba1c_percent",
                        "impact": 0.12,
                        "explanation": "Your HbA1c (5.8%) is slightly elevated"
                    },
                    {
                        "feature": "physical_activity_min_week",
                        "impact": -0.20,
                        "explanation": "Your exercise (180 min/week) significantly lowers risk"
                    }
                ],
                confidence_interval=[0.06, 0.10],
                model_version="MetabolicRisk-XGB-v1.1",
                last_updated=datetime.now()
            ),
            "neurocognitive": RiskPredictionResponse(
                risk_category="neurocognitive",
                risk_probability=0.05,
                risk_percentile=25,
                sd_band="green",
                shap_explanations=[
                    {
                        "feature": "hrv_rmssd_ms",
                        "impact": -0.18,
                        "explanation": "Your heart rate variability (45.2 ms) is excellent for brain health"
                    },
                    {
                        "feature": "sleep_duration",
                        "impact": -0.12,
                        "explanation": "Your sleep duration (7.5 hours) supports cognitive function"
                    }
                ],
                confidence_interval=[0.03, 0.07],
                model_version="NeuroCog-RF-v1.0",
                last_updated=datetime.now()
            )
        }
        
        return {"risk_predictions": risk_predictions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dashboard/data")
async def get_dashboard_data(user: dict = Depends(get_current_user)):
    """Get complete dashboard data for user"""
    try:
        # Get all data components
        device_status_response = await get_device_status(user)
        metrics_response = await get_current_metrics(user)
        risk_response = await predict_health_risks(user)
        
        # Mock trend data (in production, query from database)
        trend_data = [
            {"date": "2024-12-09", "hrv": 42.1, "sleep_efficiency": 85, "vo2_max": 41.8, "steps": 7234},
            {"date": "2024-12-10", "hrv": 44.3, "sleep_efficiency": 87, "vo2_max": 42.0, "steps": 8901},
            {"date": "2024-12-11", "hrv": 43.8, "sleep_efficiency": 82, "vo2_max": 41.9, "steps": 6543},
            {"date": "2024-12-12", "hrv": 46.1, "sleep_efficiency": 89, "vo2_max": 42.2, "steps": 9876},
            {"date": "2024-12-13", "hrv": 45.7, "sleep_efficiency": 86, "vo2_max": 42.1, "steps": 8234},
            {"date": "2024-12-14", "hrv": 44.9, "sleep_efficiency": 90, "vo2_max": 42.3, "steps": 7890},
            {"date": "2024-12-15", "hrv": 45.2, "sleep_efficiency": 88, "vo2_max": 42.1, "steps": 8542}
        ]
        
        dashboard_data = DashboardData(
            user_id=user["user_id"],
            risk_predictions=risk_response["risk_predictions"],
            current_metrics=metrics_response["metrics"],
            device_status=device_status_response["connected_devices"],
            trend_data=trend_data,
            data_quality_summary=device_status_response["data_quality_summary"]
        )
        
        return dashboard_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health/recommendations")
async def get_health_recommendations(user: dict = Depends(get_current_user)):
    """Get personalized health recommendations based on current data"""
    try:
        # Mock recommendations based on risk factors
        recommendations = [
            {
                "category": "cardiovascular",
                "priority": "high",
                "title": "Improve ApoB Levels",
                "description": "Your ApoB is elevated. Consider increasing fiber intake to 25-30g daily.",
                "actions": [
                    "Add 2 servings of beans/legumes daily",
                    "Include oats or barley in breakfast",
                    "Discuss statin therapy with your doctor"
                ],
                "evidence": "High-fiber diets reduce ApoB by 15-25% (NNT: 8)",
                "timeline": "4-6 weeks"
            },
            {
                "category": "fitness",
                "priority": "medium",
                "title": "Optimize VO2 Max",
                "description": "Your VO2 Max could be improved with targeted Zone 2 training.",
                "actions": [
                    "Add 2x 45-minute Zone 2 sessions weekly",
                    "Monitor heart rate: 120-140 bpm during exercise",
                    "Track progress with monthly fitness tests"
                ],
                "evidence": "Zone 2 training improves VO2 Max by 8-15% (NNT: 3)",
                "timeline": "8-12 weeks"
            },
            {
                "category": "sleep",
                "priority": "low",
                "title": "Maintain Sleep Quality",
                "description": "Your sleep efficiency is excellent. Keep up current habits.",
                "actions": [
                    "Continue consistent sleep schedule",
                    "Maintain cool, dark sleep environment",
                    "Monitor for any changes in sleep patterns"
                ],
                "evidence": "Sleep efficiency >85% associated with 20% lower disease risk",
                "timeline": "Ongoing"
            }
        ]
        
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/realtime/{user_id}")
async def websocket_endpoint(websocket, user_id: str):
    """WebSocket endpoint for real-time health data updates"""
    await websocket.accept()
    
    try:
        while True:
            # Get real-time data from devices
            real_time_data = await device_manager.get_real_time_data(user_id)
            
            # Send data to client
            await websocket.send_json({
                "type": "health_update",
                "timestamp": datetime.now().isoformat(),
                "data": real_time_data
            })
            
            # Wait 30 seconds before next update
            await asyncio.sleep(30)
            
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
