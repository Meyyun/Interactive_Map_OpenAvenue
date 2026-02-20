// Client-side helper for autocomplete, place details, reverse geocode
type Prediction = { description: string; place_id: string };
type PlaceDetails = { name: string; formatted_address: string; geometry: { location: { lat: number; lng: number } } };
type ReverseGeocodeResult = { address: string | null };

export async function autocomplete(input: string, country?: string): Promise<Prediction[]> {
  const params = new URLSearchParams({ input });
  if (country) params.set('country', country);
  const res = await fetch(`/api/places-autocomplete?${params.toString()}`);
  if (!res.ok) throw new Error('Autocomplete failed');
  const json = await res.json();
  return json.predictions || [];
}

export async function getPlaceDetails(place_id: string): Promise<PlaceDetails | null> {
  const res = await fetch(`/api/place-details?place_id=${encodeURIComponent(place_id)}`);
  if (!res.ok) throw new Error('Place details failed');
  const json = await res.json();
  return json.result || null;
}

export async function reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult> {
  const res = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
  if (!res.ok) throw new Error('Reverse geocode failed');
  const json = await res.json();
  return { address: json.address || null };
}