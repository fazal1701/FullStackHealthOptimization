# Data Architecture: HIPAA-Compliant Health Platform

## Database Schema (Supabase/PostgreSQL)

### Core User Management

```sql
-- Users table with role-based access
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('patient', 'doctor', 'admin')) NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patient-specific data
CREATE TABLE patients (
  id UUID PRIMARY KEY REFERENCES users(id),
  date_of_birth DATE NOT NULL,
  sex TEXT CHECK (sex IN ('male', 'female', 'other')) NOT NULL,
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  doctor_id UUID REFERENCES users(id),
  consent_biomarkers BOOLEAN DEFAULT FALSE,
  consent_wearables BOOLEAN DEFAULT FALSE,
  consent_programs BOOLEAN DEFAULT FALSE,
  consent_images BOOLEAN DEFAULT FALSE
);

-- Doctor-specific data
CREATE TABLE doctors (
  id UUID PRIMARY KEY REFERENCES users(id),
  specialty TEXT NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  institution TEXT
);
```

### Biomarker & Lab Data

```sql
-- Core biomarker measurements
CREATE TABLE biomarkers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  biomarker_type TEXT NOT NULL, -- 'apoB', 'hba1c', 'hs_crp', etc.
  value DECIMAL(10,4) NOT NULL,
  unit TEXT NOT NULL,
  measured_at TIMESTAMPTZ NOT NULL,
  lab_name TEXT,
  reference_min DECIMAL(10,4),
  reference_max DECIMAL(10,4),
  optimal_value DECIMAL(10,4),
  sd_score DECIMAL(6,3), -- Standard deviation from age/sex norm
  status TEXT CHECK (status IN ('optimal', 'normal', 'borderline', 'high', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lab document storage
CREATE TABLE lab_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  file_path TEXT NOT NULL, -- Supabase storage path
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE,
  extracted_biomarkers JSONB -- OCR results
);
```

### Wearable Device Integration

```sql
-- Device connections
CREATE TABLE device_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  vendor TEXT NOT NULL, -- 'apple', 'fitbit', 'oura', 'whoop', 'garmin'
  vendor_user_id TEXT,
  access_token TEXT, -- Encrypted
  refresh_token TEXT, -- Encrypted
  permissions JSONB, -- {'steps': true, 'hrv': true, 'sleep': true}
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync TIMESTAMPTZ,
  status TEXT CHECK (status IN ('active', 'expired', 'revoked')) DEFAULT 'active'
);

-- Time-series wearable data
CREATE TABLE wearable_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  device_id UUID REFERENCES device_connections(id) NOT NULL,
  metric_type TEXT NOT NULL, -- 'steps', 'hrv_rmssd', 'sleep_duration', 'vo2max'
  value DECIMAL(10,4) NOT NULL,
  unit TEXT NOT NULL,
  measured_at TIMESTAMPTZ NOT NULL,
  quality_score DECIMAL(3,2), -- 0-1 data quality indicator
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aggregated daily summaries for performance
CREATE TABLE daily_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  date DATE NOT NULL,
  steps INTEGER,
  hrv_rmssd DECIMAL(6,2),
  sleep_duration_hours DECIMAL(4,2),
  sleep_efficiency DECIMAL(5,2),
  resting_hr INTEGER,
  data_completeness DECIMAL(3,2), -- 0-1 score
  UNIQUE(user_id, date)
);
```

### ML Model & Risk Predictions

```sql
-- Model versions and metadata
CREATE TABLE ml_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  model_type TEXT NOT NULL, -- 'random_forest', 'gradient_boost'
  target_outcome TEXT NOT NULL, -- 'cardiovascular_risk', 'metabolic_risk'
  training_data_window DATERANGE,
  performance_metrics JSONB, -- AUC, calibration, fairness metrics
  feature_importance JSONB,
  deployed_at TIMESTAMPTZ,
  retired_at TIMESTAMPTZ,
  UNIQUE(name, version)
);

-- Risk predictions with explainability
CREATE TABLE risk_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  model_id UUID REFERENCES ml_models(id) NOT NULL,
  risk_category TEXT NOT NULL, -- 'cardiovascular', 'metabolic', 'neurocognitive'
  risk_score DECIMAL(5,4) NOT NULL, -- 0-1 probability
  risk_percentile INTEGER, -- 0-100
  confidence_interval DECIMAL(5,4)[], -- [lower, upper] bounds
  uncertainty_level TEXT CHECK (uncertainty_level IN ('low', 'medium', 'high')),
  shap_values JSONB, -- Top contributing factors
  data_completeness DECIMAL(3,2),
  predicted_at TIMESTAMPTZ DEFAULT NOW()
);

-- SHAP explanations for interpretability
CREATE TABLE shap_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID REFERENCES risk_predictions(id) NOT NULL,
  feature_name TEXT NOT NULL,
  feature_value TEXT NOT NULL,
  shap_value DECIMAL(8,6) NOT NULL, -- Contribution to prediction
  feature_importance_rank INTEGER,
  patient_explanation TEXT, -- Plain English for patients
  clinical_explanation TEXT -- Technical for doctors
);
```

### Programs & Interventions

```sql
-- Health optimization programs
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'exercise', 'nutrition', 'sleep', 'stress'
  description TEXT,
  target_biomarkers TEXT[], -- Which biomarkers this program affects
  evidence_level TEXT CHECK (evidence_level IN ('high', 'moderate', 'low')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User program enrollments
CREATE TABLE user_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  program_id UUID REFERENCES programs(id) NOT NULL,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  target_completion DATE,
  status TEXT CHECK (status IN ('active', 'paused', 'completed', 'dropped')) DEFAULT 'active',
  progress_percentage DECIMAL(5,2) DEFAULT 0
);

-- Daily program activities/wins
CREATE TABLE daily_wins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  program_id UUID REFERENCES programs(id),
  win_type TEXT NOT NULL, -- 'steps', 'zone2_minutes', 'sleep_hours'
  target_value DECIMAL(8,2),
  actual_value DECIMAL(8,2),
  completed BOOLEAN DEFAULT FALSE,
  date DATE NOT NULL,
  streak_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Clinical Knowledge Base

```sql
-- Research studies database
CREATE TABLE research_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT[],
  journal TEXT,
  publication_date DATE,
  pmid TEXT, -- PubMed ID
  study_type TEXT, -- 'rct', 'cohort', 'meta_analysis'
  population_size INTEGER,
  intervention TEXT,
  outcome_measure TEXT,
  effect_size DECIMAL(6,4),
  confidence_interval DECIMAL(6,4)[],
  nnt INTEGER, -- Number needed to treat
  nnh INTEGER, -- Number needed to harm
  limitations TEXT[],
  clinical_significance TEXT,
  patient_implication TEXT,
  topic_tags TEXT[], -- 'exercise', 'nutrition', 'sleep', etc.
  evidence_quality TEXT CHECK (evidence_quality IN ('high', 'moderate', 'low', 'very_low'))
);

-- Medication/supplement database
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  drug_class TEXT NOT NULL,
  mechanism_of_action TEXT,
  indication TEXT[],
  typical_dosage TEXT,
  expected_biomarker_changes JSONB, -- {'ldl_c': {'change_percent': -30, 'time_weeks': 6}}
  monitoring_requirements TEXT[],
  contraindications TEXT[],
  side_effects TEXT[],
  lifestyle_synergies TEXT[],
  patient_friendly_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security (RLS) Policies

```sql
-- Patients can only see their own data
CREATE POLICY patient_own_data ON biomarkers
  FOR ALL USING (
    auth.uid() = user_id AND 
    EXISTS (SELECT 1 FROM patients WHERE id = auth.uid())
  );

-- Doctors can see their assigned patients' data
CREATE POLICY doctor_patient_access ON biomarkers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM patients p 
      WHERE p.id = biomarkers.user_id 
      AND p.doctor_id = auth.uid()
      AND p.consent_biomarkers = TRUE
    )
  );

-- Admins can see aggregated, de-identified data only
CREATE POLICY admin_aggregate_access ON biomarkers
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' AND
    -- Only allow aggregate queries, not individual records
    FALSE -- Implement specific aggregate-only access
  );
```

## Data Import/Export Pipeline

### CSV Import Process
1. **Upload**: User uploads CSV to Supabase storage
2. **Preview**: Parse headers, detect columns, show sample data
3. **Mapping**: User maps CSV columns to biomarker types
4. **Validation**: Check units, ranges, date formats
5. **Dry Run**: Show what would be imported/rejected
6. **Import**: Create import_job record, process in background
7. **Audit**: Log all changes with rollback capability

### Device Integration Flow
1. **OAuth**: Redirect to vendor (Apple, Fitbit, etc.)
2. **Token Storage**: Encrypt and store access/refresh tokens
3. **Sync Schedule**: Hourly background jobs per vendor
4. **Data Processing**: Normalize units, detect outliers
5. **Quality Scoring**: Assess completeness, consistency
6. **Storage**: Insert into wearable_metrics with quality flags

## Monitoring & Audit

### Data Quality Monitoring
- **Completeness**: % of expected data points received
- **Freshness**: Time since last device sync
- **Consistency**: Cross-device validation where possible
- **Outlier Detection**: Statistical anomaly flagging

### HIPAA Audit Trail
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL, -- 'view', 'create', 'update', 'delete', 'export'
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

This architecture ensures HIPAA compliance, scalability, and clinical-grade data integrity while supporting both patient engagement and physician productivity workflows.
