import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

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

const SightingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SightingItem = styled.div`
  padding: 10px;
  background-color: #fff8f8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
`;

const MouseEmoji = styled.span`
  font-size: 1.5em;
`;

const SightingDetails = styled.div`
  flex: 1;
`;

const HouseName = styled.span`
  font-weight: bold;
  color: #ff9f1c;
`;

const TimeAgo = styled.span`
  color: #666;
  font-size: 0.9em;
`;

interface Mouse {
  id: number;
  username: string;
  house: string;
  mouse_emoji: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

const LatestSightings = () => {
  const [mice, setMice] = useState<Mouse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLatestMice = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mice')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setMice(data || []);
    } catch (error) {
      console.error('Error fetching latest mice:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestMice();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <SightingsContainer>
      <Title>Latest Sightings 🗺️</Title>
      <SightingsList>
        {loading ? (
          <SightingItem>Loading sightings...</SightingItem>
        ) : mice.length === 0 ? (
          <SightingItem>No mice spotted yet!</SightingItem>
        ) : (
          mice.map((mouse) => (
            <SightingItem key={mouse.id}>
              <MouseEmoji>{mouse.mouse_emoji}</MouseEmoji>
              <SightingDetails>
                <HouseName>{mouse.house}</HouseName>
                <TimeAgo> • {formatTimeAgo(mouse.created_at)}</TimeAgo>
              </SightingDetails>
            </SightingItem>
          ))
        )}
      </SightingsList>
    </SightingsContainer>
  );
};

export default LatestSightings; 