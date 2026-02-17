import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
  try {
    const { urls, zipFilename } = await request.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'Mangler bilder' }, { status: 400 });
    }

    const zip = new JSZip();

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const ext = url.includes('.png') ? 'png' : 'jpg';
      const filename = `bilde_${i + 1}.${ext}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Kunne ikke hente bilde ${i + 1}`);
      }
      const blob = await response.blob();
      zip.file(filename, blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const buffer = Buffer.from(await zipBlob.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename || 'bilder.zip'}"`,
      },
    });
  } catch (error) {
    console.error('Feil ved nedlasting:', error);
    return NextResponse.json(
      { error: 'Kunne ikke lage zip-fil' },
      { status: 500 }
    );
  }
}
