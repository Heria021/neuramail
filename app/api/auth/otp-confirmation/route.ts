import { NextRequest, NextResponse } from 'next/server';
import { confirmSignUp } from '@/lib/auth/signinUser';
import { loginUser } from '@/lib/auth/loginUser';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, confirmation_code } = body;

    // Validate required fields
    if (!email || !confirmation_code) {
      return NextResponse.json(
        {
          status: "error",
          message: "Email and confirmation code are required"
        },
        { status: 400 }
      );
    }

    // Call the existing confirmSignUp function
    const response = await confirmSignUp(email, confirmation_code);

    // Return the response
    if (response.status === "success") {
      // If OTP confirmation is successful, attempt to log in the user
      try {
        // Get the password from the request body if provided
        const { password } = body;

        // If password is not provided, just return the confirmation success
        if (!password) {
          return NextResponse.json({
            ...response,
            autoLogin: false,
            message: "Account verified successfully. Please sign in to continue."
          }, { status: 200 });
        }

        // Attempt to log in the user
        const loginResponse = await loginUser({ email, password });

        if (loginResponse.status === true) {
          // Return both confirmation success and login data
          return NextResponse.json({
            status: "success",
            message: "Account verified and logged in successfully",
            autoLogin: true,
            access_token: loginResponse.access_token,
            login_id: loginResponse.login_id
          }, { status: 200 });
        } else {
          // OTP verification succeeded but login failed
          return NextResponse.json({
            status: "success",
            autoLogin: false,
            message: "Account verified successfully, but automatic login failed. Please sign in manually.",
            loginError: loginResponse.message
          }, { status: 200 });
        }
      } catch (loginError) {
        console.error("Error during auto-login:", loginError);
        // Return success for OTP but with login error
        return NextResponse.json({
          status: "success",
          autoLogin: false,
          message: "Account verified successfully, but automatic login failed. Please sign in manually."
        }, { status: 200 });
      }
    } else {
      return NextResponse.json(response, { status: 400 });
    }
  } catch (error) {
    console.error("Error in OTP confirmation API:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "An unexpected error occurred during confirmation"
      },
      { status: 500 }
    );
  }
}
