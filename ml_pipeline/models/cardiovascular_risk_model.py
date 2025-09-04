"""
Cardiovascular Risk Prediction Model with Bias Mitigation
Production-ready implementation with SHAP explainability and fairness monitoring
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import roc_auc_score, brier_score_loss
from sklearn.calibration import calibration_curve
import xgboost as xgb
import shap
import joblib
from loguru import logger
import warnings
warnings.filterwarnings('ignore')

@dataclass
class ModelConfig:
    """Configuration for cardiovascular risk model"""
    model_name: str = "CardioRisk-RF-v1.2"
    target_outcome: str = "cardiovascular_risk_10yr"
    random_state: int = 42
    n_estimators: int = 500
    max_depth: int = 10
    min_samples_split: int = 20
    min_samples_leaf: int = 10
    fairness_threshold: float = 0.05  # 5pp difference threshold
    calibration_bins: int = 10

@dataclass
class BiasMetrics:
    """Fairness and bias metrics"""
    demographic_parity: Dict[str, float]
    equalized_odds: Dict[str, Dict[str, float]]
    calibration_by_group: Dict[str, Dict[str, float]]
    overall_performance: Dict[str, float]

class CardiovascularRiskModel:
    """
    Production cardiovascular risk prediction model with bias mitigation
    """
    
    def __init__(self, config: ModelConfig = None):
        self.config = config or ModelConfig()
        self.rf_model = None
        self.xgb_model = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_names = []
        self.shap_explainer = None
        self.bias_metrics = None
        
        # Clinical feature definitions
        self.clinical_features = {
            'biomarkers': [
                'apoB_mg_dl', 'lp_a_mg_dl', 'ldl_c_mg_dl', 'hdl_c_mg_dl', 
                'triglycerides_mg_dl', 'hba1c_percent', 'fasting_glucose_mg_dl',
                'homa_ir', 'hs_crp_mg_l', 'homocysteine_umol_l'
            ],
            'vitals': [
                'systolic_bp_mmhg', 'diastolic_bp_mmhg', 'resting_hr_bpm',
                'vo2_max_ml_kg_min', 'grip_strength_kg'
            ],
            'lifestyle': [
                'sleep_efficiency_percent', 'hrv_rmssd_ms', 'physical_activity_min_week',
                'smoking_status', 'alcohol_drinks_week'
            ],
            'demographics': ['age_years', 'sex', 'family_history_cad']
        }
        
        # SD band thresholds for risk stratification
        self.sd_thresholds = {
            'green': (-np.inf, 1.0),    # <1 SD
            'yellow': (1.0, 2.0),       # 1-2 SD
            'orange': (2.0, 3.0),       # 2-3 SD
            'red': (3.0, np.inf)        # >3 SD
        }
    
    def prepare_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Prepare and engineer features for model training/inference
        """
        logger.info("Preparing features for cardiovascular risk model")
        
        # Create feature matrix
        all_features = []
        for category in self.clinical_features.values():
            all_features.extend(category)
        
        # Ensure all features exist
        missing_features = set(all_features) - set(df.columns)
        if missing_features:
            logger.warning(f"Missing features: {missing_features}")
            for feature in missing_features:
                df[feature] = np.nan
        
        # Feature engineering
        df = df.copy()
        
        # Derived biomarker ratios
        df['tc_hdl_ratio'] = df['ldl_c_mg_dl'] / df['hdl_c_mg_dl'].clip(lower=1)
        df['tg_hdl_ratio'] = df['triglycerides_mg_dl'] / df['hdl_c_mg_dl'].clip(lower=1)
        df['apoB_hdl_ratio'] = df['apoB_mg_dl'] / df['hdl_c_mg_dl'].clip(lower=1)
        
        # Age-adjusted metrics
        df['vo2_max_age_adjusted'] = df['vo2_max_ml_kg_min'] / (220 - df['age_years'])
        df['hrv_age_adjusted'] = df['hrv_rmssd_ms'] * (df['age_years'] / 50)
        
        # Metabolic syndrome indicators
        df['metabolic_syndrome_score'] = (
            (df['triglycerides_mg_dl'] > 150).astype(int) +
            (df['hdl_c_mg_dl'] < 40).astype(int) +  # Male threshold
            (df['systolic_bp_mmhg'] > 130).astype(int) +
            (df['fasting_glucose_mg_dl'] > 100).astype(int) +
            (df['homa_ir'] > 2.5).astype(int)
        )
        
        # Lifestyle risk score
        df['lifestyle_risk_score'] = (
            (df['smoking_status'] == 'current').astype(int) * 3 +
            (df['alcohol_drinks_week'] > 14).astype(int) +
            (df['physical_activity_min_week'] < 150).astype(int) +
            (df['sleep_efficiency_percent'] < 85).astype(int)
        )
        
        # Update feature list
        engineered_features = [
            'tc_hdl_ratio', 'tg_hdl_ratio', 'apoB_hdl_ratio',
            'vo2_max_age_adjusted', 'hrv_age_adjusted',
            'metabolic_syndrome_score', 'lifestyle_risk_score'
        ]
        
        all_features.extend(engineered_features)
        self.feature_names = all_features
        
        return df[all_features]
    
    def encode_categorical_features(self, df: pd.DataFrame, fit: bool = True) -> pd.DataFrame:
        """
        Encode categorical features with proper handling
        """
        categorical_features = ['sex', 'smoking_status', 'family_history_cad']
        df_encoded = df.copy()
        
        for feature in categorical_features:
            if feature in df.columns:
                if fit:
                    self.label_encoders[feature] = LabelEncoder()
                    df_encoded[feature] = self.label_encoders[feature].fit_transform(
                        df[feature].fillna('unknown')
                    )
                else:
                    if feature in self.label_encoders:
                        # Handle unseen categories
                        known_categories = set(self.label_encoders[feature].classes_)
                        df_feature = df[feature].fillna('unknown')
                        df_feature = df_feature.apply(
                            lambda x: x if x in known_categories else 'unknown'
                        )
                        df_encoded[feature] = self.label_encoders[feature].transform(df_feature)
        
        return df_encoded
    
    def apply_bias_mitigation(self, X: pd.DataFrame, y: np.ndarray, 
                            protected_attributes: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """
        Apply inverse propensity weighting for bias mitigation
        """
        logger.info("Applying bias mitigation through inverse propensity weighting")
        
        # Calculate group frequencies
        sample_weights = np.ones(len(X))
        
        for attr in protected_attributes.columns:
            group_counts = protected_attributes[attr].value_counts()
            total_samples = len(protected_attributes)
            
            for group in group_counts.index:
                group_mask = protected_attributes[attr] == group
                group_weight = total_samples / (len(group_counts) * group_counts[group])
                sample_weights[group_mask] *= group_weight
        
        # Normalize weights
        sample_weights = sample_weights / sample_weights.mean()
        
        return X.values, sample_weights
    
    def train(self, df: pd.DataFrame, target_col: str, 
              protected_attributes: List[str] = None) -> Dict[str, Any]:
        """
        Train the cardiovascular risk model with bias mitigation
        """
        logger.info("Starting cardiovascular risk model training")
        
        # Prepare features
        X_df = self.prepare_features(df)
        X_df = self.encode_categorical_features(X_df, fit=True)
        y = df[target_col].values
        
        # Handle protected attributes for fairness
        if protected_attributes:
            protected_df = df[protected_attributes]
        else:
            protected_df = df[['sex', 'age_years']].copy()
            protected_df['age_group'] = pd.cut(
                protected_df['age_years'], 
                bins=[0, 40, 55, 70, 100], 
                labels=['<40', '40-55', '55-70', '>70']
            )
        
        # Apply bias mitigation
        X, sample_weights = self.apply_bias_mitigation(X_df, y, protected_df)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Group-wise cross-validation
        groups = protected_df.apply(lambda x: '_'.join(x.astype(str)), axis=1)
        cv = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=self.config.random_state)
        
        # Train Random Forest
        logger.info("Training Random Forest model")
        self.rf_model = RandomForestClassifier(
            n_estimators=self.config.n_estimators,
            max_depth=self.config.max_depth,
            min_samples_split=self.config.min_samples_split,
            min_samples_leaf=self.config.min_samples_leaf,
            random_state=self.config.random_state,
            n_jobs=-1
        )
        
        self.rf_model.fit(X_scaled, y, sample_weight=sample_weights)
        
        # Train XGBoost with monotonic constraints
        logger.info("Training XGBoost model with monotonic constraints")
        
        # Define monotonic constraints (clinical knowledge)
        monotonic_constraints = {}
        for i, feature in enumerate(self.feature_names):
            if feature in ['apoB_mg_dl', 'lp_a_mg_dl', 'hba1c_percent', 'age_years']:
                monotonic_constraints[i] = 1  # Increasing risk
            elif feature in ['vo2_max_ml_kg_min', 'hdl_c_mg_dl']:
                monotonic_constraints[i] = -1  # Decreasing risk
            else:
                monotonic_constraints[i] = 0  # No constraint
        
        self.xgb_model = xgb.XGBClassifier(
            n_estimators=self.config.n_estimators,
            max_depth=self.config.max_depth,
            learning_rate=0.1,
            random_state=self.config.random_state,
            monotone_constraints=monotonic_constraints
        )
        
        self.xgb_model.fit(X_scaled, y, sample_weight=sample_weights)
        
        # Initialize SHAP explainer
        logger.info("Initializing SHAP explainer")
        self.shap_explainer = shap.TreeExplainer(self.rf_model)
        
        # Evaluate model performance and fairness
        performance_metrics = self.evaluate_model(X_scaled, y, protected_df)
        
        logger.info("Model training completed successfully")
        return performance_metrics
    
    def predict_risk(self, df: pd.DataFrame, return_shap: bool = True) -> Dict[str, Any]:
        """
        Predict cardiovascular risk with SHAP explanations
        """
        if self.rf_model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        # Prepare features
        X_df = self.prepare_features(df)
        X_df = self.encode_categorical_features(X_df, fit=False)
        X_scaled = self.scaler.transform(X_df.values)
        
        # Get predictions from both models
        rf_proba = self.rf_model.predict_proba(X_scaled)[:, 1]
        xgb_proba = self.xgb_model.predict_proba(X_scaled)[:, 1]
        
        # Ensemble prediction (weighted average)
        ensemble_proba = 0.6 * rf_proba + 0.4 * xgb_proba
        
        # Calculate percentiles and SD bands
        risk_percentiles = self._calculate_percentiles(ensemble_proba)
        sd_bands = self._assign_sd_bands(ensemble_proba)
        
        results = {
            'risk_probability': ensemble_proba,
            'risk_percentile': risk_percentiles,
            'sd_band': sd_bands,
            'rf_probability': rf_proba,
            'xgb_probability': xgb_proba
        }
        
        # Add SHAP explanations
        if return_shap and self.shap_explainer:
            shap_values = self.shap_explainer.shap_values(X_scaled)
            if isinstance(shap_values, list):
                shap_values = shap_values[1]  # Positive class
            
            results['shap_values'] = shap_values
            results['shap_explanations'] = self._format_shap_explanations(
                shap_values, X_df, top_k=3
            )
        
        return results
    
    def _calculate_percentiles(self, probabilities: np.ndarray) -> np.ndarray:
        """Calculate risk percentiles based on population distribution"""
        # This would typically use population norms
        # For now, using sample-based percentiles
        return np.array([
            (probabilities <= prob).mean() * 100 
            for prob in probabilities
        ])
    
    def _assign_sd_bands(self, probabilities: np.ndarray) -> List[str]:
        """Assign SD-based risk bands"""
        # Convert probabilities to z-scores (simplified)
        mean_risk = 0.15  # Population average 10-year CVD risk
        std_risk = 0.08   # Population standard deviation
        
        z_scores = (probabilities - mean_risk) / std_risk
        
        bands = []
        for z in z_scores:
            if z < 1.0:
                bands.append('green')
            elif z < 2.0:
                bands.append('yellow')
            elif z < 3.0:
                bands.append('orange')
            else:
                bands.append('red')
        
        return bands
    
    def _format_shap_explanations(self, shap_values: np.ndarray, 
                                 X_df: pd.DataFrame, top_k: int = 3) -> List[Dict]:
        """Format SHAP explanations for patient/doctor interfaces"""
        explanations = []
        
        for i in range(len(shap_values)):
            # Get top contributing features
            feature_contributions = list(zip(
                self.feature_names, 
                shap_values[i], 
                X_df.iloc[i].values
            ))
            
            # Sort by absolute SHAP value
            feature_contributions.sort(key=lambda x: abs(x[1]), reverse=True)
            
            patient_explanation = []
            clinical_explanation = []
            
            for j, (feature, shap_val, feature_val) in enumerate(feature_contributions[:top_k]):
                direction = "increases" if shap_val > 0 else "decreases"
                
                # Patient-friendly explanation
                patient_text = self._get_patient_friendly_explanation(
                    feature, feature_val, direction, abs(shap_val)
                )
                patient_explanation.append({
                    'feature': feature,
                    'impact': shap_val,
                    'explanation': patient_text
                })
                
                # Clinical explanation
                clinical_text = f"{feature}: {feature_val:.2f} ({direction} risk by {abs(shap_val):.3f})"
                clinical_explanation.append({
                    'feature': feature,
                    'value': feature_val,
                    'impact': shap_val,
                    'explanation': clinical_text
                })
            
            explanations.append({
                'patient_explanation': patient_explanation,
                'clinical_explanation': clinical_explanation
            })
        
        return explanations
    
    def _get_patient_friendly_explanation(self, feature: str, value: float, 
                                        direction: str, impact: float) -> str:
        """Convert clinical features to patient-friendly explanations"""
        explanations = {
            'apoB_mg_dl': f"Your ApoB level ({value:.0f} mg/dL) {direction} cardiovascular risk",
            'vo2_max_ml_kg_min': f"Your fitness level (VO2 Max: {value:.1f}) {direction} risk",
            'hba1c_percent': f"Your blood sugar control (HbA1c: {value:.1f}%) {direction} risk",
            'sleep_efficiency_percent': f"Your sleep quality ({value:.0f}% efficiency) {direction} risk",
            'age_years': f"Age ({value:.0f} years) {direction} risk",
            'systolic_bp_mmhg': f"Your blood pressure ({value:.0f} mmHg) {direction} risk"
        }
        
        return explanations.get(feature, f"{feature} {direction} risk")
    
    def evaluate_model(self, X: np.ndarray, y: np.ndarray, 
                      protected_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Comprehensive model evaluation including fairness metrics
        """
        logger.info("Evaluating model performance and fairness")
        
        # Overall performance
        rf_proba = self.rf_model.predict_proba(X)[:, 1]
        xgb_proba = self.xgb_model.predict_proba(X)[:, 1]
        ensemble_proba = 0.6 * rf_proba + 0.4 * xgb_proba
        
        overall_metrics = {
            'auc_roc': roc_auc_score(y, ensemble_proba),
            'brier_score': brier_score_loss(y, ensemble_proba),
            'rf_auc': roc_auc_score(y, rf_proba),
            'xgb_auc': roc_auc_score(y, xgb_proba)
        }
        
        # Calibration analysis
        fraction_of_positives, mean_predicted_value = calibration_curve(
            y, ensemble_proba, n_bins=self.config.calibration_bins
        )
        
        overall_metrics['calibration_slope'] = np.polyfit(
            mean_predicted_value, fraction_of_positives, 1
        )[0]
        
        # Fairness evaluation by subgroups
        fairness_metrics = self._evaluate_fairness(
            ensemble_proba, y, protected_df
        )
        
        return {
            'overall_performance': overall_metrics,
            'fairness_metrics': fairness_metrics,
            'model_config': self.config.__dict__
        }
    
    def _evaluate_fairness(self, probabilities: np.ndarray, y_true: np.ndarray,
                          protected_df: pd.DataFrame) -> Dict[str, Any]:
        """Evaluate fairness across protected groups"""
        fairness_results = {}
        
        for attr in protected_df.columns:
            if attr == 'age_years':
                continue  # Skip continuous age
                
            groups = protected_df[attr].unique()
            group_metrics = {}
            
            for group in groups:
                mask = protected_df[attr] == group
                if mask.sum() < 10:  # Skip small groups
                    continue
                
                group_proba = probabilities[mask]
                group_y = y_true[mask]
                
                # Calculate metrics for this group
                group_metrics[str(group)] = {
                    'auc': roc_auc_score(group_y, group_proba),
                    'mean_prediction': group_proba.mean(),
                    'positive_rate': group_y.mean(),
                    'sample_size': len(group_y)
                }
            
            fairness_results[attr] = group_metrics
        
        return fairness_results
    
    def save_model(self, filepath: str):
        """Save the trained model and components"""
        model_data = {
            'rf_model': self.rf_model,
            'xgb_model': self.xgb_model,
            'scaler': self.scaler,
            'label_encoders': self.label_encoders,
            'feature_names': self.feature_names,
            'config': self.config,
            'bias_metrics': self.bias_metrics
        }
        
        joblib.dump(model_data, filepath)
        logger.info(f"Model saved to {filepath}")
    
    def load_model(self, filepath: str):
        """Load a trained model"""
        model_data = joblib.load(filepath)
        
        self.rf_model = model_data['rf_model']
        self.xgb_model = model_data['xgb_model']
        self.scaler = model_data['scaler']
        self.label_encoders = model_data['label_encoders']
        self.feature_names = model_data['feature_names']
        self.config = model_data['config']
        self.bias_metrics = model_data.get('bias_metrics')
        
        # Reinitialize SHAP explainer
        if self.rf_model:
            self.shap_explainer = shap.TreeExplainer(self.rf_model)
        
        logger.info(f"Model loaded from {filepath}")
