'use client'
import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress } from '@mui/material';
import { geocodeAddress, type AddressSearchResult } from '../../utils/geocoding';
import { useParcelByLocation } from '../../apollo/ReonomyProperties';
import { autocomplete, getPlaceDetails } from '../../utils/googlePlacesClient';

interface SearchBarProps {
  onAddressSelect?: (result: AddressSearchResult) => void;
}

const DEBUG = true; // ← Toggle this ON/OFF for console debugging

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '18px',
  backgroundColor: '#e3f2fd',
  '&:hover': { backgroundColor: '#bbdefb' },
  marginLeft: 0,
  width: '400px',
  [theme.breakpoints.up('sm')]: { width: '350px' },
}));

const SearchIconWrapper = styled('button')(({ theme }) => ({
  all: 'unset',
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': { width: '25ch' },
    },
  },
}));

export default function SearchBar({ onAddressSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { getParcelByLocation } = useParcelByLocation();
  const handleLocationSelect = async (latitude: number, longitude: number) => {
  const result = await getParcelByLocation({ variables: { latitude, longitude } });
  const parcel = (result.data as any)?.executeGetParcelByLocation;
  const parcelInfo = {
    ID: parcel?.parcel_id || parcel?.ID,
    LATITUDE: parcel?.latitude || latitude,
    LONGITUDE: parcel?.longitude || longitude,
  };
  // Use parcelInfo as needed (e.g., set state, pass to sidebar)
  console.log(parcelInfo);
};
  // Handle input → autocomplete
  React.useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await autocomplete(query, 'us');
        setSuggestions(results);
        setShowDropdown(true);
      } catch {
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);

  // Select suggestion → fetch details → query parcel
  const handleSuggestionSelect = async (prediction: any) => {
    setLoading(true);
    setError(null);
    setShowDropdown(false);
    setQuery(prediction.description);

    try {
      const details = await getPlaceDetails(prediction.place_id);
      if (!details) {
        setError('Could not get place details');
        return;
      }

      const coords = details.geometry.location;
      const latitude = Number(coords.lat);
      const longitude = Number(coords.lng);

      if (DEBUG) {
        console.log('📍 [DEBUG] Place selected:', prediction.description);
        console.log('🌎 [DEBUG] Coordinates from Google Place Details:', { latitude, longitude });
      }

      // Try to find the Mapbox feature at these coordinates (pseudo-code, you may need to adapt)
      // This assumes you have access to map features or a helper to get the feature by coordinates
      let parcelId = null;
      if (window.getMapboxFeatureByCoordinates) {
        const feature = window.getMapboxFeatureByCoordinates(latitude, longitude);
        parcelId = feature?.properties?.ID || null;
        if (DEBUG) console.log('🔗 [DEBUG] Mapbox feature found for coords:', feature);
      }

      // Fallback: use GraphQL lookup if no Mapbox feature found
      if (!parcelId) {
        const result = await getParcelByLocation({ variables: { latitude, longitude } });
        parcelId =
          (result.data as any)?.executeGetParcelByLocation?.parcel_id ??
          (result.data as any)?.executeGetParcelByLocation?.ID;
        if (DEBUG) {
          console.log('🧭 [DEBUG] GraphQL Parcel Lookup Result:', result.data);
        }
      }

      // Always pass address to sidebar, even if parcelId is missing
      if (onAddressSelect) {
        onAddressSelect({
          parcelId: parcelId || '',
          coordinates: { latitude, longitude },
          address: details.formatted_address,
        });
      }
      if (parcelId && parcelId !== "null" && parcelId !== "undefined" && parcelId !== "") {
        setQuery('');
      } else {
        setError('No property found at this location. Please try another address or check the map.');
        if (DEBUG) {
          console.error('❌ [DEBUG] Invalid parcelId:', parcelId);
          console.error('❌ [DEBUG] Coordinates:', { latitude, longitude });
          console.error('❌ [DEBUG] Last GraphQL response:', result?.data);
        }
      }
    } catch (err) {
      setError('Search failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
      if (DEBUG) console.error('❌ [DEBUG] Error in handleSuggestionSelect:', err);
    } finally {
      setLoading(false);
    }
  };

  // Enter key → fallback direct geocode
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setShowDropdown(false);
      handleSearch();
    }
  };

  // Manual search fallback
  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const coordinates = await geocodeAddress(query);
      const latitude = Number(coordinates.latitude);
      const longitude = Number(coordinates.longitude);

      if (DEBUG) {
        console.log('🔍 [DEBUG] Geocoded address:', query);
        console.log('🌎 [DEBUG] Coordinates from geocodeAddress:', { latitude, longitude });
      }

      const result = await getParcelByLocation({ variables: { latitude, longitude } });
      const parcelId =
        (result.data as any)?.executeGetParcelByLocation?.parcel_id ??
        (result.data as any)?.executeGetParcelByLocation?.ID;

      if (DEBUG) {
        console.log('🧭 [DEBUG] GraphQL Parcel Lookup Result (manual search):', result.data);
      }

      if (parcelId && onAddressSelect) {
        onAddressSelect({
          parcelId,
          coordinates: { latitude, longitude },
          address: query,
        });
        setQuery('');
      } else {
        setError('No parcel    found at this location');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError('Search failed: ' + message);
      if (DEBUG) console.error('❌ [DEBUG] Error in handleSearch:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '10px 0' }}>
      <Search>
        <SearchIconWrapper onClick={handleSearch}>
          {loading ? <CircularProgress size={20} /> : <SearchIcon />}
        </SearchIconWrapper>

        <StyledInputBase
          placeholder="Search address"
          inputProps={{ 'aria-label': 'search' }}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        {showDropdown && suggestions.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              background: '#fff',
              border: '1px solid #ccc',
              zIndex: 10,
              maxHeight: '200px',
              overflowY: 'auto',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {suggestions.map((s, idx) => (
              <div
                key={s.place_id}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: idx < suggestions.length - 1 ? '1px solid #eee' : 'none',
                  background: '#fff',
                  fontSize: '15px',
                }}
                onClick={() => handleSuggestionSelect(s)}
              >
                {s.description}
              </div>
            ))}
          </div>
        )}
      </Search>

      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}
