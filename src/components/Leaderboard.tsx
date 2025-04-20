import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const LeaderboardContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
`;

const Title = styled.h1`
  color: #ff9f1c;
  text-align: center;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  background-color: #fff8f8;
  color: #ff9f1c;
  font-weight: bold;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #fff8f8;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ffe5d9;
`;

const RankCell = styled(TableCell)`
  font-weight: bold;
  color: #ff9f1c;
`;

interface UserData {
  id: string;
  display_name: string;
  house: string;
  sightings_count: number;
}

interface LeaderboardEntry extends UserData {
  rank: number;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, display_name, house, sightings_count')
          .order('sightings_count', { ascending: false })
          .limit(10);

        if (error) throw error;

        const rankedData = (data as UserData[]).map((entry, index) => ({
          ...entry,
          rank: index + 1
        }));

        setLeaderboardData(rankedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <LeaderboardContainer>
      <Title>🏆 Mouse Spotter Leaderboard</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader>Rank</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>House</TableHeader>
            <TableHeader>Sightings</TableHeader>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry) => (
            <TableRow key={entry.id}>
              <RankCell>#{entry.rank}</RankCell>
              <TableCell>{entry.display_name}</TableCell>
              <TableCell>{entry.house}</TableCell>
              <TableCell>{entry.sightings_count}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </LeaderboardContainer>
  );
};

export default Leaderboard; 