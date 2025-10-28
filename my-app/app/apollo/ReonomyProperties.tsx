"use client";
import { gql } from "@apollo/client";
import { useQuery, useLazyQuery } from "@apollo/client/react";

// Query to get parcel ID by coordinates (for address search)
export const GET_PARCEL = gql`
  query getParcel($latitude: Float!, $longitude: Float!) {
    executeGetParcelByLocation(longitude: $longitude, latitude: $latitude) {
      parcel_id: ID
      latitude
      longitude
    }
  }
`;
// Query to get property by parcel ID (for address search results)
export const GET_PROPERTY = gql`
  query getProperty($parcelId: String!) {
    reonomyProperties(filter: {parcel_id: {eq: $parcelId}}) {
      items {
        address_line1
      }
    }
  }
`;

// Main GraphQL query using correct filter syntax
export const GET_PROPERTY_BY_PROPERTY_ID = gql`
  query GetPropertyByParcelId($filter: ReonomyPropertyFilterInput) {
    reonomyProperties(filter: $filter) {
      items {
        property_id
        parcel_id
        asset_type
        municipality
        year_built
        building_area
        lot_size_sqft
        lot_size_acres
        zoning
        floors
        total_units
        commercial_units
        residential_units
      }
    }
  }
`;

export type PropertyData = {
  // Basic Info
  property_id: string;
  parcel_id?: string;
  
  // Building Information
  year_built?: number;
  year_renovated?: number;
  floors?: number;
  sum_buildings_nbr?: number;
  existing_floor_area_ratio?: number;
  commercial_units?: number;
  residential_units?: number;
  total_units?: number;
  building_area?: number;
  max_floor_plate?: number;
  building_class?: string;
  
  // Lot Information
  asset_type?: string;
  lot_size_sqft?: number;
  lot_size_acres?: number;
  zoning?: string;
  lot_size_depth_feet?: number;
  lot_size_frontage_feet?: number;
  census_tract?: string;
  opp_zone?: boolean;
  frontage?: number;
  depth?: number;
  
  // Location Information
  msa_name?: string;
  fips_county?: string;
  municipality?: string;
  mcd_name?: string;
  neighborhood_name?: string;
  legal_description?: string;
  
  // Zoning Information
  zoning_district_1?: string;
  zoning_district_2?: string;
  special_purpose_district?: string;
  split_boundary?: boolean;
  sanborn_map_number?: string;
  zoning_map_number?: string;
  
  [key: string]: any;
};

export type ReonomyQueryResponse = {
  reonomyProperties: {
    items: PropertyData[];
  };
};

// Main hook: takes parcelId from Mapbox, queries by property_id in GraphQL
export function usePropertyData(parcelId: string | number | null) {
  const idString = parcelId == null ? null : String(parcelId).trim();

  console.log("🚀 usePropertyData called with parcelId (from Mapbox):", { parcelId, idString });
  console.log("📡 This will query GraphQL using property_id field");
  console.log("🔍 Will skip query:", !idString);
  
  const { loading, error, data } = useQuery<ReonomyQueryResponse>(GET_PROPERTY_BY_PROPERTY_ID, {
    variables: { 
      filter: { 
        parcel_id: { eq: idString } 
      } 
    }, // Mapbox parcelId matches GraphQL parcel_id
    skip: !idString, // Only run when we have a parcel ID
    fetchPolicy: "no-cache", // Force fresh data
    errorPolicy: "all",
  });

  console.log("📊 Property Query state:", { 
    loading, 
    error: error?.message, 
    hasData: !!data,
    dataLength: data?.reonomyProperties?.items?.length,
    variables: { filter: { parcel_id: { eq: idString } } }
  });

  if (error) {
    console.error("❌ PROPERTY QUERY FAILED:", error.message);
    console.error("Full error:", error);
    console.error("Variables used:", { filter: { parcel_id: { eq: idString } } });
  }
  
  if (data) {
    console.log("✅ PROPERTY QUERY SUCCESS:", data);
    console.log("🔍 Items found:", data.reonomyProperties?.items?.length);
    if (data.reonomyProperties?.items?.length > 0) {
      console.log("Property details:", data.reonomyProperties.items[0]);
    }
  }

  // Get the first (and should be only) property from the filtered results
  const property = data?.reonomyProperties?.items?.[0] || null;
  console.log("🏠 Found matching property:", property ? "✅ YES" : "❌ NO");
  if (property) {
    console.log("Property details:", property);
  }

  return {
    loading,
    error,
    property,
  };
}

// Hook for address search - get parcel ID by coordinates
export function useParcelByLocation() {
  const [getParcelByLocation] = useLazyQuery(GET_PARCEL, {
    fetchPolicy: "no-cache",
    errorPolicy: "all"
  });

  return { getParcelByLocation };
}

// Hook for address search - get property details by parcel ID
export function usePropertyByParcelId() {
  const [getPropertyByParcelId] = useLazyQuery(GET_PROPERTY, {
    fetchPolicy: "no-cache", 
    errorPolicy: "all"
  });

  return { getPropertyByParcelId };
}

