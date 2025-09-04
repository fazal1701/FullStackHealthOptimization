"""
Device Manager - Centralized coordination of all health device integrations
Handles authentication, synchronization, and data aggregation across all devices
"""

import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Type
from dataclasses import dataclass
from loguru import logger
import json

from .common.base_device import BaseDeviceIntegration, HealthMetric, DeviceConnection, SyncResult
from .fitbit.fitbit_integration import FitbitIntegration
from .oura.oura_integration import OuraIntegration

@dataclass
class UserDeviceProfile:
    """Complete device profile for a user"""
    user_id: str
    connected_devices: Dict[str, DeviceConnection]
    sync_preferences: Dict[str, Any]
    data_quality_scores: Dict[str, float]
    last_full_sync: Optional[datetime] = None
    sync_errors: List[str] = None

@dataclass
class AggregatedMetrics:
    """Aggregated health metrics from multiple devices"""
    user_id: str
    date: datetime
    metrics: Dict[str, HealthMetric]
    data_sources: Dict[str, str]  # metric_type -> device_type
    overall_quality_score: float
    completeness_score: float

class DeviceManager:
    """
    Centralized manager for all health device integrations
    """
    
    def __init__(self):
        # Initialize device integrations
        self.integrations: Dict[str, BaseDeviceIntegration] = {
            'fitbit': FitbitIntegration(),
            'oura': OuraIntegration(),
            # Add more integrations here
            # 'apple': AppleHealthIntegration(),
            # 'whoop': WhoopIntegration(),
            # 'garmin': GarminIntegration(),
        }
        
        # User profiles cache
        self.user_profiles: Dict[str, UserDeviceProfile] = {}
        
        # Metric priority mapping (which device to prefer for each metric)
        self.metric_priorities = {
            'sleep_duration': ['oura', 'fitbit', 'whoop'],
            'sleep_efficiency': ['oura', 'whoop', 'fitbit'],
            'hrv_rmssd': ['oura', 'whoop', 'fitbit'],
            'steps': ['fitbit', 'apple', 'garmin'],
            'heart_rate': ['whoop', 'fitbit', 'oura'],
            'calories_burned': ['whoop', 'fitbit', 'garmin'],
            'readiness_score': ['oura', 'whoop'],
            'body_temperature': ['oura', 'whoop']
        }
        
        # Sync scheduling
        self.sync_intervals = {
            'real_time': timedelta(minutes=15),
            'hourly': timedelta(hours=1),
            'daily': timedelta(days=1),
            'weekly': timedelta(weeks=1)
        }
    
    async def authenticate_device(self, user_id: str, device_type: str, 
                                 credentials: Dict[str, str]) -> DeviceConnection:
        """
        Authenticate a user with a specific device
        """
        if device_type not in self.integrations:
            raise ValueError(f"Unsupported device type: {device_type}")
        
        integration = self.integrations[device_type]
        
        async with integration:
            connection = await integration.authenticate(credentials)
            
            # Store connection in user profile
            if user_id not in self.user_profiles:
                self.user_profiles[user_id] = UserDeviceProfile(
                    user_id=user_id,
                    connected_devices={},
                    sync_preferences={},
                    data_quality_scores={},
                    sync_errors=[]
                )
            
            self.user_profiles[user_id].connected_devices[device_type] = connection
            
            logger.info(f"Device {device_type} authenticated for user {user_id}")
            return connection
    
    async def sync_user_data(self, user_id: str, 
                            start_date: datetime = None,
                            end_date: datetime = None,
                            device_types: List[str] = None) -> Dict[str, SyncResult]:
        """
        Sync data for all connected devices for a user
        """
        if user_id not in self.user_profiles:
            raise ValueError(f"No device profile found for user {user_id}")
        
        profile = self.user_profiles[user_id]
        
        # Default date range (last 7 days)
        if not end_date:
            end_date = datetime.now()
        if not start_date:
            start_date = end_date - timedelta(days=7)
        
        # Determine which devices to sync
        if not device_types:
            device_types = list(profile.connected_devices.keys())
        
        sync_results = {}
        
        # Sync each device concurrently
        sync_tasks = []
        for device_type in device_types:
            if device_type in profile.connected_devices:
                connection = profile.connected_devices[device_type]
                integration = self.integrations[device_type]
                
                task = self._sync_device_data(
                    integration, connection, start_date, end_date, device_type
                )
                sync_tasks.append(task)
        
        # Wait for all syncs to complete
        results = await asyncio.gather(*sync_tasks, return_exceptions=True)
        
        # Process results
        for i, result in enumerate(results):
            device_type = device_types[i]
            if isinstance(result, Exception):
                logger.error(f"Sync failed for {device_type}: {result}")
                sync_results[device_type] = SyncResult(
                    success=False,
                    metrics_synced=0,
                    errors=[str(result)],
                    last_sync_time=datetime.now()
                )
                profile.sync_errors.append(f"{device_type}: {result}")
            else:
                sync_results[device_type] = result
                profile.data_quality_scores[device_type] = result.data_quality_score
        
        # Update profile
        profile.last_full_sync = datetime.now()
        
        logger.info(f"Sync completed for user {user_id}: {len(sync_results)} devices")
        return sync_results
    
    async def _sync_device_data(self, integration: BaseDeviceIntegration,
                               connection: DeviceConnection,
                               start_date: datetime, end_date: datetime,
                               device_type: str) -> SyncResult:
        """Sync data from a specific device"""
        async with integration:
            return await integration.sync_metrics(connection, start_date, end_date)
    
    async def get_aggregated_metrics(self, user_id: str, 
                                   date: datetime = None) -> AggregatedMetrics:
        """
        Get aggregated health metrics for a user from all devices
        """
        if not date:
            date = datetime.now().date()
        
        if user_id not in self.user_profiles:
            raise ValueError(f"No device profile found for user {user_id}")
        
        profile = self.user_profiles[user_id]
        
        # Collect metrics from all devices for the specified date
        all_metrics = {}
        data_sources = {}
        
        for device_type, connection in profile.connected_devices.items():
            integration = self.integrations[device_type]
            
            try:
                async with integration:
                    # Get metrics for the specific date
                    start_datetime = datetime.combine(date, datetime.min.time())
                    end_datetime = datetime.combine(date, datetime.max.time())
                    
                    result = await integration.sync_metrics(
                        connection, start_datetime, end_datetime
                    )
                    
                    # Process metrics (this would typically come from database)
                    # For now, we'll simulate having the metrics
                    device_metrics = self._simulate_device_metrics(device_type, date)
                    
                    for metric in device_metrics:
                        metric_type = metric.metric_type
                        
                        # Use device priority to determine which metric to keep
                        if metric_type in self.metric_priorities:
                            priority_devices = self.metric_priorities[metric_type]
                            
                            if (metric_type not in all_metrics or 
                                device_type in priority_devices and
                                (data_sources.get(metric_type) not in priority_devices or
                                 priority_devices.index(device_type) < 
                                 priority_devices.index(data_sources.get(metric_type)))):
                                
                                all_metrics[metric_type] = metric
                                data_sources[metric_type] = device_type
                        else:
                            # No priority defined, use first available
                            if metric_type not in all_metrics:
                                all_metrics[metric_type] = metric
                                data_sources[metric_type] = device_type
            
            except Exception as e:
                logger.error(f"Error getting metrics from {device_type}: {e}")
        
        # Calculate overall quality and completeness scores
        quality_scores = [m.quality_score for m in all_metrics.values()]
        overall_quality = sum(quality_scores) / len(quality_scores) if quality_scores else 0
        
        # Completeness based on expected metrics
        expected_metrics = [
            'sleep_duration', 'sleep_efficiency', 'steps', 'heart_rate',
            'hrv_rmssd', 'calories_burned'
        ]
        completeness = len([m for m in expected_metrics if m in all_metrics]) / len(expected_metrics)
        
        return AggregatedMetrics(
            user_id=user_id,
            date=datetime.combine(date, datetime.min.time()),
            metrics=all_metrics,
            data_sources=data_sources,
            overall_quality_score=overall_quality,
            completeness_score=completeness
        )
    
    def _simulate_device_metrics(self, device_type: str, date: datetime) -> List[HealthMetric]:
        """
        Simulate device metrics for demonstration
        In production, this would query the database
        """
        base_timestamp = datetime.combine(date, datetime.min.time())
        
        if device_type == 'oura':
            return [
                HealthMetric('sleep_duration', 7.5, 'hours', base_timestamp, 'oura', 0.95),
                HealthMetric('sleep_efficiency', 88.0, 'percent', base_timestamp, 'oura', 0.95),
                HealthMetric('hrv_rmssd', 45.2, 'ms', base_timestamp, 'oura', 0.90),
                HealthMetric('readiness_score', 82.0, 'score', base_timestamp, 'oura', 0.95),
                HealthMetric('body_temperature', 36.7, 'celsius', base_timestamp, 'oura', 0.85)
            ]
        elif device_type == 'fitbit':
            return [
                HealthMetric('steps', 8542, 'count', base_timestamp, 'fitbit', 0.90),
                HealthMetric('calories_burned', 2150, 'kcal', base_timestamp, 'fitbit', 0.85),
                HealthMetric('heart_rate', 72, 'bpm', base_timestamp, 'fitbit', 0.88),
                HealthMetric('sleep_duration', 7.2, 'hours', base_timestamp, 'fitbit', 0.80)
            ]
        
        return []
    
    async def get_real_time_data(self, user_id: str) -> Dict[str, List[HealthMetric]]:
        """
        Get real-time data from all connected devices
        """
        if user_id not in self.user_profiles:
            raise ValueError(f"No device profile found for user {user_id}")
        
        profile = self.user_profiles[user_id]
        real_time_data = {}
        
        # Get real-time data from each device
        for device_type, connection in profile.connected_devices.items():
            integration = self.integrations[device_type]
            
            try:
                async with integration:
                    metrics = await integration.get_real_time_data(connection)
                    real_time_data[device_type] = metrics
            except Exception as e:
                logger.error(f"Error getting real-time data from {device_type}: {e}")
                real_time_data[device_type] = []
        
        return real_time_data
    
    async def schedule_sync(self, user_id: str, sync_type: str = 'daily'):
        """
        Schedule automatic synchronization for a user
        """
        if sync_type not in self.sync_intervals:
            raise ValueError(f"Invalid sync type: {sync_type}")
        
        interval = self.sync_intervals[sync_type]
        
        while True:
            try:
                await self.sync_user_data(user_id)
                logger.info(f"Scheduled {sync_type} sync completed for user {user_id}")
            except Exception as e:
                logger.error(f"Scheduled sync failed for user {user_id}: {e}")
            
            await asyncio.sleep(interval.total_seconds())
    
    def get_user_profile(self, user_id: str) -> Optional[UserDeviceProfile]:
        """Get user device profile"""
        return self.user_profiles.get(user_id)
    
    def get_connected_devices(self, user_id: str) -> List[str]:
        """Get list of connected device types for a user"""
        if user_id in self.user_profiles:
            return list(self.user_profiles[user_id].connected_devices.keys())
        return []
    
    async def disconnect_device(self, user_id: str, device_type: str):
        """Disconnect a device from user profile"""
        if user_id in self.user_profiles:
            profile = self.user_profiles[user_id]
            if device_type in profile.connected_devices:
                del profile.connected_devices[device_type]
                logger.info(f"Device {device_type} disconnected for user {user_id}")
    
    def get_data_quality_summary(self, user_id: str) -> Dict[str, Any]:
        """Get data quality summary for a user"""
        if user_id not in self.user_profiles:
            return {}
        
        profile = self.user_profiles[user_id]
        
        return {
            'connected_devices': len(profile.connected_devices),
            'data_quality_scores': profile.data_quality_scores,
            'last_sync': profile.last_full_sync,
            'recent_errors': profile.sync_errors[-5:] if profile.sync_errors else [],
            'overall_quality': (
                sum(profile.data_quality_scores.values()) / 
                len(profile.data_quality_scores)
                if profile.data_quality_scores else 0
            )
        }

# Example usage and testing
async def test_device_manager():
    """Test device manager functionality"""
    manager = DeviceManager()
    
    # Test user
    user_id = "test_user_123"
    
    # Mock authentication (in production, this would use real credentials)
    try:
        # Authenticate Fitbit
        fitbit_creds = {
            'client_id': 'test_client_id',
            'client_secret': 'test_client_secret',
            'redirect_uri': 'http://localhost:8000/callback',
            'authorization_code': 'mock_code',
            'user_id': user_id
        }
        
        # This would fail without real credentials, but shows the flow
        # await manager.authenticate_device(user_id, 'fitbit', fitbit_creds)
        
        # Simulate connected devices
        manager.user_profiles[user_id] = UserDeviceProfile(
            user_id=user_id,
            connected_devices={},
            sync_preferences={},
            data_quality_scores={'fitbit': 0.85, 'oura': 0.92}
        )
        
        # Test aggregated metrics
        aggregated = await manager.get_aggregated_metrics(user_id)
        print(f"Aggregated metrics: {len(aggregated.metrics)} metrics")
        print(f"Data quality: {aggregated.overall_quality_score:.2f}")
        print(f"Completeness: {aggregated.completeness_score:.2f}")
        
        # Test data quality summary
        quality_summary = manager.get_data_quality_summary(user_id)
        print(f"Quality summary: {quality_summary}")
        
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_device_manager())
