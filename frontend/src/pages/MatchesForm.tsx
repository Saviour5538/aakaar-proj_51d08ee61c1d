import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMatch, getMatch, updateMatch } from '../api/client';

interface MatchFormValues {
  player1: string;
  player2: string;
}

const MatchesForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formValues, setFormValues] = useState<MatchFormValues>({ player1: '', player2: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchMatch = async () => {
        setLoading(true);
        setError(null);
        try {
          const match = await getMatch(id);
          setFormValues({ player1: match.player1, player2: match.player2 });
        } catch (err) {
          setError('Failed to fetch match details.');
        } finally {
          setLoading(false);
        }
      };

      fetchMatch();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await updateMatch(id, formValues);
      } else {
        await createMatch(formValues);
      }
      navigate('/matches');
    } catch (err) {
      setError('Failed to save match.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Match' : 'Create Match'}</h1>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="player1" className="block text-sm font-medium text-gray-700">
            Player 1
          </label>
          <input
            type="text"
            id="player1"
            name="player1"
            value={formValues.player1}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="player2" className="block text-sm font-medium text-gray-700">
            Player 2
          </label>
          <input
            type="text"
            id="player2"
            name="player2"
            value={formValues.player2}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {id ? 'Update Match' : 'Create Match'}
        </button>
      </form>
    </div>
  );
};

export default MatchesForm;