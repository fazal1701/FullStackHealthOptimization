import { NextRequest, NextResponse } from 'next/server';
import { MOCK_DATA } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId') || 'doctor-1';
    const sex = searchParams.get('sex') || 'all';
    const riskLevel = searchParams.get('riskLevel') || 'all';
    const wearableStatus = searchParams.get('wearableStatus') || 'all';

    // In a real app, you'd fetch patients for this doctor from database
    let patients = MOCK_DATA.patientSummaries;

    // Apply filters
    if (sex !== 'all') {
      patients = patients.filter(p => p.sex.toLowerCase() === sex);
    }
    if (riskLevel !== 'all') {
      patients = patients.filter(p => p.overallRisk === riskLevel);
    }
    if (wearableStatus !== 'all') {
      patients = patients.filter(p => p.wearableStatus === wearableStatus);
    }

    // Calculate summary statistics
    const totalPatients = patients.length;
    const highRiskCount = patients.filter(p => p.overallRisk === 'high').length;
    const activeWearablesCount = patients.filter(p => p.wearableStatus === 'active').length;
    const avgCompliance = patients.reduce((sum, p) => sum + p.medicationCompliance, 0) / totalPatients;

    return NextResponse.json({
      success: true,
      data: {
        doctor: MOCK_DATA.doctor,
        patients,
        summary: {
          totalPatients,
          highRiskCount,
          activeWearablesCount,
          avgCompliance: Math.round(avgCompliance)
        },
        filters: {
          sex,
          riskLevel,
          wearableStatus
        }
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}