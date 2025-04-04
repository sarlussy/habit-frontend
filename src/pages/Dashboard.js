import { useEffect, useState } from 'react';
import axios from '../api/axios';
import AnimatedStreak from '../components/AnimatedStreak';

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  // ✅ Move this out of useEffect
  const fetchHabits = async () => {
    try {
      const res = await axios.get('/habits', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const habitsWithStreaks = await Promise.all(
        res.data.map(async (habit) => {
          try {
            const streakRes = await axios.get(`/habits/${habit._id}/streak`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return { ...habit, streak: streakRes.data.streak };
          } catch (err) {
            console.error('Error fetching streak:', err);
            return { ...habit, streak: 0 };
          }
        })
      );

      setHabits(habitsWithStreaks);
    } catch (err) {
      console.error('Error fetching habits:', err);
    }
  };

  // ✅ Just call it here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
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
          headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.error('Error deleting habit:', err);
    }
  };
  const handleCheckin = async (id) => {
    try {
      const res = await axios.post(
        `/habits/${id}/checkin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.message || 'Checked in!');
      await fetchHabits(); // refresh the streak display
    } catch (err) {
      console.error('Check-in error:', err);
      alert(err.response?.data?.message || 'Check-in failed');
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
            <strong>{habit.title}</strong> - {habit.frequency.join(',')}
            <br />
            <AnimatedStreak streak={habit.streak} />
            <button onClick={() => handleDelete(habit._id)} style={{ marginLeft: '1rem', color: 'red' }}>
              🗑️
            </button>
            <button
              onClick={() => handleCheckin(habit._id)}
              style={{ marginLeft: '0.5rem', color: 'green' }}
            >
              ✅ Check In
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;