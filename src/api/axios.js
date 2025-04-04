import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001/api', // points to your backend server
});

export default instance;