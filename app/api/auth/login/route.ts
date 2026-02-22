import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createAdminToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Admin er ikke konfigurert. Sett ADMIN_PASSWORD i .env.local' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Passord er påkrevd' },
        { status: 400 }
      );
    }

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { error: 'Feil passord' },
        { status: 401 }
      );
    }

    const token = createAdminToken();
    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error('Login-feil:', error);
    return NextResponse.json(
      { error: 'En feil oppstod' },
      { status: 500 }
    );
  }
}
