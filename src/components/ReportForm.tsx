import styled from 'styled-components';

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

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  min-height: 100px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #ff9f1c;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: #f39200;
  }
`;

const ReportForm = () => {
  return (
    <FormContainer>
      <Title>Report a Mouse! 🐭</Title>
      <Input 
        type="text" 
        placeholder="e.g., Science Center"
        aria-label="Location Name"
      />
      <TextArea 
        placeholder="What was the mouse doing?"
        aria-label="Description"
      />
      <SubmitButton>Log Sighting! 🐁</SubmitButton>
    </FormContainer>
  );
};

export default ReportForm; 