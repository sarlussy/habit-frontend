import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // 👈 Step 2

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/signup', { email, password }); // 👈 Step 3
      setMessage('🎉 Signed up! Now go log in.');
      navigate('/dashboard'); // 👈 Step 3 continued
    } catch (err) {
      setMessage(err.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Sign Up</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Signup;