import React from "react";
import { usePropertyData } from "../../apollo/ReonomyProperties";

export const Sidebar = ({ 
    parcelId, 
    address,
    onClose 
}: { 
    parcelId: string | number | null;
    address?: string | null;
    onClose?: () => void;
}) => {
    console.log("Sidebar received parcelId (from Mapbox):", parcelId);
    console.log("This will query GraphQL property_id field with this value");
    const { loading, error, property } = usePropertyData(parcelId);

    // Always render the sidebar container with proper styling
    const renderContent = () => {
        if (!parcelId || parcelId === '') {
            return (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <h3>No Property Found</h3>
                    {address && <p>Address: <span style={{color:'#2196f3'}}>{address}</span></p>}
                    <p>Click on a property on the map or try another address.</p>
                </div>
            );
        }
        if (loading) {
            return (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <h3>Loading...</h3>
                    <p>Fetching property data...</p>
                </div>
            );
        }
        if (error) {
            return (
                <div style={{ textAlign: 'center', padding: '40px', color: '#e53e3e' }}>
                    <h3>Error</h3>
                    <p>{error.message}</p>
                </div>
            );
        }
        if (!property) {
            return (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <h3>No Property Data Found</h3>
                    <p>No data available for property ID: {parcelId}</p>
                </div>
            );
        }
        
        // Return the property data content
        return (
            <>
                {/* <div style={{ marginBottom: '16px', fontSize: '14px', color: 'black' }}>
                    <strong>Property ID:</strong> {parcelId}<br/>
                    <strong>Parcel ID:</strong> {property?.parcel_id || 'Not available'}
                </div> */}

                {/* Building Information */}
                <div style={{ marginBottom: '20px', color: 'black',height:'200px' }}>
                    <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>Building Info</h3>
                    <PropertyRow label="Year Built" value={property.year_built} />
                    <PropertyRow label="Year Renovated" value={property.year_renovated} />
                    <PropertyRow label="Floors" value={property.floors} />
                    <PropertyRow label="Building Area" value={property.building_area} unit="sq ft" />
                    <PropertyRow label="Building Class" value={property.building_class} />
                    <PropertyRow label="Asset Type" value={property.asset_type} />
                    <PropertyRow label="Existing Floor Area Ratio" value={property.existing_floor_area_ratio} />
                </div>

                {/* Units Information */}
                <div style={{ marginBottom: '20px', color: 'black'  }}>
                    <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>Units</h3>
                    <PropertyRow label="Commercial Units" value={property.commercial_units} />
                    <PropertyRow label="Residential Units" value={property.residential_units} />
                    <PropertyRow label="Total Units" value={property.total_units} />
                </div>

                {/* Lot Information */}
                <div style={{ marginBottom: '20px', color: 'black'  }}>
                    <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>Lot Info</h3>
                    <PropertyRow label="Lot Size" value={property.lot_size_sqft} unit="sq ft" />
                    <PropertyRow label="Lot Size" value={property.lot_size_acres} unit="acres" />
                    <PropertyRow label="Frontage" value={property.frontage} unit="ft" />
                    <PropertyRow label="Depth" value={property.depth} unit="ft" />
                    <PropertyRow label="Lot Frontage" value={property.lot_size_frontage_feet} unit="ft" />
                    <PropertyRow label="Lot Depth" value={property.lot_size_depth_feet} unit="ft" />
                </div>

                {/* Location Information */}
                <div style={{ marginBottom: '20px', color: 'black'  }}>
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
                <div style={{ marginBottom: '20px',color:'black' }}>
                    <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>Zoning</h3>
                    <PropertyRow label="Zoning" value={property.zoning} />
                    <PropertyRow label="Zoning District 1" value={property.zoning_district_1} />
                    <PropertyRow label="Zoning District 2" value={property.zoning_district_2} />
                    <PropertyRow label="Special Purpose District" value={property.special_purpose_district} />
                    <PropertyRow label="Split Boundary" value={property.split_boundary} />
                    <PropertyRow label="Sanborn Map Number" value={property.sanborn_map_number} />
                    <PropertyRow label="Zoning Map Number" value={property.zoning_map_number} />
                </div>
            </>
        );
    };

    // Helper function to format display values
    const formatValue = (value: any): string => {
        if (value === null || value === undefined || value === '') return 'N/A';
        if (typeof value === 'number') return value.toLocaleString();
        return String(value);
    };

    // Helper function to create a property row
    const PropertyRow = ({ label, value, unit }: { label: string; value: any; unit?: string }) => {
        // Always show the row, even if value is empty
        let displayValue = formatValue(value);
        if (unit && value !== null && value !== undefined && value !== '') {
            displayValue += ` ${unit}`;
        }
        
        return (
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>{label}:</span>
                <span style={{ color: value === null || value === undefined || value === '' ? '#999' : 'black' }}>
                    {displayValue}
                </span>
            </div>
        );
    };

    return (
        <div style={{
            position: 'fixed',
            top: '0',              
            left: '0px',          
            width: '400px',
            height: '100vh',       
            backgroundColor: 'white',
            border: '2px solid #2196f3',
            borderRadius: '0 12px 12px 0', 
            padding: '20px',
            paddingTop: '13px',    
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            overflow: 'auto',
            zIndex: 2000,         
            animation: 'slideIn 0.3s ease-out'
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '20px',
                borderBottom: '2px solid #2196f3',
                paddingBottom: '10px'
            }}>
                <h2 style={{ margin: 0, color: '#2196f3' }}>Property Details</h2>
                <button 
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#666',
                        padding: '4px 8px',
                        borderRadius: '4px'
                    }}
                    title="Close Sidebar"
                >
                    ✕
                </button>
            </div>
            {/* Address section at top */}
            {(() => {
                // Prefer address prop, fallback to property.address if available
                const displayAddress = address || (property && property.address) || null;
                return displayAddress ? (
                    <div style={{
                        marginBottom: '16px',
                        padding: '8px 0',
                        fontSize: '16px',
                        color: '#333',
                        background: '#e3f2fd',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontWeight: 500
                    }}>
                        <span>📍 {displayAddress}</span>
                    </div>
                ) : null;
            })()}
            {/* Render content based on state */}
            {renderContent()}
        </div>
    );
};