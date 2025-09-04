import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = params.id;
    const body = await request.json();
    const { vendor } = body;

    if (!vendor) {
      return NextResponse.json({
        success: false,
        error: 'Vendor is required'
      }, { status: 400 });
    }

    // In a real app, you'd:
    // 1. Validate the patient exists
    // 2. Generate OAuth URL for the vendor
    // 3. Store the linking request in database
    // 4. Return the OAuth URL for redirect

    const mockOAuthUrls: Record<string, string> = {
      'fitbit': 'https://www.fitbit.com/oauth2/authorize?client_id=mock&response_type=code',
      'apple-health': 'https://developer.apple.com/health-records/mock-auth',
      'oura': 'https://cloud.ouraring.com/oauth/authorize?client_id=mock',
      'whoop': 'https://api.whoop.com/oauth/authorize?client_id=mock',
      'garmin': 'https://connect.garmin.com/oauth/authorize?client_id=mock',
      'google-fit': 'https://accounts.google.com/oauth/authorize?scope=fitness'
    };

    const oauthUrl = mockOAuthUrls[vendor];

    if (!oauthUrl) {
      return NextResponse.json({
        success: false,
        error: 'Unsupported vendor'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        oauthUrl,
        vendor,
        patientId,
        message: `Redirect to ${vendor} for authorization`
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}