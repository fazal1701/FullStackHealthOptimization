import { NextRequest, NextResponse } from 'next/server';
import { MOCK_DATA } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = params.id;
    
    // In a real app, you'd fetch from database based on patientId
    // For now, return mock risk data
    const riskData = {
      patientId,
      timestamp: new Date().toISOString(),
      riskCategories: MOCK_DATA.longevityRiskCategories,
      overallRisk: 'low',
      riskScore: 25, // percentile
      lastUpdated: new Date().toISOString(),
      factors: MOCK_DATA.longevityRiskFactors
    };

    return NextResponse.json(riskData);
  } catch (error) {
    console.error('Error fetching patient risk:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient risk data' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = params.id;
    const body = await request.json();
    
    // In a real app, you'd update risk calculations based on new data
    console.log('Updating risk for patient:', patientId, body);
    
    return NextResponse.json({
      success: true,
      message: 'Risk assessment updated',
      patientId
    });
  } catch (error) {
    console.error('Error updating patient risk:', error);
    return NextResponse.json(
      { error: 'Failed to update patient risk' },
      { status: 500 }
    );
  }
}
