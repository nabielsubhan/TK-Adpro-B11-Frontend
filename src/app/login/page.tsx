'use client'

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

function useAuth(): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      router.push('/');
    }
  }, []);

  return [isAuthenticated, setIsAuthenticated];
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
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
      localStorage.setItem('token', data.accessToken);
      setIsAuthenticated(true);
      const decodedToken: any = jwtDecode(data.accessToken);
      if (decodedToken.sub === 'admin'){
        router.replace('/landing-admin');
      } else {
        router.replace('/landing-user');
      }

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f2f2f2' }}>
      <div style={{ borderRadius: '10px', width: '300px', background: '#fff' }}>
        <form style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }} onSubmit={handleSubmit}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', background: '#007bff', color: '#fff', cursor: 'pointer' }}>Login</button>
          <p style={{ textAlign: 'center', marginTop: '10px' }}>
            Don't have an account yet? <a href="/register" style={{ color: 'blue' }}>Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
