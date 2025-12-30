import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Sjekk om token er satt opp
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { 
          error: 'Vercel Blob er ikke konfigurert. Se README.md for instruksjoner.',
          hint: 'Du trenger BLOB_READ_WRITE_TOKEN i .env.local filen eller i Vercel Dashboard'
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Ingen fil ble sendt' },
        { status: 400 }
      );
    }

    // Valider filtype
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Kun bilder er tillatt' },
        { status: 400 }
      );
    }

    // Valider filstørrelse (4.5 MB limit for server uploads)
    const maxSize = 4.5 * 1024 * 1024; // 4.5 MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Filen er for stor. Maksimal størrelse er 4.5 MB for server uploads.' },
        { status: 400 }
      );
    }

    // Last opp til Vercel Blob
    // Bruker file direkte som Vercel anbefaler
    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error('Feil ved opplasting:', error);
    return NextResponse.json(
      { 
        error: 'Kunne ikke laste opp filen',
        details: error instanceof Error ? error.message : 'Ukjent feil'
      },
      { status: 500 }
    );
  }
}

