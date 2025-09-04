"""
Base device integration class for health wearables
Provides common interface for all device types
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
import asyncio
import aiohttp
from loguru import logger
import json

@dataclass
class HealthMetric:
    """Standardized health metric data structure"""
    metric_type: str  # 'steps', 'hrv_rmssd', 'sleep_duration', etc.
    value: float
    unit: str
    timestamp: datetime
    source_device: str
    quality_score: float = 1.0  # 0-1 data quality indicator
    metadata: Dict[str, Any] = None
    
    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        data['timestamp'] = self.timestamp.isoformat()
        return data

@dataclass
class DeviceConnection:
    """Device connection configuration"""
    user_id: str
    device_type: str  # 'apple', 'fitbit', 'oura', etc.
    access_token: str
    refresh_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None
    permissions: List[str] = None
    last_sync: Optional[datetime] = None
    status: str = 'active'  # 'active', 'expired', 'revoked'

@dataclass
class SyncResult:
    """Result of device synchronization"""
    success: bool
    metrics_synced: int
    errors: List[str]
    last_sync_time: datetime
    next_sync_time: Optional[datetime] = None
    data_quality_score: float = 1.0

class BaseDeviceIntegration(ABC):
    """
    Abstract base class for all device integrations
    """
    
    def __init__(self, device_type: str):
        self.device_type = device_type
        self.session: Optional[aiohttp.ClientSession] = None
        self.rate_limit_delay = 1.0  # seconds between requests
        
        # Metric type mappings (device-specific to standardized)
        self.metric_mappings = {}
        
        # Quality scoring weights
        self.quality_weights = {
            'completeness': 0.4,    # How complete is the data
            'consistency': 0.3,     # How consistent with previous data
            'freshness': 0.2,       # How recent is the data
            'accuracy': 0.1         # Device-specific accuracy indicators
        }
    
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    @abstractmethod
    async def authenticate(self, credentials: Dict[str, str]) -> DeviceConnection:
        """Authenticate with device API and return connection info"""
        pass
    
    @abstractmethod
    async def refresh_token(self, connection: DeviceConnection) -> DeviceConnection:
        """Refresh expired access token"""
        pass
    
    @abstractmethod
    async def get_available_metrics(self, connection: DeviceConnection) -> List[str]:
        """Get list of available metrics for this device/user"""
        pass
    
    @abstractmethod
    async def sync_metrics(self, connection: DeviceConnection, 
                          start_date: datetime, end_date: datetime,
                          metric_types: List[str] = None) -> SyncResult:
        """Sync metrics from device for specified date range"""
        pass
    
    @abstractmethod
    async def get_real_time_data(self, connection: DeviceConnection) -> List[HealthMetric]:
        """Get real-time/recent data from device"""
        pass
    
    def standardize_metric_type(self, device_metric: str) -> str:
        """Convert device-specific metric name to standardized type"""
        return self.metric_mappings.get(device_metric, device_metric)
    
    def calculate_quality_score(self, metrics: List[HealthMetric], 
                               expected_count: int = None) -> float:
        """
        Calculate data quality score based on multiple factors
        """
        if not metrics:
            return 0.0
        
        scores = {}
        
        # Completeness score
        if expected_count:
            scores['completeness'] = min(len(metrics) / expected_count, 1.0)
        else:
            scores['completeness'] = 1.0
        
        # Freshness score (how recent is the data)
        now = datetime.now()
        avg_age_hours = sum(
            (now - metric.timestamp).total_seconds() / 3600 
            for metric in metrics
        ) / len(metrics)
        scores['freshness'] = max(0, 1 - (avg_age_hours / 24))  # Decay over 24 hours
        
        # Consistency score (variance in data)
        values = [m.value for m in metrics if m.value is not None]
        if len(values) > 1:
            mean_val = sum(values) / len(values)
            variance = sum((v - mean_val) ** 2 for v in values) / len(values)
            cv = (variance ** 0.5) / mean_val if mean_val > 0 else 0
            scores['consistency'] = max(0, 1 - cv)  # Lower coefficient of variation = higher consistency
        else:
            scores['consistency'] = 1.0
        
        # Accuracy score (device-specific, default to 1.0)
        scores['accuracy'] = 1.0
        
        # Weighted average
        total_score = sum(
            scores[factor] * weight 
            for factor, weight in self.quality_weights.items()
        )
        
        return min(max(total_score, 0.0), 1.0)
    
    def detect_outliers(self, metrics: List[HealthMetric]) -> List[HealthMetric]:
        """
        Detect and flag outliers in metric data
        """
        if len(metrics) < 3:
            return metrics
        
        # Group by metric type
        by_type = {}
        for metric in metrics:
            if metric.metric_type not in by_type:
                by_type[metric.metric_type] = []
            by_type[metric.metric_type].append(metric)
        
        cleaned_metrics = []
        
        for metric_type, type_metrics in by_type.items():
            if len(type_metrics) < 3:
                cleaned_metrics.extend(type_metrics)
                continue
            
            values = [m.value for m in type_metrics]
            q1 = sorted(values)[len(values) // 4]
            q3 = sorted(values)[3 * len(values) // 4]
            iqr = q3 - q1
            
            lower_bound = q1 - 1.5 * iqr
            upper_bound = q3 + 1.5 * iqr
            
            for metric in type_metrics:
                if lower_bound <= metric.value <= upper_bound:
                    cleaned_metrics.append(metric)
                else:
                    # Flag as outlier but keep with reduced quality score
                    metric.quality_score *= 0.5
                    if metric.metadata is None:
                        metric.metadata = {}
                    metric.metadata['outlier_detected'] = True
                    cleaned_metrics.append(metric)
        
        return cleaned_metrics
    
    async def handle_rate_limiting(self, response: aiohttp.ClientResponse) -> bool:
        """
        Handle rate limiting from API responses
        Returns True if request should be retried
        """
        if response.status == 429:  # Too Many Requests
            retry_after = response.headers.get('Retry-After')
            if retry_after:
                wait_time = int(retry_after)
            else:
                wait_time = self.rate_limit_delay * 2  # Exponential backoff
            
            logger.warning(f"Rate limited by {self.device_type} API. Waiting {wait_time}s")
            await asyncio.sleep(wait_time)
            self.rate_limit_delay = min(wait_time * 2, 60)  # Cap at 60 seconds
            return True
        
        # Reset rate limit delay on successful request
        if response.status == 200:
            self.rate_limit_delay = 1.0
        
        return False
    
    async def make_authenticated_request(self, connection: DeviceConnection,
                                       method: str, url: str, 
                                       **kwargs) -> aiohttp.ClientResponse:
        """
        Make authenticated request with automatic token refresh
        """
        headers = kwargs.get('headers', {})
        headers['Authorization'] = f'Bearer {connection.access_token}'
        kwargs['headers'] = headers
        
        async with self.session.request(method, url, **kwargs) as response:
            # Handle token expiration
            if response.status == 401:
                logger.info(f"Token expired for {self.device_type}, refreshing...")
                connection = await self.refresh_token(connection)
                headers['Authorization'] = f'Bearer {connection.access_token}'
                
                # Retry with new token
                async with self.session.request(method, url, **kwargs) as retry_response:
                    return retry_response
            
            # Handle rate limiting
            if await self.handle_rate_limiting(response):
                # Retry after rate limit delay
                async with self.session.request(method, url, **kwargs) as retry_response:
                    return retry_response
            
            return response
    
    def normalize_timestamp(self, timestamp_str: str, timezone: str = None) -> datetime:
        """
        Normalize various timestamp formats to datetime object
        """
        # Handle common timestamp formats
        formats = [
            '%Y-%m-%dT%H:%M:%S.%fZ',
            '%Y-%m-%dT%H:%M:%SZ',
            '%Y-%m-%dT%H:%M:%S',
            '%Y-%m-%d %H:%M:%S',
            '%Y-%m-%d'
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(timestamp_str, fmt)
            except ValueError:
                continue
        
        # If no format matches, try parsing as ISO format
        try:
            return datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
        except ValueError:
            logger.error(f"Could not parse timestamp: {timestamp_str}")
            return datetime.now()
    
    def validate_metric_value(self, metric_type: str, value: float) -> bool:
        """
        Validate metric values against reasonable ranges
        """
        validation_ranges = {
            'steps': (0, 100000),
            'heart_rate': (30, 220),
            'hrv_rmssd': (1, 200),
            'sleep_duration': (0, 24),  # hours
            'sleep_efficiency': (0, 100),  # percentage
            'vo2_max': (10, 80),
            'calories_burned': (0, 10000),
            'distance_km': (0, 200),
            'blood_oxygen': (70, 100),  # percentage
            'body_temperature': (35, 42),  # Celsius
            'weight_kg': (20, 300),
            'body_fat_percent': (3, 60)
        }
        
        if metric_type in validation_ranges:
            min_val, max_val = validation_ranges[metric_type]
            return min_val <= value <= max_val
        
        # If no validation range defined, assume valid
        return True
    
    async def batch_sync_with_retry(self, connection: DeviceConnection,
                                   date_ranges: List[Tuple[datetime, datetime]],
                                   metric_types: List[str] = None,
                                   max_retries: int = 3) -> List[SyncResult]:
        """
        Sync multiple date ranges with retry logic
        """
        results = []
        
        for start_date, end_date in date_ranges:
            for attempt in range(max_retries):
                try:
                    result = await self.sync_metrics(
                        connection, start_date, end_date, metric_types
                    )
                    results.append(result)
                    break
                except Exception as e:
                    logger.error(f"Sync attempt {attempt + 1} failed: {e}")
                    if attempt == max_retries - 1:
                        # Final attempt failed, add error result
                        results.append(SyncResult(
                            success=False,
                            metrics_synced=0,
                            errors=[str(e)],
                            last_sync_time=datetime.now()
                        ))
                    else:
                        # Wait before retry
                        await asyncio.sleep(2 ** attempt)
        
        return results
