# An Interactive Map Application for Real Estate Prospecting

# Description

This project is designed to empower real estate brokers with data-driven insights and search capabilities, enabling them to efficiently identify new leads and prospects.

Live Demo (Vercel Build):
👉 https://your-vercel-app.vercel.app

echnologies and Tools
🗺️ Mapbox GL

Used to render interactive maps and visualize property boundaries dynamically.
Custom tilesets were created and hosted in Mapbox Studio to display parcel and zoning data.

Mapbox Studio: https://studio.mapbox.com/

Mapbox GL JS Docs: https://docs.mapbox.com/mapbox-gl-js/api/

⚛️ GraphQL + Apollo Client

Why GraphQL: Simplifies data fetching by allowing the frontend to query exactly the fields it needs.

Apollo Client: Handles caching and query management for a seamless and responsive UI experience.

The app uses custom GraphQL hooks:

useParcelByLocation()

usePropertyByParcelId()
These functions fetch data from Azure’s GraphQL endpoint.

📚 Reference: Apollo Client Documentation

☁️ Azure Data API Builder

The backend GraphQL layer is powered by Azure Data API Builder for SQL databases, enabling rapid deployment of a scalable GraphQL endpoint.
It connects property datasets directly to the frontend via Apollo Client.

📚 Reference: Azure Data API Builder

🗺️ Google APIs

Used for address search, geocoding, and place details within the custom search bar component.

Places API (Autocomplete): Suggests addresses as users type.

Place Details API: Fetches precise coordinates (lat/lng) for selected addresses.

Geocoding API: Converts geographic coordinates into readable addresses.

Street View API (optional): Can be integrated to show panoramic street-level images.
