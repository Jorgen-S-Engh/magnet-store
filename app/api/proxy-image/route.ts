import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Krever innlogging' }, { status: 401 });
  }

  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Mangler url' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Kunne ikke hente bilde');
    }
    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="bilde.jpg"`,
      },
    });
  } catch (error) {
    console.error('Feil ved henting av bilde:', error);
    return NextResponse.json({ error: 'Kunne ikke hente bilde' }, { status: 500 });
  }
}
