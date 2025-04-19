import styled from 'styled-components';

const SightingsContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #ff9f1c;
  margin: 0 0 20px 0;
  font-size: 20px;
`;

const SightingsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SightingItem = styled.li`
  margin-bottom: 10px;
  color: #666;
  
  &:before {
    content: "•";
    color: #ff9f1c;
    margin-right: 8px;
  }
`;

const LatestSightings = () => {
  return (
    <SightingsContainer>
      <Title>Latest Sightings 🗺️</Title>
      <SightingsList>
        <SightingItem>Science Center - 5 mins ago</SightingItem>
        <SightingItem>Widener Library - 20 mins ago</SightingItem>
        <SightingItem>Harvard Yard - 1 hour ago</SightingItem>
      </SightingsList>
    </SightingsContainer>
  );
};

export default LatestSightings; 