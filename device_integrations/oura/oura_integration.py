"""
Oura Ring API Integration for Advanced Sleep and Recovery Metrics
Comprehensive implementation with OAuth 2.0 and detailed biometric tracking
"""

import asyncio
import aiohttp
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import json
from loguru import logger

from ..common.base_device import (
    BaseDeviceIntegration, HealthMetric, DeviceConnection, SyncResult
)

class OuraIntegration(BaseDeviceIntegration):
    """
    Oura Ring API integration with comprehensive sleep, activity, and readiness data
    """
    
    def __init__(self):
        super().__init__("oura")
        
        # Oura API configuration
        self.base_url = "https://api.ouraring.com"
        self.auth_url = "https://cloud.ouraring.com/oauth/authorize"
        self.token_url = "https://api.ouraring.com/oauth/token"
        
        # Metric mappings from Oura to standardized names
        self.metric_mappings = {
            'sleep': 'sleep_duration',
            'efficiency': 'sleep_efficiency',
            'rem_sleep_duration': 'rem_sleep_duration',
            'deep_sleep_duration': 'deep_sleep_duration',
            'light_sleep_duration': 'light_sleep_duration',
            'rmssd': 'hrv_rmssd',
            'hr_average': 'heart_rate_avg',
            'hr_lowest': 'resting_heart_rate',
            'steps': 'steps',
            'cal_total': 'calories_burned',
            'score': 'readiness_score',
            'body_temperature': 'body_temperature'
        }
        
        # Oura-specific quality indicators
        self.oura_quality_factors = {
            'sleep_score_delta': 0.2,    # Sleep score reliability
            'movement_30_sec': 0.15,     # Movement during sleep
            'hr_confidence': 0.25,       # Heart rate measurement confidence
            'temperature_delta': 0.1     # Temperature measurement reliability
        }
        
        # Rate limiting (Oura allows 5000 requests per day)
        self.rate_limit_delay = 17.28  # seconds (5000 requests / 86400 seconds)
    
    async def authenticate(self, credentials: Dict[str, str]) -> DeviceConnection:
        """
        Authenticate with Oura OAuth 2.0
        """
        client_id = credentials.get('client_id')
        client_secret = credentials.get('client_secret')
        redirect_uri = credentials.get('redirect_uri')
        authorization_code = credentials.get('authorization_code')
        user_id = credentials.get('user_id')
        
        if not all([client_id, client_secret, redirect_uri, authorization_code, user_id]):
            raise ValueError("Missing required Oura credentials")
        
        # Exchange authorization code for access token
        token_data = {
            'grant_type': 'authorization_code',
            'code': authorization_code,
            'redirect_uri': redirect_uri,
            'client_id': client_id,
            'client_secret': client_secret
        }
        
        async with self.session.post(self.token_url, data=token_data) as response:
            if response.status != 200:
                error_text = await response.text()
                raise Exception(f"Oura authentication failed: {error_text}")
            
            token_response = await response.json()
        
        # Oura tokens don't expire, but we'll set a long expiration
        expires_at = datetime.now() + timedelta(days=365)
        
        connection = DeviceConnection(
            user_id=user_id,
            device_type=self.device_type,
            access_token=token_response['access_token'],
            refresh_token=token_response.get('refresh_token'),
            token_expires_at=expires_at,
            permissions=['personal', 'daily'],  # Oura default permissions
            status='active'
        )
        
        logger.info(f"Oura authentication successful for user {user_id}")
        return connection
    
    async def refresh_token(self, connection: DeviceConnection) -> DeviceConnection:
        """
        Refresh Oura access token (if needed)
        """
        # Oura tokens typically don't expire, but handle refresh if needed
        if not connection.refresh_token:
            logger.warning("No refresh token available for Oura")
            return connection
        
        token_data = {
            'grant_type': 'refresh_token',
            'refresh_token': connection.refresh_token,
            'client_id': 'your_client_id',  # Would be stored in config
            'client_secret': 'your_client_secret'
        }
        
        async with self.session.post(self.token_url, data=token_data) as response:
            if response.status != 200:
                logger.error("Oura token refresh failed")
                return connection
            
            token_response = await response.json()
            connection.access_token = token_response['access_token']
            connection.token_expires_at = datetime.now() + timedelta(days=365)
        
        return connection
    
    async def get_available_metrics(self, connection: DeviceConnection) -> List[str]:
        """
        Get available metrics from Oura Ring
        """
        return [
            'sleep_duration', 'sleep_efficiency', 'rem_sleep_duration',
            'deep_sleep_duration', 'light_sleep_duration', 'hrv_rmssd',
            'heart_rate_avg', 'resting_heart_rate', 'steps', 'calories_burned',
            'readiness_score', 'sleep_score', 'activity_score', 'body_temperature'
        ]
    
    async def sync_metrics(self, connection: DeviceConnection,
                          start_date: datetime, end_date: datetime,
                          metric_types: List[str] = None) -> SyncResult:
        """
        Sync comprehensive health metrics from Oura Ring
        """
        logger.info(f"Starting Oura sync for {connection.user_id} from {start_date} to {end_date}")
        
        all_metrics = []
        errors = []
        
        try:
            # Sleep data (most comprehensive from Oura)
            sleep_metrics = await self._sync_sleep_data(connection, start_date, end_date)
            all_metrics.extend(sleep_metrics)
            
            # Activity data
            activity_metrics = await self._sync_activity_data(connection, start_date, end_date)
            all_metrics.extend(activity_metrics)
            
            # Readiness data
            readiness_metrics = await self._sync_readiness_data(connection, start_date, end_date)
            all_metrics.extend(readiness_metrics)
            
            # Heart rate variability data
            hrv_metrics = await self._sync_hrv_data(connection, start_date, end_date)
            all_metrics.extend(hrv_metrics)
            
        except Exception as e:
            logger.error(f"Error during Oura sync: {e}")
            errors.append(str(e))
        
        # Apply Oura-specific quality scoring
        for metric in all_metrics:
            metric.quality_score = self._calculate_oura_quality_score(metric)
        
        # Clean and validate metrics
        all_metrics = self.detect_outliers(all_metrics)
        validated_metrics = [
            m for m in all_metrics 
            if self.validate_metric_value(m.metric_type, m.value)
        ]
        
        # Calculate overall data quality
        quality_score = self.calculate_quality_score(validated_metrics)
        
        connection.last_sync = datetime.now()
        
        result = SyncResult(
            success=len(errors) == 0,
            metrics_synced=len(validated_metrics),
            errors=errors,
            last_sync_time=connection.last_sync,
            data_quality_score=quality_score
        )
        
        logger.info(f"Oura sync completed: {len(validated_metrics)} metrics, quality: {quality_score:.2f}")
        return result
    
    async def _sync_sleep_data(self, connection: DeviceConnection,
                              start_date: datetime, end_date: datetime) -> List[HealthMetric]:
        """Sync detailed sleep data from Oura"""
        metrics = []
        
        start_str = start_date.strftime('%Y-%m-%d')
        end_str = end_date.strftime('%Y-%m-%d')
        
        url = f"{self.base_url}/v2/usercollection/sleep"
        params = {
            'start_date': start_str,
            'end_date': end_str
        }
        
        try:
            async with await self.make_authenticated_request(
                connection, 'GET', url, params=params
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    for sleep_session in data.get('data', []):
                        bedtime_start = self.normalize_timestamp(sleep_session.get('bedtime_start'))
                        
                        # Sleep duration (total sleep time)
                        total_sleep_duration = sleep_session.get('total_sleep_duration')
                        if total_sleep_duration:
                            metrics.append(HealthMetric(
                                metric_type='sleep_duration',
                                value=total_sleep_duration / 3600,  # Convert seconds to hours
                                unit='hours',
                                timestamp=bedtime_start,
                                source_device='oura',
                                metadata={'sleep_id': sleep_session.get('id')}
                            ))
                        
                        # Sleep efficiency
                        efficiency = sleep_session.get('efficiency')
                        if efficiency:
                            metrics.append(HealthMetric(
                                metric_type='sleep_efficiency',
                                value=float(efficiency),
                                unit='percent',
                                timestamp=bedtime_start,
                                source_device='oura'
                            ))
                        
                        # Sleep stages
                        rem_duration = sleep_session.get('rem_sleep_duration')
                        if rem_duration:
                            metrics.append(HealthMetric(
                                metric_type='rem_sleep_duration',
                                value=rem_duration / 3600,
                                unit='hours',
                                timestamp=bedtime_start,
                                source_device='oura'
                            ))
                        
                        deep_duration = sleep_session.get('deep_sleep_duration')
                        if deep_duration:
                            metrics.append(HealthMetric(
                                metric_type='deep_sleep_duration',
                                value=deep_duration / 3600,
                                unit='hours',
                                timestamp=bedtime_start,
                                source_device='oura'
                            ))
                        
                        light_duration = sleep_session.get('light_sleep_duration')
                        if light_duration:
                            metrics.append(HealthMetric(
                                metric_type='light_sleep_duration',
                                value=light_duration / 3600,
                                unit='hours',
                                timestamp=bedtime_start,
                                source_device='oura'
                            ))
                        
                        # Heart rate during sleep
                        hr_lowest = sleep_session.get('lowest_heart_rate')
                        if hr_lowest:
                            metrics.append(HealthMetric(
                                metric_type='resting_heart_rate',
                                value=float(hr_lowest),
                                unit='bpm',
                                timestamp=bedtime_start,
                                source_device='oura'
                            ))
                        
                        hr_average = sleep_session.get('average_heart_rate')
                        if hr_average:
                            metrics.append(HealthMetric(
                                metric_type='heart_rate_avg_sleep',
                                value=float(hr_average),
                                unit='bpm',
                                timestamp=bedtime_start,
                                source_device='oura'
                            ))
                        
                        # Sleep score
                        sleep_score = sleep_session.get('score')
                        if sleep_score:
                            metrics.append(HealthMetric(
                                metric_type='sleep_score',
                                value=float(sleep_score),
                                unit='score',
                                timestamp=bedtime_start,
                                source_device='oura'
                            ))
                
                await asyncio.sleep(self.rate_limit_delay)
                
        except Exception as e:
            logger.error(f"Error syncing Oura sleep data: {e}")
        
        return metrics
    
    async def _sync_activity_data(self, connection: DeviceConnection,
                                 start_date: datetime, end_date: datetime) -> List[HealthMetric]:
        """Sync activity data from Oura"""
        metrics = []
        
        start_str = start_date.strftime('%Y-%m-%d')
        end_str = end_date.strftime('%Y-%m-%d')
        
        url = f"{self.base_url}/v2/usercollection/daily_activity"
        params = {
            'start_date': start_str,
            'end_date': end_str
        }
        
        try:
            async with await self.make_authenticated_request(
                connection, 'GET', url, params=params
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    for activity_day in data.get('data', []):
                        day_date = self.normalize_timestamp(activity_day.get('day'))
                        
                        # Steps
                        steps = activity_day.get('steps')
                        if steps:
                            metrics.append(HealthMetric(
                                metric_type='steps',
                                value=float(steps),
                                unit='count',
                                timestamp=day_date,
                                source_device='oura'
                            ))
                        
                        # Calories
                        calories = activity_day.get('active_calories')
                        if calories:
                            metrics.append(HealthMetric(
                                metric_type='calories_burned',
                                value=float(calories),
                                unit='kcal',
                                timestamp=day_date,
                                source_device='oura'
                            ))
                        
                        # Activity score
                        activity_score = activity_day.get('score')
                        if activity_score:
                            metrics.append(HealthMetric(
                                metric_type='activity_score',
                                value=float(activity_score),
                                unit='score',
                                timestamp=day_date,
                                source_device='oura'
                            ))
                
                await asyncio.sleep(self.rate_limit_delay)
                
        except Exception as e:
            logger.error(f"Error syncing Oura activity data: {e}")
        
        return metrics
    
    async def _sync_readiness_data(self, connection: DeviceConnection,
                                  start_date: datetime, end_date: datetime) -> List[HealthMetric]:
        """Sync readiness/recovery data from Oura"""
        metrics = []
        
        start_str = start_date.strftime('%Y-%m-%d')
        end_str = end_date.strftime('%Y-%m-%d')
        
        url = f"{self.base_url}/v2/usercollection/daily_readiness"
        params = {
            'start_date': start_str,
            'end_date': end_str
        }
        
        try:
            async with await self.make_authenticated_request(
                connection, 'GET', url, params=params
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    for readiness_day in data.get('data', []):
                        day_date = self.normalize_timestamp(readiness_day.get('day'))
                        
                        # Readiness score
                        readiness_score = readiness_day.get('score')
                        if readiness_score:
                            metrics.append(HealthMetric(
                                metric_type='readiness_score',
                                value=float(readiness_score),
                                unit='score',
                                timestamp=day_date,
                                source_device='oura'
                            ))
                        
                        # Body temperature deviation
                        temp_deviation = readiness_day.get('temperature_deviation')
                        if temp_deviation is not None:
                            metrics.append(HealthMetric(
                                metric_type='body_temperature_deviation',
                                value=float(temp_deviation),
                                unit='celsius',
                                timestamp=day_date,
                                source_device='oura'
                            ))
                
                await asyncio.sleep(self.rate_limit_delay)
                
        except Exception as e:
            logger.error(f"Error syncing Oura readiness data: {e}")
        
        return metrics
    
    async def _sync_hrv_data(self, connection: DeviceConnection,
                            start_date: datetime, end_date: datetime) -> List[HealthMetric]:
        """Sync heart rate variability data from Oura"""
        metrics = []
        
        start_str = start_date.strftime('%Y-%m-%d')
        end_str = end_date.strftime('%Y-%m-%d')
        
        url = f"{self.base_url}/v2/usercollection/heartrate"
        params = {
            'start_date': start_str,
            'end_date': end_str
        }
        
        try:
            async with await self.make_authenticated_request(
                connection, 'GET', url, params=params
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    for hr_session in data.get('data', []):
                        timestamp = self.normalize_timestamp(hr_session.get('timestamp'))
                        
                        # HRV (RMSSD)
                        if 'bpm' in hr_session and len(hr_session['bpm']) > 1:
                            # Calculate RMSSD from heart rate data
                            hr_values = hr_session['bpm']
                            rr_intervals = [60000 / hr for hr in hr_values if hr > 0]
                            
                            if len(rr_intervals) > 1:
                                rmssd = self._calculate_rmssd(rr_intervals)
                                metrics.append(HealthMetric(
                                    metric_type='hrv_rmssd',
                                    value=rmssd,
                                    unit='ms',
                                    timestamp=timestamp,
                                    source_device='oura'
                                ))
                
                await asyncio.sleep(self.rate_limit_delay)
                
        except Exception as e:
            logger.error(f"Error syncing Oura HRV data: {e}")
        
        return metrics
    
    def _calculate_rmssd(self, rr_intervals: List[float]) -> float:
        """Calculate RMSSD from RR intervals"""
        if len(rr_intervals) < 2:
            return 0.0
        
        squared_diffs = []
        for i in range(1, len(rr_intervals)):
            diff = rr_intervals[i] - rr_intervals[i-1]
            squared_diffs.append(diff ** 2)
        
        mean_squared_diff = sum(squared_diffs) / len(squared_diffs)
        return mean_squared_diff ** 0.5
    
    def _calculate_oura_quality_score(self, metric: HealthMetric) -> float:
        """Calculate Oura-specific quality score"""
        base_score = 1.0
        
        # Adjust based on metric type and Oura-specific factors
        if metric.metric_type in ['sleep_duration', 'sleep_efficiency']:
            # Sleep data is generally high quality from Oura
            base_score = 0.95
        elif metric.metric_type == 'hrv_rmssd':
            # HRV quality depends on measurement conditions
            base_score = 0.85
        elif metric.metric_type in ['steps', 'calories_burned']:
            # Activity data may be less precise
            base_score = 0.80
        
        return base_score
    
    async def get_real_time_data(self, connection: DeviceConnection) -> List[HealthMetric]:
        """Get recent data from Oura Ring"""
        # Oura typically syncs data once per day, so get yesterday's data
        yesterday = datetime.now() - timedelta(days=1)
        today = datetime.now()
        
        return await self._sync_sleep_data(connection, yesterday, today)
    
    def get_authorization_url(self, client_id: str, redirect_uri: str) -> str:
        """Generate Oura OAuth authorization URL"""
        from urllib.parse import urlencode
        
        params = {
            'response_type': 'code',
            'client_id': client_id,
            'redirect_uri': redirect_uri,
            'scope': 'personal daily'
        }
        
        return f"{self.auth_url}?{urlencode(params)}"
