"use client";
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
// Hook to get parcelId by lat/lng using TaxAssessor
import { useLazyQuery } from '@apollo/client/react';

export function useParcelIdFromTaxAssessor() {
  const [getTaxAssessor] = useLazyQuery<TaxAssessorsData>(GET_TAX_ASSESSORS);
  // Returns a function to call with lat/lng
  const fetchParcelId = async (latitude, longitude) => {
    const { data } = await getTaxAssessor();
    if (!data || !data.attomTaxAssessors || !data.attomTaxAssessors.items) return null;
    // Find the item with matching lat/lng (exact match or nearest)
    const found = data.attomTaxAssessors.items.find(
      item => item.PropertyLatitude === latitude && item.PropertyLongitude === longitude
    );
    return found?.parcel_id || null;
  };
  return { fetchParcelId };
}
const GET_TAX_ASSESSORS = gql`
  query {
    attomTaxAssessors {
      items {
        PropertyAddressFull
        PropertyLatitude
        PropertyLongitude
        ATTOM_ID
        parcel_id
      }
    }
  }
`;

type TaxAssessorItem = {
  PropertyAddressFull: string;
  PropertyLatitude: number;
  PropertyLongitude: number;
  ATTOM_ID: string;
  parcel_id: string;
};

type TaxAssessorsData = {
  attomTaxAssessors: {
    items: TaxAssessorItem[];
  };
};

export function TaxAssessors() {
  const { loading, error, data } = useQuery<TaxAssessorsData>(GET_TAX_ASSESSORS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :{error.message}</p>;

  return (
    <div>
      {data?.attomTaxAssessors.items.map(({ PropertyAddressFull }, index) => (
        <div key={index}>
          <p>{PropertyAddressFull}</p>
        </div>
      ))}
    </div>
  );
}