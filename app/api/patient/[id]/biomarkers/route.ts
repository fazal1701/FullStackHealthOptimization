import { NextRequest, NextResponse } from 'next/server';
import { MOCK_DATA } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = params.id;

    // In a real app, you'd fetch biomarker history from database
    if (patientId === 'patient-1') {
      return NextResponse.json({
        success: true,
        data: {
          current: MOCK_DATA.biomarkers,
          timeline: MOCK_DATA.biomarkerTimeline,
          medications: MOCK_DATA.medications,
          medicationOverlays: MOCK_DATA.medOverlays,
          decisionSupport: MOCK_DATA.decisionSupport
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