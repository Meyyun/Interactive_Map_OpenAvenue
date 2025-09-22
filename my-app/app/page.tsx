import MapContainer from './components/Map/MapContainer';
import SearchBar from './components/Search/SearchBar';
import MapboxExample from './components/Map/map_try'
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
