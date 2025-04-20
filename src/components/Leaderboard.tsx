import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const LeaderboardContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #ff9f1c;
  text-align: center;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background-color: #ff9f1c;
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #fff8f8;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: red;
`;

interface LeaderboardEntry {
  rank: number;
  house: string;
  sightings: number;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        console.log('Starting to fetch leaderboard data...');
        
        // Test connection first
        const { data: testData, error: testError } = await supabase
          .from('mice')
          .select('count')
          .limit(1);

        if (testError) {
          throw new Error(`Database connection error: ${testError.message}`);
        }

        console.log('Database connection successful');
        
        // Get all mice data
        const { data: miceData, error: miceError } = await supabase
          .from('mice')
          .select('house')
          .order('house');

        if (miceError) {
          throw new Error(`Error fetching data: ${miceError.message}`);
        }

        console.log('Raw mice data:', miceData);

        if (!miceData || miceData.length === 0) {
          console.log('No mice data found');
          setError('No rat sightings found yet');
          setLoading(false);
          return;
        }

        // Count sightings per house
        const houseCounts: Record<string, number> = {};
        miceData.forEach(mouse => {
          if (mouse.house) { // Only count if house exists
            houseCounts[mouse.house] = (houseCounts[mouse.house] || 0) + 1;
          }
        });

        console.log('House counts:', houseCounts);

        // Convert to array and sort
        const rankedData = Object.entries(houseCounts)
          .map(([house, count]) => ({ house, count }))
          .sort((a, b) => b.count - a.count)
          .map((item, index) => ({
            rank: index + 1,
            house: item.house,
            sightings: item.count
          }));

        console.log('Final ranked data:', rankedData);
        setLeaderboardData(rankedData);
      } catch (error) {
        console.error('Detailed error:', error);
        if (error instanceof Error) {
          if (error.message.includes('Failed to fetch')) {
            setError('Cannot connect to the database. Please check your internet connection and try again.');
          } else {
            setError(error.message || 'Failed to load data');
          }
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) {
    return <LoadingMessage>Loading leaderboard...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <LeaderboardContainer>
      <Title>🐁 Rat Sightings Leaderboard</Title>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Rank</TableHeaderCell>
            <TableHeaderCell>House</TableHeaderCell>
            <TableHeaderCell>Sightings</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {leaderboardData.map((entry) => (
            <TableRow key={entry.house}>
              <TableCell>{entry.rank}</TableCell>
              <TableCell>{entry.house}</TableCell>
              <TableCell>{entry.sightings}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </LeaderboardContainer>
  );
};

export default Leaderboard;