import { NextResponse } from 'next/server';
import { Client } from '@googlemaps/google-maps-services-js';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const input = url.searchParams.get('input') || '';
  const country = url.searchParams.get('country');
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!input.trim()) {
    return NextResponse.json({ predictions: [] }, { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  try {
    const client = new Client({});
    const params: any = { input, key: apiKey };
    if (country) params.components = `country:${country}`;
    const resp = await client.placeAutocomplete({ params, timeout: 3000 });
     const predictions =
      (resp.data?.predictions ?? []).map((p: any) => ({
        description: p.description,
        place_id: p.place_id,
      })) ?? [];
    return NextResponse.json({ predictions}, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
        { error: 'Autocomplete failed', details: err?.message }, { status: 500 });
  }
}