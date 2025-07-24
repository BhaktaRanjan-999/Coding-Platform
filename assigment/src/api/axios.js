import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://project-test-iare.vercel.app', // use your actual IP here
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;
