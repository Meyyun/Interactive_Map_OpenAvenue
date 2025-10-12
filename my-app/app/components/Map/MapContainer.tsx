'use client'
import * as React from 'react';
import { useState, useCallback } from 'react';
import Map, {Marker, Popup, Source, Layer, NavigationControl} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapData from './MapData';
import SearchBar from '../Search/SearchBar';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { sidebar as Sidebar } from '../Sidebar/sidebar';
import { useTestParcelIds } from '../../apollo/ReonomyProperties';
const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
export default function MapContainer() {
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [parcelId, setParcelId] = useState<string | number | null>(null);
  const [cursor, setCursor] = useState<string>('auto');
  const [hoveredParcelId, setHoveredParcelId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  // Test what parcel IDs are available in the database
  const { data: testData } = useTestParcelIds();

  if (!TOKEN) {
    return (
      <div style={{ padding: '20px', border: '1px solid red', margin: '10px' }}>
        <h3>Map Error</h3>
        <p>Mapbox token not found. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file</p>
      </div>
    );
  }
  const handleClick = React.useCallback((event)=>{
    try {
      if (!mapLoaded) {
        console.log("Map not fully loaded yet, skipping click");
        return;
      }

      const map = event.target;
      let features = [];
      
      try {
        // Try to query the parcel-fill layer specifically
        features = map.queryRenderedFeatures(event.point, {
          layers: ["parcel-fill"]
        });
      } catch (layerError) {
        console.log("Layer-specific query failed, trying all features:", layerError);
        
        // Fallback: query all features and filter by source
        try {
          const allFeatures = map.queryRenderedFeatures(event.point);
          features = allFeatures.filter(f => f.source === 'parcel');
        } catch (allError) {
          console.error("All features query failed:", allError);
          return;
        }
      }
      
      if (features.length > 0) {
        console.log("Full feature object:", features[0]);
        console.log("Feature ID:", features[0].id);
        console.log("Properties:", features[0].properties);
        
        // Use the GUID from properties.ID - this maps to reonomyProperties.parcel_id
        const clickedParcelId = features[0].properties?.ID;
        
        console.log("Mapbox Feature Properties.ID (maps to GraphQL parcel_id):", clickedParcelId);
        
        if (!clickedParcelId) {
          console.error("No ID found in feature properties!");
          return;
        }
        setParcelId(clickedParcelId);
        setShowSidebar(true);
        console.log("Setting parcelId to:", clickedParcelId);
      } else {
        console.log("No parcel features found at click point");
      }
    } catch (error) {
      console.error("Click handler error:", error);
    }
  }, [mapLoaded]);
  const handleMouseMove = useCallback((event)=>{
    if (!mapLoaded) return;
    
    try {
      const features = event.target.queryRenderedFeatures(event.point, {
        layers: ["parcel-fill"]
      });
      
      if (features.length > 0) {
        setHoveredParcelId(features[0].id);
      } else {
        setHoveredParcelId(null);
      }
    } catch (error) {
      // Silently handle mouse move errors
      setHoveredParcelId(null);
    }
  }, [mapLoaded]);

  const MouseEnter = useCallback(() => setCursor('pointer'), []);
  const MouseLeave = useCallback(() => setCursor('auto'), []);

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
        onClick={handleClick}
        cursor={cursor}
        onLoad={() => setMapLoaded(true)}
        onMouseEnter={MouseEnter}
        onMouseLeave={() => {
          MouseLeave();
          setHoveredParcelId(null);
        }}
        onMouseMove={handleMouseMove}
        interactiveLayerIds={['parcel-fill']}
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
        <div style ={{position:'absolute',top:10,right:10, display:'flex', flexDirection:'column', gap:'10px'}}>
            <NavigationControl />
            
            {/* Data Toggle Button */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#ffffff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontSize: '20px',
                color: parcelId ? '#007bff' : '#666'
              }}
              title={showSidebar ? "Hide Property Data" : "Show Property Data"}
              disabled={!parcelId}
            >
              {showSidebar ? <CloseIcon /> : <InfoIcon />}
            </button>
            
            {/* Selected Parcel Indicator */}
            {parcelId && (
              <div style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                maxWidth: '120px',
                wordBreak: 'break-all'
              }}>
                Parcel: {parcelId.toString().substring(0, 8)}...
              </div>
            )}
        </div>
       
      <Source 
        id ="parcel"
        type ="vector"
        url ="mapbox://svayser.parcel-boundaries"
        >
          <Layer
            id="parcel-line"
            type ="line"
            source-layer='attom-parcels'
            paint ={{
              'line-color':"lightblue",
              'line-width':5
            }}
          />
          <Layer
            id="parcel-fill"
            type="fill"
            source-layer='attom-parcels'
            paint={{
              'fill-color':[
              'case',
                ['==', ['id'], parcelId],    // clicked parcel gets highest priority
                "#4caf50",                    // clicked highlight color
                ['==', ['id'], hoveredParcelId], // hovered parcel
                "#6be1bc",
                "#de5656"
              ], //fill interior color
              'fill-opacity':0.5,//transparency
               'fill-outline-color':'#000000'
            }}
          >
          </Layer>
        </Source>
      </Map>
      
      {/* Sidebar Component */}
      {parcelId && showSidebar && <Sidebar parcelId={parcelId} />}
      
    </div>
  );
}