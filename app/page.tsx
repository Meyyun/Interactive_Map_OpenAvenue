import MapContainer from './components/Map/MapContainer';
import { TaxAssessors } from './apollo/TaxAssessors';
export default function Home() {
  return (
    <div>
      <MapContainer />
      <h1>Welcome to Interactive Map</h1>
      <p>This is the home page of your interactive map application.</p>
      <TaxAssessors />
    </div>
  );
}
