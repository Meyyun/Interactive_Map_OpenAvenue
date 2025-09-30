'use client'
import * as React from 'react';
import { useState } from 'react';
import Map, {Marker, Popup, Source, Layer,NavigationControl} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapData from './MapData';
import SearchBar from '../Search/SearchBar';
import LocationPinIcon from '@mui/icons-material/LocationPin';
const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
export default function MapContainer() {
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
    if (!TOKEN) {
    return (
      <div style={{ padding: '20px', border: '1px solid red', margin: '10px' }}>
        <h3>Map Error</h3>
        <p>Mapbox token not found. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file</p>
      </div>
    );
  }
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw', 
      height: '100vh',
      zIndex: 1
    }}>
      <Map
        mapboxAccessToken={TOKEN}
        initialViewState={{
          longitude: -74.006,
          latitude: 40.7128,
          zoom: 12
        }}
        style={{width: "100%", height: "100%"}}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        interactive={true}
      >
        {
          mapData.features
          .filter(feature => feature.geometry.type === "Point")
          .map((feature, idx) => (
          <Marker 
            key={idx}
            longitude={feature.geometry.coordinates[0]}
            latitude={feature.geometry.coordinates[1]} 
            anchor="bottom"  
            onClick={() => setSelectedMarker(feature)}
          >
            <div style={{color:'red', fontSize:'24px', cursor:'pointer'}}>
              <LocationPinIcon/>
            </div>
          </Marker>
          ))
        } 
        
        {selectedMarker && (
          <Popup 
            longitude={selectedMarker.geometry.coordinates[0]}
            latitude={selectedMarker.geometry.coordinates[1]}
            anchor="bottom"
            onClose={() => setSelectedMarker(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div dangerouslySetInnerHTML={{__html:selectedMarker.properties.description}}/>
          </Popup>
        )}
        <Source id="locations" type="geojson" data={mapData as any}>
          <Layer 
            id="location-circles"
            type="circle"
            paint={{
              'circle-radius': 12,
              'circle-color': '#ff6b6b',
              'circle-stroke-width': 3,
              'circle-stroke-color': '#ffffff',
              'circle-opacity': 0.8
            }}
          />
        </Source>
        <div style={{position:"absolute",top:0,left:100, zIndex:100,width:"300px",height:"80px",borderRadius:"8px" }}>
            <SearchBar />
        </div>
        <div style ={{position:'absolute',top:10,right:10}}>
            <NavigationControl />
        </div>
      </Map>
      
    </div>
  );
}