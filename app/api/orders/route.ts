import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

export interface DeliveryAddress {
  street: string;
  postalCode: string;
  city: string;
}

export interface Order {
  id: string;
  customerName: string;
  packageSize: number;
  images: string[];
  deliveryAddress?: DeliveryAddress;
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Vercel Blob er ikke konfigurert' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { customerName, packageSize, images, deliveryAddress } = body;

    // Validering
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Kundenavn er påkrevd' },
        { status: 400 }
      );
    }

    if (!packageSize || ![6, 9, 12].includes(packageSize)) {
      return NextResponse.json(
        { error: 'Ugyldig pakkestørrelse' },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images) || images.length !== packageSize) {
      return NextResponse.json(
        { error: `Antall bilder må være nøyaktig ${packageSize}` },
        { status: 400 }
      );
    }

    // Opprett bestillingsobjekt
    const order: Order = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      customerName: customerName.trim(),
      packageSize,
      images,
      ...(deliveryAddress && {
        deliveryAddress: {
          street: deliveryAddress.street?.trim() || '',
          postalCode: deliveryAddress.postalCode?.trim() || '',
          city: deliveryAddress.city?.trim() || '',
        },
      }),
      createdAt: new Date().toISOString(),
    };

    // Lagre bestilling til Vercel Blob
    // Filnavn: orders/Kundenavn_PakkeStørrelse_UnikID.json
    // Dette gjør det enkelt å se i Vercel Blob:
    // - Hvem som har bestilt (kundenavn)
    // - Hvilken pakkestørrelse (6, 9 eller 12)
    // - Unik ID for hver pakke (sikrer at to pakker med samme størrelse ikke blandes)
    const sanitizedCustomerName = order.customerName.replace(/[^a-zA-Z0-9æøåÆØÅ_-]/g, '_');
    const fileName = `orders/${sanitizedCustomerName}_${order.packageSize}magneter_${order.id}.json`;
    const orderJson = JSON.stringify(order, null, 2);

    const blob = await put(fileName, orderJson, {
      access: 'public',
      contentType: 'application/json',
      // Legg til metadata for enklere søking og organisering i Vercel Dashboard
      addRandomSuffix: false,
    });

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        blobUrl: blob.url,
      },
    });
  } catch (error) {
    console.error('Feil ved lagring av bestilling:', error);
    return NextResponse.json(
      {
        error: 'Kunne ikke lagre bestillingen',
        details: error instanceof Error ? error.message : 'Ukjent feil',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Vercel Blob er ikke konfigurert' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const customerName = searchParams.get('customerName');

    // Hent alle filer fra orders-mappen
    const { blobs } = await list({
      prefix: 'orders/',
    });

    // Hent innholdet fra hver fil
    const orders: Order[] = [];
    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url);
        if (response.ok) {
          const order: Order = await response.json();
          // Filtrer på kundenavn hvis spesifisert
          if (!customerName || order.customerName.toLowerCase().includes(customerName.toLowerCase())) {
            orders.push(order);
          }
        }
      } catch (err) {
        console.error(`Feil ved henting av bestilling ${blob.pathname}:`, err);
      }
    }

    // Sorter etter dato (nyeste først)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error('Feil ved henting av bestillinger:', error);
    return NextResponse.json(
      { error: 'Kunne ikke hente bestillinger', details: error instanceof Error ? error.message : 'Ukjent feil' },
      { status: 500 }
    );
  }
}

