// reactOpenseadrag-master/src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { username, password });
      const response = await fetch('http://34.28.249.83:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);
      if (response.ok) {
        localStorage.setItem('token', data.token);
        console.log('Token set in localStorage:', localStorage.getItem('token'));
        setIsAuthenticated(true); // Update the state immediately
        navigate('/', { replace: true }); // Replace history entry
      } else {
        setError(data.errors || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account? <a href="/api/signup" className="text-blue-600">Signup</a>
        </p>
        <div className="mt-4 text-center">
          <p className="text-gray-700">Or login with Google (coming soon):</p>
          <button disabled className="mt-2 bg-gray-300 text-gray-700 p-2 rounded cursor-not-allowed">
            Google Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;