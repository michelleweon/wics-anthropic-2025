import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background-color: #fff8f8;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  background-color: #fff8f8;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 3rem;
  border: 2px solid #ff9f1c;
`;

const Title = styled.h1`
  color: #ff9f1c;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: bold;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #ff9f1c;
  font-size: 1.2rem;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 2px solid #ffe5d9;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #ff9f1c;
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 2px solid #ffe5d9;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #ff9f1c;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant?: 'delete' }>`
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border: none;
  
  ${props => props.variant === 'delete' ? `
    background-color: #ff9f1c;
    color: white;
    &:hover {
      background-color: #f39200;
    }
  ` : `
    background-color: #ffe5d9;
    color: #ff9f1c;
    &:hover {
      background-color: #ffd5c2;
    }
  `}
`;

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    displayName: 'Mouse Spotter',
    email: 'student@harvard.edu',
    house: 'Kirkland House',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add profile update logic here
    alert('Profile updated successfully!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Add delete account logic here
      navigate('/login');
    }
  };

  return (
    <ProfileContainer>
      <ProfileCard>
        <Avatar>🐁</Avatar>
        <Title>Mouse Logger Profile</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Display Name</Label>
            <Input
              type="text"
              value={profileData.displayName}
              onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
            />
          </FormGroup>

          <FormGroup>
            <Label>Harvard Email</Label>
            <Input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
            />
          </FormGroup>

          <FormGroup>
            <Label>House</Label>
            <Select
              value={profileData.house}
              onChange={(e) => setProfileData({...profileData, house: e.target.value})}
            >
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
          </FormGroup>

          <FormGroup>
            <Label>Reset Password</Label>
            <Input
              type="password"
              placeholder="Leave blank to keep current password"
              value={profileData.password}
              onChange={(e) => setProfileData({...profileData, password: e.target.value})}
            />
          </FormGroup>

          <ButtonContainer>
            <Button type="submit">Save Changes</Button>
            <Button type="button" variant="delete" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </ButtonContainer>
        </Form>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile; 