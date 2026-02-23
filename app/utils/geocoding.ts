// Alternative geocoding without Google Maps API
// Uses OpenStreetMap Nominatim service (free, no API key required)

// Declare Google Maps types for window object
declare global {
  interface Window {
    google?: any;
    initGoogleMaps?: () => void;
  }
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface AddressSearchResult {
  parcelId: string;
  coordinates: Coordinates;
  address: string;
}

// Fallback geocoding using OpenStreetMap Nominatim (free service)
export const geocodeAddressFree = async (address: string): Promise<Coordinates> => {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Interactive-Map-App/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    } else {
      throw new Error('No results found for this address');
    }
  } catch (error) {
    throw new Error(`Geocoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Google Maps geocoding (requires valid API key)
// Google Maps geocoding via HTTP request (requires valid API key)
export const geocodeAddressGoogleHTTP = async (address: string): Promise<Coordinates> => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    throw new Error('Google API key not configured');
  }

  const encoded = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${key}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Google Geocoding HTTP error: ${res.status}`);
  }

  const body = await res.json();
  // body.status can be 'OK', 'ZERO_RESULTS', 'OVER_QUERY_LIMIT', 'REQUEST_DENIED', 'INVALID_REQUEST', 'UNKNOWN_ERROR'
  if (body.status === 'OK' && body.results && body.results.length > 0) {
    const loc = body.results[0].geometry.location;
    return { latitude: parseFloat(String(loc.lat)), longitude: parseFloat(String(loc.lng)) };
  }

  const msg = body.error_message ? `${body.status}: ${body.error_message}` : body.status;
  throw new Error(`Google geocoding failed: ${msg}`);
};

// Main geocoding function - tries Google first, falls back to free service
export const geocodeAddress = async (address: string): Promise<Coordinates> => {
  // Prefer Google HTTP geocoding if API key available, otherwise use free service
  try {
    return await geocodeAddressGoogleHTTP(address);
  } catch (googleError) {
    // Log the google error and fall back
    console.warn('Google geocoding failed, falling back to free service:', googleError instanceof Error ? googleError.message : googleError);
    return await geocodeAddressFree(address);
  }
};

// Simple initialization (no Google Maps required for fallback)
export const initializeGoogleMaps = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google) {
      resolve(window.google);
      return;
    }

    // Create callback function
    window.initGoogleMaps = () => {
      resolve(window.google);
    };

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.log("Google Maps failed to load, will use fallback geocoding");
      resolve(null); // Don't reject, just resolve with null
    };

    // Add to document
    document.head.appendChild(script);
  });
};