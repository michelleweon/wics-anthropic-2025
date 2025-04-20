import styled from 'styled-components';
import { useState } from 'react';

const FormContainer = styled.div`
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

const ReportButton = styled.button<{ active: boolean }>`
  width: 100%;
  padding: 12px;
  background-color: ${props => props.active ? '#f39200' : '#ff9f1c'};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 15px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f39200;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 2px solid #ffe5d9;
  border-radius: 8px;
  font-size: 14px;
  color: #666;

  &:focus {
    outline: none;
    border-color: #ff9f1c;
  }
`;

const MouseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 15px;
`;

const MouseOption = styled.button<{ selected: boolean }>`
  aspect-ratio: 1;
  border: 2px solid ${props => props.selected ? '#ff9f1c' : '#ffe5d9'};
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.2s;

  &:hover {
    border-color: #ff9f1c;
    background-color: #fff8f8;
  }
`;

const Label = styled.label`
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
  display: block;
`;

interface ReportFormProps {
  onModeChange: (isReporting: boolean) => void;
  onMouseSelect: (mouseEmoji: string) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onModeChange, onMouseSelect }) => {
  const [isReporting, setIsReporting] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState('');
  const [selectedMouse, setSelectedMouse] = useState('🐁');

  const mouseOptions = ['🐁', '🐭', '🐀', '🐹', '🐾', '🧀', '🪤', '🕵️'];

  const handleReportClick = () => {
    const newState = !isReporting;
    setIsReporting(newState);
    onModeChange(newState);
  };

  const handleMouseSelect = (mouse: string) => {
    setSelectedMouse(mouse);
    onMouseSelect(mouse);
  };

  return (
    <FormContainer>
      <Title>Report a Mouse! 🐭</Title>
      
      <ReportButton 
        active={isReporting} 
        onClick={handleReportClick}
      >
        {isReporting ? 'Cancel Report' : 'Start Reporting!'}
      </ReportButton>

      {isReporting && (
        <>
          <Label>Select House</Label>
          <Select 
            value={selectedHouse}
            onChange={(e) => setSelectedHouse(e.target.value)}
          >
            <option value="">Select a House</option>
            <option value="Adams House">Adams House</option>
            <option value="Cabot House">Cabot House</option>
            <option value="Currier House">Currier House</option>
            <option value="Dunster House">Dunster House</option>
            <option value="Eliot House">Eliot House</option>
            <option value="Kirkland House">Kirkland House</option>
            <option value="Leverett House">Leverett House</option>
            <option value="Lowell House">Lowell House</option>
            <option value="Mather House">Mather House</option>
            <option value="Pforzheimer House">Pforzheimer House</option>
            <option value="Quincy House">Quincy House</option>
            <option value="Winthrop House">Winthrop House</option>
          </Select>

          <Label>Choose Your Mouse</Label>
          <MouseGrid>
            {mouseOptions.map((mouse) => (
              <MouseOption
                key={mouse}
                selected={mouse === selectedMouse}
                onClick={() => handleMouseSelect(mouse)}
              >
                {mouse}
              </MouseOption>
            ))}
          </MouseGrid>
        </>
      )}
    </FormContainer>
  );
};

export default ReportForm; 