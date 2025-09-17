import * as React from 'react';
import Map from 'react-map-gl/mapbox';
// If using with mapbox-gl v1:
// import Map from 'react-map-gl/mapbox-legacy';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function map() {
  return (
    <Map
      mapboxAccessToken="<pk.eyJ1IjoibWV5eXVuIiwiYSI6ImNtZm5jbnVwNDBiZjUyb3BybjJ1a3hiejEifQ.AHFOm0oOKwi586-RpHrrmA>"
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14
      }}
      style={{width: 600, height: 400}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
}