import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      router.push('/dashboard');
    }
  }, []);

  return [isAuthenticated, setIsAuthenticated];
}

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username dan password tidak boleh kosong');
      return;
    }

    const response = await fetch('http://34.87.122.103/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } else {
      if (response.status === 401) {
        setError('Username atau password salah');
      } else {
        const text = await response.text();
        if (text) {
          const data = JSON.parse(text);
          setError(data.message || 'An error occurred');
        } else {
          setError('An error occurred');
        }
      }
    }
  };

  if (isAuthenticated) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', width: '300px' }}>
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
