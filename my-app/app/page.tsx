import SearchBar from './components/Search/SearchBar';

export default function Home() {
  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto' 
    }}>
      {/* Hero Section with Search */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        paddingTop: '20px'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '16px', 
          color: '#1976d2' 
        }}>
          Interactive Map Explorer
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#666', 
          marginBottom: '30px',
          maxWidth: '600px',
          margin: '0 auto 30px auto'
        }}>
          Discover places, get directions, and explore the world around you
        </p>
        
        {/* Centered Search Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '20px' 
        }}>
          <SearchBar />
        </div>
      </div>

      {/* Features Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginTop: '40px'
      }}>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔍</div>
          <h3 style={{ marginBottom: '10px', color: '#333' }}>Search Places</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Find any location, restaurant, or point of interest</p>
        </div>

        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📍</div>
          <h3 style={{ marginBottom: '10px', color: '#333' }}>Your Location</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Get directions and find nearby places</p>
        </div>

        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💾</div>
          <h3 style={{ marginBottom: '10px', color: '#333' }}>Save & History</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Keep track of your favorite places and searches</p>
        </div>
      </div>
    </div>
  );
}
