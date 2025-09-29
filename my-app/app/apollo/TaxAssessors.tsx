"use client";
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

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