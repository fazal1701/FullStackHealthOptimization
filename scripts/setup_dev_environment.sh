#!/bin/bash

# Health Optimization Platform - Development Environment Setup
# This script sets up the complete local development environment

set -e

echo "🏥 Setting up Health Optimization Platform Development Environment"
echo "=================================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p {config,logs,data/{postgres,redis,models}}
mkdir -p backend/database
mkdir -p ml_pipeline/models/trained
mkdir -p device_integrations/logs

# Create environment file
echo "🔧 Creating environment configuration..."
cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://health_user:health_password@localhost:5432/health_optimization
POSTGRES_DB=health_optimization
POSTGRES_USER=health_user
POSTGRES_PASSWORD=health_password

# Redis Configuration
REDIS_URL=redis://localhost:6379

# API Configuration
SECRET_KEY=your-super-secret-key-change-in-production
ENVIRONMENT=development
API_HOST=0.0.0.0
API_PORT=8000

# Device Integration Credentials (Add your actual credentials)
FITBIT_CLIENT_ID=your_fitbit_client_id
FITBIT_CLIENT_SECRET=your_fitbit_client_secret
OURA_CLIENT_ID=your_oura_client_id
OURA_CLIENT_SECRET=your_oura_client_secret
WHOOP_CLIENT_ID=your_whoop_client_id
WHOOP_CLIENT_SECRET=your_whoop_client_secret

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# ML Model Configuration
MODEL_PATH=./ml_pipeline/models/trained
SHAP_CACHE_SIZE=1000

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
EOF

# Create database initialization script
echo "🗄️ Creating database schema..."
cat > backend/database/init.sql << EOF
-- Health Optimization Platform Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('patient', 'doctor', 'admin')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY REFERENCES users(id),
    date_of_birth DATE NOT NULL,
    sex VARCHAR(10) CHECK (sex IN ('male', 'female', 'other')) NOT NULL,
    height_cm INTEGER,
    weight_kg DECIMAL(5,2),
    doctor_id UUID REFERENCES users(id)
);

-- Device connections
CREATE TABLE device_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    permissions JSONB,
    last_sync TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health metrics
CREATE TABLE health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    device_id UUID REFERENCES device_connections(id),
    metric_type VARCHAR(100) NOT NULL,
    value DECIMAL(10,4) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    measured_at TIMESTAMP WITH TIME ZONE NOT NULL,
    quality_score DECIMAL(3,2) DEFAULT 1.0,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk predictions
CREATE TABLE risk_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    risk_category VARCHAR(50) NOT NULL,
    risk_probability DECIMAL(5,4) NOT NULL,
    risk_percentile INTEGER,
    confidence_interval DECIMAL(5,4)[],
    shap_values JSONB,
    model_version VARCHAR(50),
    predicted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_health_metrics_user_id ON health_metrics(user_id);
CREATE INDEX idx_health_metrics_type_time ON health_metrics(metric_type, measured_at);
CREATE INDEX idx_risk_predictions_user_id ON risk_predictions(user_id);
CREATE INDEX idx_device_connections_user_id ON device_connections(user_id);

-- Insert sample data
INSERT INTO users (id, email, name, role) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'john@example.com', 'John Doe', 'patient'),
('550e8400-e29b-41d4-a716-446655440001', 'dr.smith@hospital.com', 'Dr. Sarah Smith', 'doctor');

INSERT INTO patients (id, date_of_birth, sex, height_cm, weight_kg) VALUES 
('550e8400-e29b-41d4-a716-446655440000', '1985-06-15', 'male', 180, 75.0);
EOF

# Create Prometheus configuration
echo "📊 Creating monitoring configuration..."
mkdir -p config
cat > config/prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'health-api'
    static_configs:
      - targets: ['backend:8000']
  
  - job_name: 'ml-service'
    static_configs:
      - targets: ['ml_service:8001']
  
  - job_name: 'device-sync'
    static_configs:
      - targets: ['device_sync:8002']
EOF

# Create Grafana dashboard configuration
mkdir -p config/grafana/dashboards
cat > config/grafana/dashboard.yml << EOF
apiVersion: 1

providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    options:
      path: /etc/grafana/provisioning/dashboards
EOF

# Create ML model training script
echo "🤖 Creating ML model training script..."
cat > scripts/train_models.py << EOF
#!/usr/bin/env python3
"""
Train and save ML models for health risk prediction
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import pandas as pd
import numpy as np
from ml_pipeline.models.cardiovascular_risk_model import CardiovascularRiskModel
from datetime import datetime

def generate_synthetic_data(n_samples=1000):
    """Generate synthetic health data for training"""
    np.random.seed(42)
    
    data = {
        'apoB_mg_dl': np.random.normal(100, 25, n_samples),
        'lp_a_mg_dl': np.random.exponential(30, n_samples),
        'ldl_c_mg_dl': np.random.normal(120, 30, n_samples),
        'hdl_c_mg_dl': np.random.normal(50, 15, n_samples),
        'triglycerides_mg_dl': np.random.lognormal(4.5, 0.5, n_samples),
        'hba1c_percent': np.random.normal(5.5, 0.8, n_samples),
        'fasting_glucose_mg_dl': np.random.normal(95, 15, n_samples),
        'homa_ir': np.random.exponential(2, n_samples),
        'hs_crp_mg_l': np.random.exponential(2, n_samples),
        'homocysteine_umol_l': np.random.normal(10, 3, n_samples),
        'systolic_bp_mmhg': np.random.normal(125, 20, n_samples),
        'diastolic_bp_mmhg': np.random.normal(80, 10, n_samples),
        'resting_hr_bpm': np.random.normal(65, 12, n_samples),
        'vo2_max_ml_kg_min': np.random.normal(40, 10, n_samples),
        'grip_strength_kg': np.random.normal(40, 10, n_samples),
        'sleep_efficiency_percent': np.random.normal(85, 8, n_samples),
        'hrv_rmssd_ms': np.random.exponential(40, n_samples),
        'physical_activity_min_week': np.random.exponential(150, n_samples),
        'smoking_status': np.random.choice(['never', 'former', 'current'], n_samples, p=[0.6, 0.3, 0.1]),
        'alcohol_drinks_week': np.random.exponential(5, n_samples),
        'age_years': np.random.normal(45, 15, n_samples),
        'sex': np.random.choice(['male', 'female'], n_samples),
        'family_history_cad': np.random.choice(['yes', 'no'], n_samples, p=[0.3, 0.7])
    }
    
    df = pd.DataFrame(data)
    
    # Generate synthetic cardiovascular risk outcome
    risk_score = (
        0.3 * (df['apoB_mg_dl'] - 100) / 25 +
        0.2 * (df['age_years'] - 45) / 15 +
        0.15 * (df['systolic_bp_mmhg'] - 125) / 20 +
        -0.2 * (df['vo2_max_ml_kg_min'] - 40) / 10 +
        0.1 * (df['hba1c_percent'] - 5.5) / 0.8 +
        np.random.normal(0, 0.5, n_samples)
    )
    
    # Convert to binary outcome (10-year CVD risk)
    df['cardiovascular_risk_10yr'] = (risk_score > 0.5).astype(int)
    
    return df

def main():
    print("🤖 Training cardiovascular risk model...")
    
    # Generate synthetic training data
    train_data = generate_synthetic_data(5000)
    
    # Initialize and train model
    model = CardiovascularRiskModel()
    
    # Train the model
    performance = model.train(
        train_data, 
        'cardiovascular_risk_10yr',
        protected_attributes=['sex', 'age_years']
    )
    
    print(f"Model training completed!")
    print(f"AUC: {performance['overall_performance']['auc_roc']:.3f}")
    print(f"Brier Score: {performance['overall_performance']['brier_score']:.3f}")
    
    # Save the trained model
    model_path = 'ml_pipeline/models/trained/cardiovascular_risk_model.joblib'
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    model.save_model(model_path)
    
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    main()
EOF

# Make scripts executable
chmod +x scripts/train_models.py

# Create development startup script
cat > scripts/start_dev.sh << EOF
#!/bin/bash

echo "🚀 Starting Health Optimization Platform Development Environment"
echo "=============================================================="

# Load environment variables
source .env

# Start services with Docker Compose
echo "📦 Starting Docker services..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Train ML models if they don't exist
if [ ! -f "ml_pipeline/models/trained/cardiovascular_risk_model.joblib" ]; then
    echo "🤖 Training ML models..."
    python scripts/train_models.py
fi

# Start all services
echo "🌐 Starting all services..."
docker-compose up -d

echo "✅ Development environment is ready!"
echo ""
echo "🔗 Available services:"
echo "   Frontend:    http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   ML Service:  http://localhost:8001"
echo "   Grafana:     http://localhost:3001 (admin/admin)"
echo "   Prometheus:  http://localhost:9090"
echo ""
echo "📚 API Documentation: http://localhost:8000/docs"
echo "🔍 Health Check:      http://localhost:8000/"
EOF

chmod +x scripts/start_dev.sh

# Create stop script
cat > scripts/stop_dev.sh << EOF
#!/bin/bash

echo "🛑 Stopping Health Optimization Platform Development Environment"
docker-compose down

echo "✅ All services stopped"
EOF

chmod +x scripts/stop_dev.sh

# Create data generation script for testing
cat > scripts/generate_test_data.py << EOF
#!/usr/bin/env python3
"""
Generate test data for development and testing
"""

import asyncio
import aiohttp
import json
from datetime import datetime, timedelta
import random

async def generate_test_metrics():
    """Generate realistic test health metrics"""
    base_url = "http://localhost:8000"
    
    # Mock user token
    headers = {"Authorization": "Bearer demo_token_123"}
    
    # Generate 30 days of test data
    metrics = []
    for i in range(30):
        date = datetime.now() - timedelta(days=i)
        
        daily_metrics = {
            "steps": random.randint(5000, 15000),
            "hrv_rmssd": random.uniform(35, 55),
            "sleep_efficiency": random.uniform(75, 95),
            "sleep_duration": random.uniform(6.5, 8.5),
            "resting_heart_rate": random.randint(50, 75),
            "vo2_max": random.uniform(35, 50),
            "calories_burned": random.randint(1800, 2800)
        }
        
        for metric_type, value in daily_metrics.items():
            metrics.append({
                "metric_type": metric_type,
                "value": value,
                "unit": "count" if metric_type == "steps" else "various",
                "timestamp": date.isoformat(),
                "source_device": random.choice(["fitbit", "oura", "whoop"]),
                "quality_score": random.uniform(0.8, 1.0)
            })
    
    return metrics

async def main():
    print("📊 Generating test data...")
    
    metrics = await generate_test_metrics()
    
    # Save to file for import
    with open("data/test_metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)
    
    print(f"✅ Generated {len(metrics)} test metrics")
    print("💾 Saved to data/test_metrics.json")

if __name__ == "__main__":
    asyncio.run(main())
EOF

chmod +x scripts/generate_test_data.py

echo "✅ Development environment setup complete!"
echo ""
echo "🚀 To start the development environment:"
echo "   ./scripts/start_dev.sh"
echo ""
echo "🛑 To stop the development environment:"
echo "   ./scripts/stop_dev.sh"
echo ""
echo "📊 To generate test data:"
echo "   python scripts/generate_test_data.py"
echo ""
echo "🔧 Next steps:"
echo "1. Add your device API credentials to .env file"
echo "2. Run ./scripts/start_dev.sh to start all services"
echo "3. Visit http://localhost:3000 to see the dashboard"
echo "4. Check http://localhost:8000/docs for API documentation"
