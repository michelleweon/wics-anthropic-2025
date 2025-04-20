import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const SignUpContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff8f8;
`;

const SignUpCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  color: #ff9f1c;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem;
  background-color: #ff9f1c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #f39200;
  }
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #666;

  a {
    color: #ff9f1c;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // First, check if the email is already registered
      const { data: existingUser, error: checkError } = await supabase
        .from('profile')
        .select('username')
        .eq('username', formData.email)
        .single();

      if (existingUser) {
        setError('An account with this email already exists. Please log in instead.');
        setLoading(false);
        return;
      }

      // Then, sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('An account with this email already exists. Please log in instead.');
        } else {
          throw authError;
        }
        return;
      }

      if (!authData?.user) {
        throw new Error('No user data returned');
      }

      // Then, create the profile
      const { error: profileError } = await supabase
        .from('profile')
        .insert([
          {
            username: authData.user.id,
            name: formData.displayName,
            password: formData.password // Note: In a real app, you should hash this
          }
        ]);

      if (profileError) {
        if (profileError.message.includes('duplicate key value')) {
          setError('An account with this email already exists. Please log in instead.');
        } else {
          throw profileError;
        }
        return;
      }

      setError("✅ Account created! Please check your email to confirm before logging in.");
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Sign up error:', err);
      if (err instanceof Error) {
        if (err.message.includes('duplicate key value')) {
          setError('An account with this email already exists. Please log in instead.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An error occurred during sign up');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignUpContainer>
      <SignUpCard>
        <Title>🐁 Join MouseMap</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <Input
            type="text"
            placeholder="Display Name"
            value={formData.displayName}
            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
        <LoginLink>
          Already have an account? <a href="/login">Login</a>
        </LoginLink>
      </SignUpCard>
    </SignUpContainer>
  );
};

export default SignUp;