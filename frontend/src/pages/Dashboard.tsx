import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMatches, getStats } from '../api/client';

interface Match {
  id: string;
  created_at: string;
  players: string[];
  winner: string | null;
}

interface Stats {
  total_matches: number;
  total_wins: number;
  total_losses: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const statsResponse = await getStats();
        const matchesResponse = await getMatches();
        setStats(statsResponse);
        setRecentMatches(matchesResponse.slice(0, 5)); // Show only the 5 most recent matches
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCreateMatch = () => {
    navigate('/game');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-lg font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total Matches</h2>
          <p className="text-2xl font-bold">{stats?.total_matches || 0}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total Wins</h2>
          <p className="text-2xl font-bold">{stats?.total_wins || 0}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total Losses</h2>
          <p className="text-2xl font-bold">{stats?.total_losses || 0}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Matches</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Players</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Winner</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentMatches.map((match) => (
                <tr key={match.id} className="border-t">
                  <td className="px-4 py-2 text-sm text-gray-700">{match.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{match.players.join(', ')}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{match.winner || 'N/A'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{new Date(match.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentMatches.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center text-sm text-gray-500">
                    No recent matches found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCreateMatch}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
        >
          Create New Match
        </button>
      </div>
    </div>
  );
};

export default Dashboard;