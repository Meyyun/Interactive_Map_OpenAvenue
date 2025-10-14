'use client'
import * as React from 'react';
import { useState, useCallback } from 'react';
import Map, {Marker, Popup, Source, Layer, NavigationControl} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapData from './MapData';
import SearchBar from '../Search/SearchBar';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import { Sidebar } from '../Sidebar/sidebar';
const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
export default function MapContainer() {

  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  const [parcelId, setParcelId] = useState<string | number | null>(null);
  const [cursor, setCursor] = useState<string>('auto');
  const [hoveredParcelId, setHoveredParcelId] = useState<string | null>(null);

  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

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
            <div 
              style={{color: 'black'}} 
              dangerouslySetInnerHTML={{__html:selectedMarker.properties.description}}
            />
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
        <div style={{position:"absolute",top:0,left:100, zIndex:100,width:"300px",height:"80px",borderRadius:"8px",color:"black" }}>
            <SearchBar />
        </div>
        <div style ={{position:'absolute',top:10,right:15, display:'flex', flexDirection:'column', gap:'10px'}}>
            <NavigationControl /> 
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
      {(() => {
        console.log("Render check - parcelId:", parcelId, "showSidebar:", showSidebar);
        return showSidebar ? (
          <Sidebar 
            parcelId={parcelId} 
            onClose={() => {
              setShowSidebar(false);
              setParcelId(null);
            }} 
          />
        ) : null;
      })()}
      
    </div>
  );
}