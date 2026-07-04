import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createStat, updateStat, getStatById } from '../api/client';

interface StatFormValues {
  name: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
}

const StatsForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<StatFormValues>({
    name: '',
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchStat = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getStatById(Number(id));
          setFormValues(data);
        } catch (err) {
          setError('Failed to fetch stat.');
        } finally {
          setLoading(false);
        }
      };

      fetchStat();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: name === 'name' ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await updateStat(Number(id), formValues);
      } else {
        await createStat(formValues);
      }
      navigate('/stats');
    } catch (err) {
      setError('Failed to save stat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Stat' : 'Add New Stat'}</h1>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Games Played</label>
          <input
            type="number"
            name="gamesPlayed"
            value={formValues.gamesPlayed}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Wins</label>
          <input
            type="number"
            name="wins"
            value={formValues.wins}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Losses</label>
          <input
            type="number"
            name="losses"
            value={formValues.losses}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Draws</label>
          <input
            type="number"
            name="draws"
            value={formValues.draws}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default StatsForm;