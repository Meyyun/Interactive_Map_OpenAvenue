import { NextResponse } from "next/server";
import { Client } from "@googlemaps/google-maps-services-js";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const place_id = url.searchParams.get("place_id");
  const key = process.env.GOOGLE_MAPS_API_KEY;

  if (!key) {
    return NextResponse.json({ error: "Missing GOOGLE_MAPS_API_KEY" }, { status: 500 });
  }
  if (!place_id) {
    return NextResponse.json({ error: "Missing place_id" }, { status: 400 });
  }

  try {
    const client = new Client({});
    const r = await client.placeDetails({
      params: { place_id, key },
      timeout: 3000,
    });

    // Ensure the shape your client expects: { result: { name, formatted_address, geometry:{location:{lat,lng}} } }
    const result = r.data?.result ?? null;
    if (!result) return NextResponse.json({ result: null }, { status: 200 });

    // Some responses may return functions for lat/lng (rare with this SDK), normalize to numbers:
    const loc = result.geometry?.location;
    const lat = typeof loc?.lat === "function" ? (loc!.lat as () => number)() : loc?.lat;
    const lng = typeof loc?.lng === "function" ? (loc!.lng as () => number)() : loc?.lng;

    return NextResponse.json(
      {
        result: {
          name: result.name,
          formatted_address: result.formatted_address,
          geometry: { location: { lat, lng } },
        },
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: "Place details failed", details: e?.response?.data ?? e?.message },
      { status: 500 }
    );
  }
}
