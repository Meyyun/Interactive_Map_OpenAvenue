import Navbar from './components/Navbar/Narbar'
import Search from './components/Search/SearchBar';
import {
  BrowserRouter,
  Routes,
  Route
}from "react-router-dom"
export default function Home() {
  return (
    <main>
      <Navbar />
      <Search />
    </main>
  );
}
