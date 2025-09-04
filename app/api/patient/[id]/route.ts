import { NextRequest, NextResponse } from 'next/server';
import { MOCK_DATA } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = params.id;

    // In a real app, you'd fetch from database
    // For now, return mock data for the patient
    if (patientId === 'patient-1') {
      return NextResponse.json({
        success: true,
        data: {
          patient: MOCK_DATA.patient,
          riskScores: MOCK_DATA.riskScores,
          wearableData: MOCK_DATA.wearableMetrics,
          wearableTrends: MOCK_DATA.wearableTrends,
          habits: MOCK_DATA.habits,
          badges: MOCK_DATA.badges,
          nudges: MOCK_DATA.nudges,
          vendors: MOCK_DATA.vendors
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