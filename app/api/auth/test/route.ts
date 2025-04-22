import { NextResponse } from 'next/server';

export async function GET() {
  const maskValue = (value: string | undefined): string | boolean => {
    if (!value) return false;
    if (value.length <= 6) return `${value.substring(0, 2)}****`;
    return `${value.substring(0, 3)}****${value.substring(value.length - 3)}`;
  };

  const response = {
    environment: process.env.NODE_ENV,
    variables: {
      nextAuthUrl: maskValue(process.env.NEXTAUTH_URL),
      nextAuthSecret: maskValue(process.env.NEXTAUTH_SECRET),
      adminUsername: maskValue(process.env.ADMIN_USERNAME),
      adminPassword: maskValue(process.env.ADMIN_PASSWORD),
      adminPasswordHash: maskValue(process.env.ADMIN_PASSWORD_HASH),
    }
  };
  
  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}