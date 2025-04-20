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
              <MainContent>
                <MapSection>
                  <Map 
                    isReportingMode={isReportingMode}
                    selectedMouse={selectedMouse}
                  />
                </MapSection>
                <SideSection>
                  <ReportForm 
                    onModeChange={setIsReportingMode}
                    onMouseSelect={setSelectedMouse}
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