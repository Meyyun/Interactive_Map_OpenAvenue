// Extend window type for custom MapboxGL function
declare global {
  interface Window {
    getMapboxFeatureByCoordinates?: (lat: number, lng: number) => any;
  }
}
'use client'
import { useParcelIdFromTaxAssessor } from '../../apollo/TaxAssessors';
import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress } from '@mui/material';
import { geocodeAddress, type AddressSearchResult } from '../../utils/geocoding';
import { useParcelByLocation } from '../../apollo/ReonomyProperties';
import { usePropertyByParcelId } from '../../apollo/ReonomyProperties';
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
  const { fetchParcelId } = useParcelIdFromTaxAssessor();
  const { getPropertyByParcelId } = usePropertyByParcelId();
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
      // Get place details and coordinates first
      const details = await getPlaceDetails(prediction.place_id);
      if (!details) {
        setError('Could not get place details');
        return;
      }
      const coords = details.geometry.location;
      const latitude = Number(coords.lat);
      const longitude = Number(coords.lng);
      // Try TaxAssessor lookup for parcelId
      const taxParcelId = await fetchParcelId(latitude, longitude);
      let parcelId = null;
      if (taxParcelId) {
        console.log('[DEBUG] TaxAssessor parcelId:', taxParcelId);
        parcelId = taxParcelId;
      }
    setLoading(true);
    setError(null);
    setShowDropdown(false);
    setQuery(prediction.description);

    try {
      const details = await getPlaceDetails(prediction.place_id);
      console.log('[DEBUG] getPlaceDetails result:', details);
      if (!details) {
        setError('Could not get place details');
        console.error('[DEBUG] No details returned from getPlaceDetails');
        return;
      }

      const coords = details.geometry.location;
      const latitude = Number(coords.lat);
      const longitude = Number(coords.lng);

      console.log('[DEBUG] Place selected:', prediction.description);
      console.log('[DEBUG] Coordinates from Google Place Details:', { latitude, longitude });

      let parcelId = null;
      if (window.getMapboxFeatureByCoordinates) {
        const feature = window.getMapboxFeatureByCoordinates(latitude, longitude);
        console.log('[DEBUG] Mapbox feature found for coords:', feature);
        parcelId = feature?.properties?.ID || null;
        console.log('[DEBUG] Mapbox feature parcelId:', parcelId);
      } else {
        console.log('[DEBUG] window.getMapboxFeatureByCoordinates not available');
      }

      if (!parcelId) {
        console.log('[DEBUG] No parcelId from Mapbox, trying GraphQL parcel lookup...');
        const result = await getParcelByLocation({ variables: { latitude, longitude } });
        console.log('[DEBUG] GraphQL getParcelByLocation result:', result);
        parcelId =
          (result.data as any)?.executeGetParcelByLocation?.parcel_id ??
          (result.data as any)?.executeGetParcelByLocation?.ID;
        console.log('[DEBUG] GraphQL parcelId:', parcelId);
        if (parcelId) {
          // Fetch property data by parcelId and log it
          const propertyResult = await getPropertyByParcelId(parcelId);
          console.log('[DEBUG] Property data for parcelId:', parcelId, propertyResult);
        }
      }

      console.log('[DEBUG] Final parcelId to pass to sidebar:', parcelId);
      console.log('[DEBUG] Address to pass to sidebar:', details.formatted_address);
      if (onAddressSelect) {
        onAddressSelect({
          parcelId: parcelId || '',
          coordinates: { latitude, longitude },
          address: details.formatted_address,
        });
      }
      if (parcelId && parcelId !== "null" && parcelId !== "undefined" && parcelId !== "") {
        setQuery('');
        console.log('[DEBUG] Valid parcelId found, clearing query.');
      } else {
        setError('No property found at this location. Please try another address or check the map.');
        console.error('[DEBUG] Invalid parcelId:', parcelId);
        console.error('[DEBUG] Coordinates:', { latitude, longitude });
      }
    } catch (err) {
      setError('Search failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('[DEBUG] Error in handleSuggestionSelect:', err);
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
      // Try TaxAssessor lookup for parcelId
      const taxParcelId = await fetchParcelId(latitude, longitude);
      if (taxParcelId) {
        console.log('[DEBUG] TaxAssessor parcelId (manual search):', taxParcelId);
        parcelId = taxParcelId;
      }
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const coordinates = await geocodeAddress(query);
      console.log('[DEBUG] geocodeAddress result:', coordinates);
      const latitude = Number(coordinates.latitude);
      const longitude = Number(coordinates.longitude);

      console.log('[DEBUG] Geocoded address:', query);
      console.log('[DEBUG] Coordinates from geocodeAddress:', { latitude, longitude });

      const result = await getParcelByLocation({ variables: { latitude, longitude } });
      console.log('[DEBUG] GraphQL getParcelByLocation result (manual search):', result);
      const parcelId =
        (result.data as any)?.executeGetParcelByLocation?.parcel_id ??
        (result.data as any)?.executeGetParcelByLocation?.ID;
      console.log('[DEBUG] GraphQL parcelId (manual search):', parcelId);
        if (parcelId) {
          // Fetch property data by parcelId and log it
          const propertyResult = await getPropertyByParcelId(parcelId);
          console.log('[DEBUG] Property data for parcelId (manual search):', parcelId, propertyResult);
        }

      if (parcelId && onAddressSelect) {
        console.log('[DEBUG] Passing parcelId to sidebar:', parcelId);
        onAddressSelect({
          parcelId,
          coordinates: { latitude, longitude },
          address: query,
        });
        setQuery('');
        console.log('[DEBUG] Valid parcelId found, clearing query.');
      } else {
        setError('No parcel    found at this location');
        console.error('[DEBUG] Invalid parcelId (manual search):', parcelId);
        console.error('[DEBUG] Coordinates:', { latitude, longitude });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError('Search failed: ' + message);
      console.error('[DEBUG] Error in handleSearch:', err);
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
