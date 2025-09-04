import { NextRequest, NextResponse } from 'next/server';
import { MOCK_DATA } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = params.id;
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // In a real app, you'd filter by date range and fetch from database
    if (patientId === 'patient-1') {
      return NextResponse.json({
        success: true,
        data: {
          metrics: MOCK_DATA.wearableMetrics,
          trends: MOCK_DATA.wearableTrends,
          timeSeriesData: MOCK_DATA.timeSeriesData,
          range: range
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Patient not found'
    }, { status: 404 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}