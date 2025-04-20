import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

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

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profile')
          .select('*')
          .eq('username', user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (profile) {
          setProfileData({
            name: profile.name || '',
            username: profile.username || '',
            password: '' // Don't show the password
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { error: updateError } = await supabase
        .from('profile')
        .update({
          name: profileData.name
        })
        .eq('username', user.id);

      if (updateError) {
        throw updateError;
      }

      // If password is provided, update it
      if (profileData.password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: profileData.password
        });

        if (passwordError) {
          throw passwordError;
        }
      }

      setError('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Delete profile
      const { error: profileError } = await supabase
        .from('profile')
        .delete()
        .eq('username', user.id);

      if (profileError) {
        throw profileError;
      }

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      if (authError) {
        throw authError;
      }

      // Sign out and redirect to login
      await supabase.auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account. Please try again.');
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
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            />
          </FormGroup>

          <FormGroup>
            <Label>Username</Label>
            <Input
              type="text"
              value={profileData.username}
              disabled
            />
          </FormGroup>

          <FormGroup>
            <Label>New Password</Label>
            <Input
              type="password"
              placeholder="Leave blank to keep current password"
              value={profileData.password}
              onChange={(e) => setProfileData({...profileData, password: e.target.value})}
            />
          </FormGroup>

          <ButtonContainer>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="delete" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </ButtonContainer>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile; 