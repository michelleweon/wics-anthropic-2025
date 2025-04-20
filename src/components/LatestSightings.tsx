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

interface Sighting {
  id: string;
  description: string;
  created_at: string;
  profile: {
    display_name: string;
  };
}

interface SupabaseSighting {
  id: string;
  description: string;
  created_at: string;
  profile: {
    display_name: string;
  };
}

const LatestSightings = () => {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const { data, error } = await supabase
          .from('sightings')
          .select(`
            id,
            description,
            created_at,
            profile:user_id (
              display_name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        
        // Type assertion with proper type checking
        const typedData = (data || []).map(item => ({
          id: item.id as string,
          description: item.description as string,
          created_at: item.created_at as string,
          profile: {
            display_name: (item.profile as any).display_name as string
          }
        }));
        
        setSightings(typedData);
      } catch (error) {
        console.error('Error fetching sightings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSightings();
  }, []);

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (loading) return <SightingsContainer>Loading sightings...</SightingsContainer>;

  return (
    <SightingsContainer>
      <Title>Latest Sightings 🗺️</Title>
      <SightingsList>
        {sightings.map((sighting) => (
          <SightingItem key={sighting.id}>
            {sighting.description} - {sighting.profile.display_name} ({formatTimeAgo(sighting.created_at)})
          </SightingItem>
        ))}
      </SightingsList>
    </SightingsContainer>
  );
};

export default LatestSightings; 