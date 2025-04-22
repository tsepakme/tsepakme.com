import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'app/api/auth/options';
import { csrf } from 'lib/csrf';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const csrfToken = csrf.generate();
  
  return NextResponse.json({ csrfToken });
}