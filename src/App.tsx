import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Map from './components/Map';
import Header from './components/Header';
import ReportForm from './components/ReportForm';
import LatestSightings from './components/LatestSightings';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import { GlobalStyles } from './styles/GlobalStyles';
import { useState } from 'react';
import { supabase } from './supabaseClient';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #fff8f8;
`;

const MainContent = styled.div`
  display: flex;
  padding: 20px;
  gap: 20px;
`;

const MapSection = styled.div`
  flex: 1;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const SideSection = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

function App() {
  const [isReportingMode, setIsReportingMode] = useState(false);
  const [selectedMouse, setSelectedMouse] = useState('🐁');
  const [mapKey, setMapKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const DEFAULT_USERNAME = "anonymous";

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleSubmit = async (data: { house: string; mouse: string }) => {
    try {
      setError(null);
      
      if (!selectedLocation) {
        throw new Error('Please click on the map to select a location for the mouse');
      }

      console.log('Submitting mouse at:', selectedLocation.lat, selectedLocation.lng);

      // Insert the mouse into Supabase
      const { error: insertError } = await supabase
        .from('mice')
        .insert([
          {
            username: DEFAULT_USERNAME,
            house: data.house,
            mouse_emoji: data.mouse,
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng
          }
        ]);

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        // Show more specific error message
        if (insertError.code === '42501') {
          throw new Error('Permission denied. Please check Supabase permissions.');
        } else if (insertError.code === '42P01') {
          throw new Error('Table not found. Please create the mice table in Supabase.');
        } else {
          throw new Error(`Database error: ${insertError.message}`);
        }
      }

      // Force map rerender by updating the key
      setMapKey(prev => prev + 1);
      setSelectedLocation(null);

      // Reset reporting mode
      setIsReportingMode(false);
    } catch (error) {
      console.error('Error handling submission:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    }
  };

  return (
    <Router>
      <GlobalStyles />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={
          <>
            <Header />
            <Profile />
          </>
        } />
        <Route path="/leaderboard" element={
          <>
            <Header />
            <Leaderboard />
          </>
        } />
        <Route
          path="/"
          element={
            <AppContainer>
              <Header />
              {error && (
                <div style={{
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  padding: '10px',
                  margin: '10px',
                  borderRadius: '5px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}
              <MainContent>
                <MapSection>
                  <Map 
                    key={mapKey}
                    isReportingMode={isReportingMode}
                    selectedMouse={selectedMouse}
                    onLocationSelect={handleLocationSelect}
                  />
                </MapSection>
                <SideSection>
                  <ReportForm 
                    onModeChange={setIsReportingMode}
                    onMouseSelect={setSelectedMouse}
                    onSubmit={handleSubmit}
                  />
                  <LatestSightings />
                </SideSection>
              </MainContent>
            </AppContainer>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 