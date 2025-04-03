import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // points to your backend server
});

export default instance;