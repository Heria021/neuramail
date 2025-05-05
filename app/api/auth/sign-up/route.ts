import { NextRequest, NextResponse } from 'next/server';
import { signUpUser } from '@/lib/auth/signinUser';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Email and password are required" 
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Password must be at least 6 characters" 
        },
        { status: 400 }
      );
    }

    // Call the existing signUpUser function
    const response = await signUpUser({ email, password });

    // Return the response with appropriate status code
    if (response.status === "success") {
      return NextResponse.json(response, { status: 200 });
    } else {
      return NextResponse.json(response, { status: 400 });
    }
  } catch (error) {
    console.error("Error in sign-up API:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "An unexpected error occurred during sign-up" 
      },
      { status: 500 }
    );
  }
}
