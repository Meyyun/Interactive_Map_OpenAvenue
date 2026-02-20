'use client';

import { useQuery, gql } from '@apollo/client';

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

function TaxAssessors() {
  const { loading, error, data } = useQuery(GET_TAX_ASSESSORS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Tax Assessor Properties</h2>
      {data.attomTaxAssessors.items.map((item, index) => (
        <div key={item.ATTOM_ID || index} style={{border:'1px solid #ccc', margin:'8px', padding:'8px', borderRadius:'6px'}}>
          <p><strong>Address:</strong> {item.PropertyAddressFull}</p>
          <p><strong>Latitude:</strong> {item.PropertyLatitude}</p>
          <p><strong>Longitude:</strong> {item.PropertyLongitude}</p>
          <p><strong>ATTOM_ID:</strong> {item.ATTOM_ID}</p>
          <p><strong>Parcel ID:</strong> {item.parcel_id}</p>
        </div>
      ))}
    </div>
  );
}
export default function Home() {
  return (
    <div>
      <h1>Tax Assessor Property Test</h1>
      <TaxAssessors />
    </div>
  );
}