import { NextRequest, NextResponse } from 'next/server';
import { MOCK_DATA } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ageGroup = searchParams.get('ageGroup') || 'all';
    const condition = searchParams.get('condition') || 'all';
    const riskLevel = searchParams.get('riskLevel') || 'all';
    
    // In a real app, you'd filter the cohort data based on query parameters
    const cohortAnalytics = {
      filters: {
        ageGroup,
        condition,
        riskLevel
      },
      summary: MOCK_DATA.cohortData,
      riskDistribution: [
        { name: 'Low Risk', value: MOCK_DATA.cohortData.riskDistribution.low, percentage: 63.2 },
        { name: 'Moderate Risk', value: MOCK_DATA.cohortData.riskDistribution.moderate, percentage: 27.1 },
        { name: 'High Risk', value: MOCK_DATA.cohortData.riskDistribution.high, percentage: 9.7 }
      ],
      ageDistribution: Object.entries(MOCK_DATA.cohortData.ageGroups).map(([age, count]) => ({
        ageGroup: age,
        count,
        percentage: ((count / MOCK_DATA.cohortData.totalPatients) * 100).toFixed(1)
      })),
      conditionPrevalence: Object.entries(MOCK_DATA.cohortData.conditions).map(([condition, count]) => ({
        condition,
        count,
        prevalence: ((count / MOCK_DATA.cohortData.totalPatients) * 100).toFixed(1)
      })),
      longevityMetrics: MOCK_DATA.cohortData.longevityMetrics,
      trends: {
        monthlyNewPatients: [12, 15, 18, 22, 19, 25, 28, 24, 21, 26, 30, 27],
        riskImprovements: [8, 12, 15, 18, 22, 19, 24, 28, 25, 29, 32, 35],
        avgBiomarkerTrends: {
          apob: [-2.3, -1.8, -2.1, -1.5, -2.7, -1.9],
          hba1c: [-0.2, -0.1, -0.3, -0.2, -0.4, -0.3],
          hscrp: [-0.4, -0.3, -0.5, -0.2, -0.6, -0.4]
        }
      },
      alerts: [
        {
          id: 1,
          type: 'high_risk',
          message: '3 patients with ApoB >120 mg/dL require immediate intervention',
          priority: 'high',
          patientCount: 3,
          created: new Date().toISOString()
        },
        {
          id: 2,
          type: 'declining_trend',
          message: '5 patients showing declining HRV trends',
          priority: 'medium',
          patientCount: 5,
          created: new Date().toISOString()
        },
        {
          id: 3,
          type: 'medication_compliance',
          message: '12 patients with <80% medication compliance',
          priority: 'medium',
          patientCount: 12,
          created: new Date().toISOString()
        }
      ],
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(cohortAnalytics);
  } catch (error) {
    console.error('Error fetching cohort analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cohort analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters, exportFormat } = body;
    
    if (exportFormat) {
      // In a real app, you'd generate and return a file download
      console.log('Exporting cohort data with filters:', filters);
      
      return NextResponse.json({
        success: true,
        message: 'Export initiated',
        downloadUrl: '/api/exports/cohort-analytics.csv',
        expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour
      });
    }
    
    // Handle other POST operations like saving custom filters
    return NextResponse.json({
      success: true,
      message: 'Cohort filters saved'
    });
  } catch (error) {
    console.error('Error processing cohort request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
