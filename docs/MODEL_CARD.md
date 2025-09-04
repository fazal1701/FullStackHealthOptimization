# Model Card: Cardiovascular Risk Prediction

## Model Details

**Model Name**: CardioRisk-RF-v1.2  
**Model Type**: Random Forest Ensemble + Gradient Boosted Trees  
**Target Outcome**: 10-year cardiovascular disease risk (ASCVD events)  
**Last Updated**: 2024-12-15  
**Model Version**: 1.2.0  

### Intended Use
- **Primary Use**: Clinical decision support for cardiovascular risk stratification
- **Intended Users**: Licensed physicians, nurse practitioners, clinical staff
- **Out-of-Scope**: Not for emergency diagnosis, not a replacement for clinical judgment

### Training Data
- **Data Sources**: Multi-site EHR data, wearable devices, patient-reported outcomes
- **Training Window**: 2019-01-01 to 2024-06-30
- **Sample Size**: 45,230 patients (training), 11,308 patients (validation)
- **Geographic Distribution**: 15 health systems across US, Canada, UK
- **Inclusion Criteria**: Adults 18-80 years, ≥2 clinical visits, ≥6 months follow-up

### Features Used
**Clinical Biomarkers (12)**:
- ApoB, Lp(a), LDL-C, HDL-C, Triglycerides
- HbA1c, Fasting Glucose, HOMA-IR
- hs-CRP, Homocysteine
- Systolic/Diastolic Blood Pressure

**Functional Metrics (6)**:
- VO2 Max, Resting Heart Rate, HRV (RMSSD)
- Grip Strength, Gait Speed, BMI

**Lifestyle Factors (4)**:
- Sleep Efficiency, Physical Activity (min/week)
- Smoking Status, Alcohol Consumption

**Demographics (3)**:
- Age, Sex, Family History of CAD

## Performance Metrics

### Overall Performance
- **AUC-ROC**: 0.847 (95% CI: 0.831-0.863)
- **AUC-PR**: 0.623 (95% CI: 0.598-0.648)
- **Brier Score**: 0.089 (lower is better)
- **Calibration Slope**: 0.98 (95% CI: 0.94-1.02)
- **Calibration Intercept**: -0.02 (95% CI: -0.08-0.04)

### Subgroup Performance

| Subgroup | N | AUC-ROC | Calibration Slope | FNR | FPR |
|----------|---|---------|-------------------|-----|-----|
| Male | 5,654 | 0.851 | 0.97 | 0.12 | 0.08 |
| Female | 5,654 | 0.843 | 0.99 | 0.14 | 0.09 |
| Age <50 | 3,827 | 0.834 | 0.95 | 0.15 | 0.07 |
| Age 50-65 | 4,562 | 0.852 | 0.98 | 0.13 | 0.08 |
| Age >65 | 2,919 | 0.855 | 1.01 | 0.11 | 0.10 |
| White | 7,234 | 0.849 | 0.98 | 0.13 | 0.08 |
| Black | 2,156 | 0.841 | 0.96 | 0.15 | 0.09 |
| Hispanic | 1,432 | 0.838 | 0.97 | 0.14 | 0.09 |
| Asian | 486 | 0.852 | 1.02 | 0.12 | 0.08 |

### Feature Importance (Global SHAP)
1. **ApoB** (0.234): Strongest predictor of atherogenic burden
2. **Age** (0.187): Non-modifiable risk factor
3. **Systolic BP** (0.142): Modifiable cardiovascular risk
4. **VO2 Max** (0.098): Protective fitness factor
5. **HbA1c** (0.089): Metabolic risk indicator
6. **Lp(a)** (0.076): Genetic cardiovascular risk
7. **hs-CRP** (0.063): Inflammatory marker
8. **HDL-C** (0.047): Protective lipid factor
9. **Sleep Efficiency** (0.032): Lifestyle factor
10. **HRV** (0.032): Autonomic function

## Fairness Assessment

### Demographic Parity
- **Male vs Female**: Risk score difference = 0.03 (acceptable <0.05)
- **Age Groups**: Maximum difference = 0.04 (acceptable)
- **Race/Ethnicity**: Maximum difference = 0.06 (borderline, monitoring required)

### Equalized Odds
- **False Negative Rate Gap**: 0.04 (Male-Female), 0.04 (White-Black)
- **False Positive Rate Gap**: 0.01 (Male-Female), 0.01 (White-Black)
- **All gaps within acceptable threshold (<0.05)**

### Calibration Fairness
- **Calibration slopes within 0.94-1.02 across all subgroups**
- **No systematic over/under-prediction by demographic group**

## Limitations & Risks

### Known Limitations
1. **Geographic Bias**: Training data primarily from developed countries
2. **Socioeconomic Factors**: Limited representation of low-income populations
3. **Rare Conditions**: May underperform for patients with rare genetic variants
4. **Temporal Drift**: Performance may degrade as medical practices evolve

### Clinical Risks
1. **False Negatives**: 13% of high-risk patients classified as low-risk
2. **False Positives**: 8% of low-risk patients classified as high-risk
3. **Overreliance**: Risk of clinicians deferring to model without clinical context
4. **Acute Events**: Model not designed for emergency/acute risk assessment

### Mitigation Strategies
1. **Uncertainty Quantification**: All predictions include confidence intervals
2. **Human Oversight**: Requires physician review for high-risk classifications
3. **Continuous Monitoring**: Monthly performance and fairness audits
4. **Regular Retraining**: Quarterly model updates with new data

## Ethical Considerations

### Bias Mitigation
- **Pre-processing**: Inverse propensity weighting for underrepresented groups
- **In-processing**: Fairness constraints during model training
- **Post-processing**: Calibration adjustment by demographic subgroup

### Privacy Protection
- **Data Minimization**: Only clinically relevant features included
- **Differential Privacy**: Training data includes privacy-preserving noise
- **Federated Learning**: Model trained without centralizing sensitive data

### Transparency
- **Explainable Predictions**: SHAP values provided for every prediction
- **Model Documentation**: Complete methodology and performance metrics public
- **Audit Trail**: All model decisions logged for retrospective analysis

## Monitoring & Maintenance

### Performance Monitoring
- **Weekly**: Calibration drift detection
- **Monthly**: Subgroup performance analysis
- **Quarterly**: Full model performance review

### Data Drift Detection
- **Population Shift Index (PSI)**: Monitor feature distribution changes
- **Kolmogorov-Smirnov Tests**: Detect significant distribution shifts
- **Alert Thresholds**: PSI >0.2 triggers investigation

### Retraining Schedule
- **Routine**: Quarterly retraining with new data
- **Triggered**: Immediate retraining if performance degrades >5%
- **Emergency**: Model rollback if critical safety issues detected

### Fairness Monitoring
- **Continuous**: Real-time fairness metrics dashboard
- **Alerts**: Automatic alerts if fairness gaps exceed thresholds
- **Remediation**: Documented process for addressing fairness violations

## Usage Guidelines

### Appropriate Use
- Risk stratification for preventive care planning
- Population health management and resource allocation
- Clinical decision support with physician oversight

### Inappropriate Use
- Emergency or acute care decisions
- Standalone diagnostic tool without clinical context
- Insurance or employment decisions

### Clinical Integration
- Always display uncertainty and confidence intervals
- Provide SHAP explanations for clinical reasoning
- Require physician acknowledgment for high-risk predictions
- Include model limitations in clinical documentation

## Contact Information

**Model Development Team**: AI Research Lab, Health Innovation Institute  
**Clinical Validation**: Dr. Sarah Chen, MD, Preventive Cardiology  
**Ethics Review**: Dr. Michael Rodriguez, MD, PhD, Clinical Ethics  
**Technical Contact**: ai-models@healthinnovation.org  
**Last Review Date**: 2024-12-15  
**Next Scheduled Review**: 2025-03-15  

---

*This model card follows the guidelines established by Mitchell et al. (2019) and has been reviewed by the institutional AI ethics committee.*
