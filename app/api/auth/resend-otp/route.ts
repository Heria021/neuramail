import { NextRequest, NextResponse } from 'next/server';

// This is a placeholder function - in a real implementation, 
// you would call your backend service to resend the OTP
async function resendOTP(email: string) {
  // Simulate a successful response
  return {
    status: "success",
    message: "Verification code resent successfully"
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Email is required" 
        },
        { status: 400 }
      );
    }

    // Call the function to resend OTP
    const response = await resendOTP(email);

    // Return the response
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in resend OTP API:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "An unexpected error occurred while resending the verification code" 
      },
      { status: 500 }
    );
  }
}
