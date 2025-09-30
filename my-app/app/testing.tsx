'use client';

import { TaxAssessors } from './apollo/TaxAssessors';

export default function Home() {
  return (
    <div>
      <h1>Properties</h1>
      <TaxAssessors />
    </div>
  );
}