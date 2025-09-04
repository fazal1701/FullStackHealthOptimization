"""
Fitbit API Integration for Health Data Synchronization
Comprehensive implementation with OAuth 2.0 and real-time sync
"""

import asyncio
import aiohttp
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from urllib.parse import urlencode
import json
from loguru import logger

from ..common.base_device import (
    BaseDeviceIntegration, HealthMetric, DeviceConnection, SyncResult
)

class FitbitIntegration(BaseDeviceIntegration):
    """
    Fitbit API integration with comprehensive health data sync
    """
    
    def __init__(self):
        super().__init__("fitbit")
        
        # Fitbit API configuration
        self.base_url = "https://api.fitbit.com"
        self.auth_url = "https://www.fitbit.com/oauth2/authorize"
        self.token_url = "https://api.fitbit.com/oauth2/token"
        
        # Metric mappings from Fitbit to standardized names
        self.metric_mappings = {
            'steps': 'steps',
            'distance': 'distance_km',
            'calories': 'calories_burned',
            'heart': 'heart_rate',
            'sleep': 'sleep_duration',
            'weight': 'weight_kg',
            'fat': 'body_fat_percent'
        }
        
        # Available Fitbit scopes
        self.available_scopes = [
            'activity', 'heartrate', 'location', 'nutrition', 
            'profile', 'settings', 'sleep', 'social', 'weight'
        ]
        
        # Rate limiting (Fitbit allows 150 requests per hour per user)
        self.rate_limit_delay = 24  # seconds (150 requests / 3600 seconds)
    
    async def authenticate(self, credentials: Dict[str, str]) -> DeviceConnection:
        """
        Authenticate with Fitbit OAuth 2.0
        """
        client_id = credentials.get('client_id')
        client_secret = credentials.get('client_secret')
        redirect_uri = credentials.get('redirect_uri')
        authorization_code = credentials.get('authorization_code')
        user_id = credentials.get('user_id')
        
        if not all([client_id, client_secret, redirect_uri, authorization_code, user_id]):
            raise ValueError("Missing required Fitbit credentials")
        
        # Exchange authorization code for access token
        token_data = {
            'client_id': client_id,
            'grant_type': 'authorization_code',
            'redirect_uri': redirect_uri,
            'code': authorization_code
        }
        
        auth_header = aiohttp.BasicAuth(client_id, client_secret)
        
        async with self.session.post(
            self.token_url,
            data=token_data,
            auth=auth_header
        ) as response:
            if response.status != 200:
                error_text = await response.text()
                raise Exception(f"Fitbit authentication failed: {error_text}")
            
            token_response = await response.json()
        
        # Calculate token expiration
        expires_in = token_response.get('expires_in', 3600)
        expires_at = datetime.now() + timedelta(seconds=expires_in)
        
        connection = DeviceConnection(
            user_id=user_id,
            device_type=self.device_type,
            access_token=token_response['access_token'],
            refresh_token=token_response.get('refresh_token'),
            token_expires_at=expires_at,
            permissions=token_response.get('scope', '').split(),
            status='active'
        )
        
        logger.info(f"Fitbit authentication successful for user {user_id}")
        return connection
    
    async def refresh_token(self, connection: DeviceConnection) -> DeviceConnection:
        """
        Refresh expired Fitbit access token
        """
        if not connection.refresh_token:
            raise ValueError("No refresh token available")
        
        token_data = {
            'grant_type': 'refresh_token',
            'refresh_token': connection.refresh_token
        }
        
        async with self.session.post(self.token_url, data=token_data) as response:
            if response.status != 200:
                error_text = await response.text()
                raise Exception(f"Token refresh failed: {error_text}")
            
            token_response = await response.json()
        
        # Update connection with new tokens
        expires_in = token_response.get('expires_in', 3600)
        connection.access_token = token_response['access_token']
        connection.refresh_token = token_response.get('refresh_token', connection.refresh_token)
        connection.token_expires_at = datetime.now() + timedelta(seconds=expires_in)
        
        logger.info(f"Fitbit token refreshed for user {connection.user_id}")
        return connection
    
    async def get_available_metrics(self, connection: DeviceConnection) -> List[str]:
        """
        Get available metrics based on user's Fitbit permissions
        """
        available_metrics = []
        
        # Map permissions to available metrics
        permission_metrics = {
            'activity': ['steps', 'distance_km', 'calories_burned', 'active_minutes'],
            'heartrate': ['heart_rate', 'hrv_rmssd'],
            'sleep': ['sleep_duration', 'sleep_efficiency', 'sleep_stages'],
            'weight': ['weight_kg', 'body_fat_percent', 'bmi']
        }
        
        for permission in connection.permissions:
            if permission in permission_metrics:
                available_metrics.extend(permission_metrics[permission])
        
        return list(set(available_metrics))
    
    async def sync_metrics(self, connection: DeviceConnection,
                          start_date: datetime, end_date: datetime,
                          metric_types: List[str] = None) -> SyncResult:
        """
        Sync comprehensive health metrics from Fitbit
        """
        logger.info(f"Starting Fitbit sync for {connection.user_id} from {start_date} to {end_date}")
        
        all_metrics = []
        errors = []
        
        # If no specific metrics requested, get all available
        if not metric_types:
            metric_types = await self.get_available_metrics(connection)
        
        # Sync different types of data
        try:
            # Activity data (steps, distance, calories)
            if any(m in metric_types for m in ['steps', 'distance_km', 'calories_burned']):
                activity_metrics = await self._sync_activity_data(
                    connection, start_date, end_date
                )
                all_metrics.extend(activity_metrics)
            
            # Heart rate data
            if 'heart_rate' in metric_types:
                hr_metrics = await self._sync_heart_rate_data(
                    connection, start_date, end_date
                )
                all_metrics.extend(hr_metrics)
            
            # Sleep data
            if any(m in metric_types for m in ['sleep_duration', 'sleep_efficiency']):
                sleep_metrics = await self._sync_sleep_data(
                    connection, start_date, end_date
                )
                all_metrics.extend(sleep_metrics)
            
            # Weight and body composition
            if any(m in metric_types for m in ['weight_kg', 'body_fat_percent']):
                weight_metrics = await self._sync_weight_data(
                    connection, start_date, end_date
                )
                all_metrics.extend(weight_metrics)
            
        except Exception as e:
            logger.error(f"Error during Fitbit sync: {e}")
            errors.append(str(e))
        
        # Clean and validate metrics
        all_metrics = self.detect_outliers(all_metrics)
        validated_metrics = [
            m for m in all_metrics 
            if self.validate_metric_value(m.metric_type, m.value)
        ]
        
        # Calculate data quality score
        quality_score = self.calculate_quality_score(validated_metrics)
        
        # Update connection last sync time
        connection.last_sync = datetime.now()
        
        result = SyncResult(
            success=len(errors) == 0,
            metrics_synced=len(validated_metrics),
            errors=errors,
            last_sync_time=connection.last_sync,
            data_quality_score=quality_score
        )
        
        logger.info(f"Fitbit sync completed: {len(validated_metrics)} metrics, quality: {quality_score:.2f}")
        return result
    
    async def _sync_activity_data(self, connection: DeviceConnection,
                                 start_date: datetime, end_date: datetime) -> List[HealthMetric]:
        """Sync activity data (steps, distance, calories)"""
        metrics = []
        
        # Iterate through each day
        current_date = start_date.date()
        end_date_only = end_date.date()
        
        while current_date <= end_date_only:
            date_str = current_date.strftime('%Y-%m-%d')
            
            # Get daily activity summary
            url = f"{self.base_url}/1/user/-/activities/date/{date_str}.json"
            
            try:
                async with await self.make_authenticated_request(
                    connection, 'GET', url
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        summary = data.get('summary', {})
                        
                        # Extract metrics
                        if 'steps' in summary:
                            metrics.append(HealthMetric(
                                metric_type='steps',
                                value=float(summary['steps']),
                                unit='count',
                                timestamp=datetime.combine(current_date, datetime.min.time()),
                                source_device='fitbit'
                            ))
                        
                        if 'distances' in summary and summary['distances']:
                            total_distance = sum(d.get('distance', 0) for d in summary['distances'])
                            metrics.append(HealthMetric(
                                metric_type='distance_km',
                                value=total_distance,
                                unit='km',
                                timestamp=datetime.combine(current_date, datetime.min.time()),
                                source_device='fitbit'
                            ))
                        
                        if 'caloriesOut' in summary:
                            metrics.append(HealthMetric(
                                metric_type='calories_burned',
                                value=float(summary['caloriesOut']),
                                unit='kcal',
                                timestamp=datetime.combine(current_date, datetime.min.time()),
                                source_device='fitbit'
                            ))
                    
                    await asyncio.sleep(self.rate_limit_delay)
                    
            except Exception as e:
                logger.error(f"Error syncing Fitbit activity for {date_str}: {e}")
            
            current_date += timedelta(days=1)
        
        return metrics
    
    async def _sync_heart_rate_data(self, connection: DeviceConnection,
                                   start_date: datetime, end_date: datetime) -> List[HealthMetric]:
        """Sync heart rate and HRV data"""
        metrics = []
        
        current_date = start_date.date()
        end_date_only = end_date.date()
        
        while current_date <= end_date_only:
            date_str = current_date.strftime('%Y-%m-%d')
            
            # Get heart rate data
            url = f"{self.base_url}/1/user/-/activities/heart/date/{date_str}/1d.json"
            
            try:
                async with await self.make_authenticated_request(
                    connection, 'GET', url
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        # Resting heart rate
                        if 'activities-heart' in data and data['activities-heart']:
                            heart_data = data['activities-heart'][0]
                            if 'value' in heart_data and 'restingHeartRate' in heart_data['value']:
                                metrics.append(HealthMetric(
                                    metric_type='resting_heart_rate',
                                    value=float(heart_data['value']['restingHeartRate']),
                                    unit='bpm',
                                    timestamp=datetime.combine(current_date, datetime.min.time()),
                                    source_device='fitbit'
                                ))
                        
                        # Intraday heart rate (if available)
                        if 'activities-heart-intraday' in data:
                            intraday = data['activities-heart-intraday'].get('dataset', [])
                            for entry in intraday:
                                timestamp = datetime.combine(
                                    current_date,
                                    datetime.strptime(entry['time'], '%H:%M:%S').time()
                                )
                                metrics.append(HealthMetric(
                                    metric_type='heart_rate',
                                    value=float(entry['value']),
                                    unit='bpm',
                                    timestamp=timestamp,
                                    source_device='fitbit'
                                ))
                    
                    await asyncio.sleep(self.rate_limit_delay)
                    
            except Exception as e:
                logger.error(f"Error syncing Fitbit heart rate for {date_str}: {e}")
            
            current_date += timedelta(days=1)
        
        return metrics
    
    async def _sync_sleep_data(self, connection: DeviceConnection,
                              start_date: datetime, end_date: datetime) -> List[HealthMetric]:
        """Sync sleep data"""
        metrics = []
        
        current_date = start_date.date()
        end_date_only = end_date.date()
        
        while current_date <= end_date_only:
            date_str = current_date.strftime('%Y-%m-%d')
            
            # Get sleep data
            url = f"{self.base_url}/1.2/user/-/sleep/date/{date_str}.json"
            
            try:
                async with await self.make_authenticated_request(
                    connection, 'GET', url
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        if 'sleep' in data:
                            for sleep_session in data['sleep']:
                                if sleep_session.get('isMainSleep', True):
                                    # Sleep duration
                                    duration_ms = sleep_session.get('duration', 0)
                                    duration_hours = duration_ms / (1000 * 60 * 60)
                                    
                                    start_time = self.normalize_timestamp(
                                        sleep_session.get('startTime', '')
                                    )
                                    
                                    metrics.append(HealthMetric(
                                        metric_type='sleep_duration',
                                        value=duration_hours,
                                        unit='hours',
                                        timestamp=start_time,
                                        source_device='fitbit'
                                    ))
                                    
                                    # Sleep efficiency
                                    efficiency = sleep_session.get('efficiency', 0)
                                    if efficiency > 0:
                                        metrics.append(HealthMetric(
                                            metric_type='sleep_efficiency',
                                            value=float(efficiency),
                                            unit='percent',
                                            timestamp=start_time,
                                            source_device='fitbit'
                                        ))
                    
                    await asyncio.sleep(self.rate_limit_delay)
                    
            except Exception as e:
                logger.error(f"Error syncing Fitbit sleep for {date_str}: {e}")
            
            current_date += timedelta(days=1)
        
        return metrics
    
    async def _sync_weight_data(self, connection: DeviceConnection,
                               start_date: datetime, end_date: datetime) -> List[HealthMetric]:
        """Sync weight and body composition data"""
        metrics = []
        
        # Get weight logs
        start_str = start_date.strftime('%Y-%m-%d')
        end_str = end_date.strftime('%Y-%m-%d')
        
        url = f"{self.base_url}/1/user/-/body/log/weight/date/{start_str}/{end_str}.json"
        
        try:
            async with await self.make_authenticated_request(
                connection, 'GET', url
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if 'weight' in data:
                        for weight_entry in data['weight']:
                            timestamp = self.normalize_timestamp(weight_entry.get('date', ''))
                            
                            metrics.append(HealthMetric(
                                metric_type='weight_kg',
                                value=float(weight_entry.get('weight', 0)),
                                unit='kg',
                                timestamp=timestamp,
                                source_device='fitbit'
                            ))
                            
                            # Body fat percentage if available
                            if 'fat' in weight_entry:
                                metrics.append(HealthMetric(
                                    metric_type='body_fat_percent',
                                    value=float(weight_entry['fat']),
                                    unit='percent',
                                    timestamp=timestamp,
                                    source_device='fitbit'
                                ))
        
        except Exception as e:
            logger.error(f"Error syncing Fitbit weight data: {e}")
        
        return metrics
    
    async def get_real_time_data(self, connection: DeviceConnection) -> List[HealthMetric]:
        """
        Get recent/real-time data from Fitbit
        """
        # Get today's data
        today = datetime.now().date()
        yesterday = today - timedelta(days=1)
        
        return await self._sync_activity_data(
            connection, 
            datetime.combine(yesterday, datetime.min.time()),
            datetime.combine(today, datetime.max.time())
        )
    
    def get_authorization_url(self, client_id: str, redirect_uri: str, 
                             scopes: List[str] = None) -> str:
        """
        Generate Fitbit OAuth authorization URL
        """
        if not scopes:
            scopes = ['activity', 'heartrate', 'sleep', 'weight']
        
        params = {
            'response_type': 'code',
            'client_id': client_id,
            'redirect_uri': redirect_uri,
            'scope': ' '.join(scopes),
            'expires_in': '31536000'  # 1 year
        }
        
        return f"{self.auth_url}?{urlencode(params)}"

# Example usage and testing
async def test_fitbit_integration():
    """Test Fitbit integration functionality"""
    fitbit = FitbitIntegration()

    # Mock credentials for testing
    test_credentials = {
        'client_id': 'your_fitbit_client_id',
        'client_secret': 'your_fitbit_client_secret',
        'redirect_uri': 'http://localhost:8000/callback',
        'authorization_code': 'mock_auth_code',
        'user_id': 'test_user_123'
    }

    async with fitbit:
        try:
            # Test authentication
            connection = await fitbit.authenticate(test_credentials)
            print(f"Authentication successful: {connection.user_id}")

            # Test available metrics
            metrics = await fitbit.get_available_metrics(connection)
            print(f"Available metrics: {metrics}")

            # Test data sync
            end_date = datetime.now()
            start_date = end_date - timedelta(days=7)

            result = await fitbit.sync_metrics(connection, start_date, end_date)
            print(f"Sync result: {result.metrics_synced} metrics, quality: {result.data_quality_score}")

        except Exception as e:
            print(f"Test failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_fitbit_integration())
