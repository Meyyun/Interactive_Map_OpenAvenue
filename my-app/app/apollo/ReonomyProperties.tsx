"use client";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export const GET_ALL_PARCEL_IDS = gql`
  query GetAllParcelIds {
    reonomyProperties {
      items {
        parcel_id
        asset_type
        building_area
        year_built
      }
    }
  }
`;

export const GET_REONOMY_BY_PARCEL = gql`
  query GetReonomyByParcel {
    reonomyProperties {
      items {
        # Basic Info
        parcel_id
        
        # Building Information
        year_built
        year_renovated
        floors
        sum_buildings_nbr
        existing_floor_area_ratio
        commercial_units
        residential_units
        total_units
        building_area
        max_floor_plate
        building_class
        frontage
        depth
        
        # Lot Information
        asset_type
        lot_size_sqft
        lot_size_acres
        zoning
        lot_size_depth_feet
        lot_size_frontage_feet
        census_tract
        opp_zone
        
        # Location Information
        msa_name
        fips_county
        municipality
        mcd_name
        neighborhood_name
        legal_description
        
        # Zoning Information
        zoning_district_1
        zoning_district_2
        special_purpose_district
        split_boundary
        sanborn_map_number
        zoning_map_number
      }
    }
  }
`;

export type PropertyData = {
  // Basic Info
  parcel_id: string;
  
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
  frontage?: number;
  depth?: number;
  
  // Lot Information
  asset_type?: string;
  lot_size_sqft?: number;
  lot_size_acres?: number;
  zoning?: string;
  lot_size_depth_feet?: number;
  lot_size_frontage_feet?: number;
  census_tract?: string;
  opp_zone?: boolean;
  
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

// ✅ Fetch some test parcel IDs
export function useTestParcelIds() {
  const { loading, error, data } = useQuery<ReonomyQueryResponse>(
    GET_ALL_PARCEL_IDS,
    { 
      fetchPolicy: "no-cache" // Force fresh data
    }
  );
  
  console.log("useTestParcelIds - Loading:", loading, "Error:", error?.message, "HasData:", !!data);
  
  if (data) {
    console.log("✅ TEST QUERY SUCCESS - Available parcel IDs:", data.reonomyProperties.items);
  }
  if (error) {
    console.error("❌ TEST QUERY FAILED:", error.message);
  }
  
  return { loading, error, data };
}

export function usePropertyData(parcelId: string | number | null) {
  const parcelIdString = parcelId ? String(parcelId) : null;
  
  console.log("🚀 usePropertyData called with:", { parcelId, parcelIdString });
  
  const { loading, error, data } = useQuery<ReonomyQueryResponse>(GET_REONOMY_BY_PARCEL, {
    skip: !parcelIdString, // Only run when we have a parcel ID
    fetchPolicy: "no-cache", // Force fresh data
    errorPolicy: "all",
  });

  console.log("📊 Query state:", { 
    loading, 
    error: error?.message, 
    hasData: !!data,
    dataLength: data?.reonomyProperties?.items?.length 
  });

  if (error) {
    console.error("❌ PROPERTY QUERY FAILED:", error.message);
    console.error("Full error:", error);
  }
  
  if (data) {
    console.log("✅ PROPERTY QUERY SUCCESS:", data);
    console.log("🔍 All parcel IDs in response:", data.reonomyProperties?.items?.map(p => p.parcel_id));
    console.log("🎯 Looking for parcel_id:", parcelIdString);
    
    // Find the specific property by parcel_id
    const property = data.reonomyProperties?.items?.find(p => p.parcel_id === parcelIdString);
    console.log("🏠 Found matching property:", property ? "✅ YES" : "❌ NO");
    if (property) {
      console.log("Property details:", property);
    }
  }

  // Filter to find the specific property
  const property = parcelIdString && data?.reonomyProperties?.items 
    ? data.reonomyProperties.items.find(p => p.parcel_id === parcelIdString) 
    : null;

  return {
    loading,
    error,
    property,
  };
}
