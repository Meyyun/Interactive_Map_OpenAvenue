# An Interactive Map Application for Real Estate Prospecting

# Description

This project is designed to empower real estate brokers with data-driven insights and search capabilities, enabling them to efficiently identify new leads and prospects.

Live Demo:
    <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/9cb5826ab6dc48d0b5ebbcf6ce8b9628-b37e13a2c4f590b2-full-play.gif">
# echnologies and Tools
🗺️ Mapbox GL

Used to render interactive maps and visualize property boundaries dynamically.
Custom tilesets were created and hosted in Mapbox Studio to display parcel and zoning data.

Mapbox Studio: https://studio.mapbox.com/

Mapbox GL JS Docs: https://docs.mapbox.com/mapbox-gl-js/api/

⚛️ GraphQL + Apollo Client

Simplifies data fetching by allowing the frontend to query exactly the fields it needs -no ore under or over fetching.

Apollo Client: Handles caching and query management for a seamless and responsive UI experience.

The app uses custom GraphQL hooks:

useParcelByLocation() -> Fetch parcel information based on map location

usePropertyByParcelId() -> Retrieves property data by parcel ID
These functions fetch data from Azure’s GraphQL endpoint.

📚 Reference: Apollo Client Documentation:https://www.apollographql.com/docs/react

☁️ Azure Data API Builder

The backend GraphQL layer is powered by Azure Data API Builder for SQL databases, enabling rapid deployment of a scalable GraphQL endpoint.
It connects property datasets directly to the frontend via Apollo Client.

🗺️ Google APIs

Used for address search, geocoding, and place details within the custom search bar component.

Places API (Autocomplete): Suggests addresses as users type.

Place Details API: Fetches precise coordinates (lat/lng) for selected addresses.

Geocoding API: Converts geographic coordinates into readable addresses.

Street View API (optional): Can be integrated to show panoramic street-level images.
