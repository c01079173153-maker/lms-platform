import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId, courseId } = body;

    if (!paymentId || !courseId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // In a real application, you would:
    // 1. Fetch the PortOne API access token (using your API Secret)
    // 2. Fetch the payment details from PortOne using the paymentId
    // 3. Verify if the payment amount matches the course price
    // 4. Update the user's purchased courses in your database (e.g. Supabase)

    // Mocking successful verification for this prototype
    console.log(`[Payment Verified] PaymentID: ${paymentId}, CourseID: ${courseId}`);

    // Set a mock cookie or session to grant access to the dashboard
    // In real app, this is handled by Supabase/NextAuth
    
    return NextResponse.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
