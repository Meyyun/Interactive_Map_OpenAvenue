import MapContainer from './components/Map/MapContainer';
import SearchBar from './components/Search/SearchBar';
export default function Home() {
  return (
    <div>
      <SearchBar />
      <MapContainer />
      <h1>Welcome to Interactive Map</h1>
      <p>This is the home page of your interactive map application.</p>
    </div>
  );
}
