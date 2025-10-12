import React from "react";
import { usePropertyData } from "../../apollo/ReonomyProperties";

export const sidebar = ({ parcelId }: { parcelId: string | number | null }) => {
    console.log("Sidebar received parcelId:", parcelId);
    const { loading, error, property } = usePropertyData(parcelId);

    if (!parcelId) {
        return <div>No parcel selected</div>;
    }
    if (loading) {
        return <div>Loading property data...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    if (!property) {
        return <div>No Property Data Found</div>;
    }

    // Helper function to format display values
    const formatValue = (value: any): string => {
        if (value === null || value === undefined || value === '') return 'N/A';
        if (typeof value === 'number') return value.toLocaleString();
        return String(value);
    };

    // Helper function to create a property row
    const PropertyRow = ({ label, value, unit }: { label: string; value: any; unit?: string }) => {
        if (value === null || value === undefined || value === '') return null;
        
        let displayValue = formatValue(value);
        if (unit) displayValue += ` ${unit}`;
        
        return (
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>{label}:</span>
                <span>{displayValue}</span>
            </div>
        );
    };

    return (
        <div style={{ padding: '16px', maxHeight: '100vh', overflowY: 'auto' }}>
            <h2>Property Details</h2>
            <div style={{ marginBottom: '16px' }}>
                <strong>Parcel ID:</strong> {parcelId}
            </div>

            {/* Building Information */}
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>Building Info</h3>
                <PropertyRow label="Year Built" value={property.year_built} />
                <PropertyRow label="Year Renovated" value={property.year_renovated} />
                <PropertyRow label="Floors" value={property.floors} />
                <PropertyRow label="Sum Buildings Number" value={property.sum_buildings_nbr} />
                <PropertyRow label="Building Area" value={property.building_area} unit="sq ft" />
                <PropertyRow label="Max Floor Plate" value={property.max_floor_plate} unit="sq ft" />
                <PropertyRow label="Building Class" value={property.building_class} />
                <PropertyRow label="Asset Type" value={property.asset_type} />
                <PropertyRow label="Existing Floor Area Ratio" value={property.existing_floor_area_ratio} />
            </div>

            {/* Units Information */}
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>Units</h3>
                <PropertyRow label="Commercial Units" value={property.commercial_units} />
                <PropertyRow label="Residential Units" value={property.residential_units} />
                <PropertyRow label="Total Units" value={property.total_units} />
            </div>

            {/* Lot Information */}
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>Lot Info</h3>
                <PropertyRow label="Lot Size" value={property.lot_size_sqft} unit="sq ft" />
                <PropertyRow label="Lot Size" value={property.lot_size_acres} unit="acres" />
                <PropertyRow label="Frontage" value={property.frontage} unit="ft" />
                <PropertyRow label="Depth" value={property.depth} unit="ft" />
                <PropertyRow label="Lot Frontage" value={property.lot_size_frontage_feet} unit="ft" />
                <PropertyRow label="Lot Depth" value={property.lot_size_depth_feet} unit="ft" />
            </div>

            {/* Location Information */}
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>Location</h3>
                <PropertyRow label="Municipality" value={property.municipality} />
                <PropertyRow label="Neighborhood" value={property.neighborhood_name} />
                <PropertyRow label="MCD Name" value={property.mcd_name} />
                <PropertyRow label="MSA Name" value={property.msa_name} />
                <PropertyRow label="FIPS County" value={property.fips_county} />
                <PropertyRow label="Census Tract" value={property.census_tract} />
                <PropertyRow label="Opp Zone" value={property.opp_zone} />
                <PropertyRow label="Legal Description" value={property.legal_description} />
            </div>

            {/* Zoning Information */}
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>Zoning</h3>
                <PropertyRow label="Zoning" value={property.zoning} />
                <PropertyRow label="Zoning District 1" value={property.zoning_district_1} />
                <PropertyRow label="Zoning District 2" value={property.zoning_district_2} />
                <PropertyRow label="Special Purpose District" value={property.special_purpose_district} />
                <PropertyRow label="Split Boundary" value={property.split_boundary} />
                <PropertyRow label="Sanborn Map Number" value={property.sanborn_map_number} />
                <PropertyRow label="Zoning Map Number" value={property.zoning_map_number} />
            </div>
        </div>
    );
};