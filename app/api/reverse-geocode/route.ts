import { NextResponse } from 'next/server';
import { Client } from '@googlemaps/google-maps-services-js';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = url.searchParams.get('lat');
  const lng = url.searchParams.get('lng');
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing lat/lng' }, { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  try {
    const client = new Client({});
    const resp = await client.reverseGeocode({
      params: { latlng: `${lat},${lng}`, key: apiKey },
      timeout: 3000,
    });
    const results = resp.data?.results ?? [];
    const address = results[0]?.formatted_address ?? null;
    return NextResponse.json({ address, results }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Reverse geocode failed', details: err?.message }, { status: 500 });
  }
}