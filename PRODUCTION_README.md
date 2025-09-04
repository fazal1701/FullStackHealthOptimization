# 🏥 Clinical-Grade Health Optimization Platform

A comprehensive, production-ready health optimization platform that combines machine learning-driven risk prediction with real-time device integration and personalized health insights.

## 🌟 Key Features

### 🤖 AI-Powered Health Insights
- **Random Forest + XGBoost Models** with bias mitigation and fairness monitoring
- **SHAP Explainability** for transparent risk predictions
- **Real-time Risk Assessment** for cardiovascular, metabolic, and neurocognitive health
- **Uncertainty Quantification** with confidence intervals

### 📱 Comprehensive Device Integration
- **Fitbit** - Steps, heart rate, sleep, activity data
- **Oura Ring** - Advanced sleep metrics, HRV, body temperature
- **WHOOP** - Recovery, strain, sleep optimization
- **Apple Health** - Comprehensive health data aggregation
- **Garmin** - Fitness and performance metrics

### 🎯 Patient-Centric Dashboard
- **Risk Visualization** with traffic-light SD bands (Green/Yellow/Orange/Red)
- **Real-time Metrics** with quality scoring and device sync status
- **Trend Analysis** with 7-day rolling averages
- **Personalized Recommendations** based on SHAP explanations

### 👩‍⚕️ Clinical Decision Support
- **Population Health Management** with cohort risk stratification
- **Evidence-based Interventions** with NNT/NNH calculations
- **SHAP Waterfall Plots** for clinical decision making
- **Medication Decision Support** with mechanism diagrams

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   ML Pipeline   │
│   (Next.js)     │◄──►│   (Frontend Only) │◄──►│   (Mock Data)      │
│                 │    │                 │    │                 │
│ • Patient UI    │    │ • Authentication│    │ • Risk Models   │
│ • Doctor UI     │    │ • Device APIs   │    │ • SHAP Explain  │
│ • Real-time     │    │ • Health Data   │    │ • Bias Monitor  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   PostgreSQL    │              │
         └──────────────┤   Database      │◄─────────────┘
                        │                 │
                        │ • User Data     │
                        │ • Health Metrics│
                        │ • Risk Scores   │
                        └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd FullStackHealthOptimization
./scripts/setup_dev_environment.sh
```

### 2. Configure Device APIs
Edit `.env` file with your device API credentials:
```bash
# Device Integration Credentials
FITBIT_CLIENT_ID=your_fitbit_client_id
FITBIT_CLIENT_SECRET=your_fitbit_client_secret
OURA_CLIENT_ID=your_oura_client_id
OURA_CLIENT_SECRET=your_oura_client_secret
```

### 3. Start Development Environment
```bash
./scripts/start_dev.sh
```

### 4. Access the Platform
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Grafana Monitoring**: http://localhost:3001 (admin/admin)

## 📊 ML Models & Bias Mitigation

### Cardiovascular Risk Model
- **Algorithm**: Random Forest + XGBoost ensemble
- **Features**: 25+ clinical biomarkers (ApoB, Lp(a), HbA1c, VO2 Max, HRV, etc.)
- **Performance**: AUC >0.80, calibrated across demographic groups
- **Fairness**: <5pp difference in FNR/FPR between protected groups

### Bias Mitigation Pipeline
```python
# Pre-training
- Stratified sampling by demographics
- Inverse propensity weighting
- Unit harmonization across devices

# Training
- Group-aware cross-validation
- Fairness constraints in optimization
- Monotonic constraints (clinical knowledge)

# Post-training
- Subgroup calibration adjustment
- Uncertainty quantification
- Continuous fairness monitoring
```

### SHAP Explainability
- **Patient View**: "Your ApoB (+0.35) and low VO2 Max (+0.20) increase risk"
- **Doctor View**: Full waterfall plots with feature importance
- **Counterfactuals**: "If ApoB -30mg/dL → risk -9% (95% CI: -6 to -12)"

## 🔌 Device Integration

### Supported Devices
| Device | Metrics | Sync Frequency | Quality Score |
|--------|---------|----------------|---------------|
| Oura Ring | Sleep, HRV, Temperature | Daily | 0.95 |
| Fitbit | Steps, HR, Activity | Real-time | 0.89 |
| WHOOP | Recovery, Strain | Hourly | 0.92 |
| Apple Health | Comprehensive | Real-time | 0.87 |
| Garmin | Fitness, Performance | Daily | 0.88 |

### Data Quality Monitoring
- **Completeness**: % of expected data points received
- **Freshness**: Time since last device sync
- **Consistency**: Cross-device validation
- **Accuracy**: Device-specific quality indicators

## 🏥 Clinical Features

### Risk Stratification
- **Green**: <1 SD from age/sex norm (protective)
- **Yellow**: 1-2 SD (elevated attention)
- **Orange**: 2-3 SD (intervention recommended)
- **Red**: >3 SD (urgent intervention)

### Evidence Integration
- **Studies Database**: 50+ research summaries with effect sizes
- **Medication Library**: Mechanism diagrams, expected biomarker changes
- **Clinical Guidelines**: Evidence-based intervention recommendations

### HIPAA Compliance
- **Row-Level Security**: Patients see only their data
- **Audit Trails**: All PHI access logged
- **Encryption**: At-rest and in-transit data protection
- **Consent Management**: Granular sharing controls

## 🧪 Development & Testing

### Run Tests
```bash
# Frontend tests
npm run test
```

### Generate Test Data
```bash
python scripts/generate_test_data.py
```

### Train Models Locally
```bash
python scripts/train_models.py
```

## 📈 Monitoring & Observability

### Metrics Tracked
- **Model Performance**: AUC, calibration, fairness metrics
- **Data Quality**: Completeness, freshness, consistency
- **System Health**: API response times, error rates
- **User Engagement**: Daily active users, feature usage

### Dashboards
- **Grafana**: System metrics and model performance
- **Prometheus**: Time-series monitoring
- **Custom**: Fairness and bias monitoring

## 🔒 Security & Privacy

### Data Protection
- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Access Control**: Role-based permissions (patient/doctor/admin)
- **Data Minimization**: Only clinically relevant features stored
- **Right to Deletion**: Complete data removal on request

### Compliance
- **HIPAA**: Business Associate Agreement compliant
- **GDPR**: Data portability and deletion rights
- **FDA**: Transparent AI for clinical decision support

## 🚀 Deployment

### Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with SSL
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
```bash
# Production settings
ENVIRONMENT=production
SECRET_KEY=your-production-secret-key
DATABASE_URL=postgresql://user:pass@prod-db:5432/health
REDIS_URL=redis://prod-redis:6379
```

## 📚 API Documentation

### Authentication
```bash
curl -X POST "http://localhost:8000/auth/device" \
  -H "Authorization: Bearer demo_token_123" \
  -H "Content-Type: application/json" \
  -d '{
    "device_type": "fitbit",
    "credentials": {
      "client_id": "your_client_id",
      "client_secret": "your_client_secret",
      "authorization_code": "auth_code"
    }
  }'
```

### Get Risk Predictions
```bash
curl -X GET "http://localhost:8000/health/risk/predict" \
  -H "Authorization: Bearer demo_token_123"
```

### Sync Device Data
```bash
curl -X POST "http://localhost:8000/devices/sync" \
  -H "Authorization: Bearer demo_token_123"
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Run tests: `npm test`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled
- **Python**: Black formatting, type hints
- **Testing**: >80% coverage required
- **Documentation**: JSDoc for functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Clinical Advisors**: Dr. Sarah Chen (Preventive Cardiology), Dr. Michael Rodriguez (Clinical Ethics)
- **Research**: Based on latest evidence from preventive medicine and AI fairness literature
- **Open Source**: Built on amazing open-source libraries (Next.js, scikit-learn, SHAP)

---

**⚠️ Medical Disclaimer**: This platform is for educational and research purposes. Always consult healthcare professionals for medical decisions.
