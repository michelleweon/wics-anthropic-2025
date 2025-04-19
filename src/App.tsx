import styled from 'styled-components';
import Map from './components/Map';
import Header from './components/Header';
import ReportForm from './components/ReportForm';
import LatestSightings from './components/LatestSightings';
import { GlobalStyles } from './styles/GlobalStyles';

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
  return (
    <AppContainer>
      <GlobalStyles />
      <Header />
      <MainContent>
        <MapSection>
          <Map />
        </MapSection>
        <SideSection>
          <ReportForm />
          <LatestSightings />
        </SideSection>
      </MainContent>
    </AppContainer>
  );
}

export default App; 