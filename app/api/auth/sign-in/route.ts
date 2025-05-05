import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth/loginUser';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { 
          status: false, 
          message: "Email and password are required" 
        },
        { status: 400 }
      );
    }

    // Call the existing loginUser function
    const response = await loginUser({ email, password });

    // Return the response with appropriate status code
    if (response.status === true) {
      return NextResponse.json({
        ...response,
        rememberMe: rememberMe || false
      }, { status: 200 });
    } else {
      return NextResponse.json(response, { status: 401 });
    }
  } catch (error) {
    console.error("Error in sign-in API:", error);
    return NextResponse.json(
      { 
        status: false, 
        message: "An unexpected error occurred during sign-in" 
      },
      { status: 500 }
    );
  }
}
