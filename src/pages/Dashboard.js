import { useEffect, useState } from 'react';
import axios from '../api/axios';

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await axios.get('/habits', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHabits(res.data);
      } catch (err) {
        console.error('Error fetching habits:', err);
      }
    };

    fetchHabits();
  }, [token]);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        '/habits',
        {
          title,
          frequency: frequency.split(',').map((f) => f.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHabits((prev) => [...prev, res.data]);
      setTitle('');
      setFrequency('');
      setMessage('Habit added!');
    } catch (err) {
      console.error('Error adding habit:', err);
      setMessage('Failed to add habit.');
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/habits/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHabits((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.error('Error deleting habit:', err);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <form onSubmit={handleAddHabit}>
        <input
          type="text"
          value={title}
          placeholder="Habit title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          value={frequency}
          placeholder="Frequency (e.g. Mon,Wed,Fri)"
          onChange={(e) => setFrequency(e.target.value)}
        />
        <button type="submit">Add Habit</button>
      </form>
      <p>{message}</p>

      <ul>
  {habits.map((habit) => (
    <li key={habit._id}>
      {habit.title} — {habit.frequency.join(', ')}
      <button
        onClick={() => handleDelete(habit._id)}
        style={{ marginLeft: '1rem', color: 'red' }}
      >
        🗑️
      </button>
    </li>
  ))}
</ul>
    </div>
  );
}

export default Dashboard;