'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function useAuth() {
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

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username dan password tidak boleh kosong');
      return;
    }

    try {
      const response = await fetch('http://34.87.122.103/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const responseData = await response.text();

      if (response.ok) {
        console.log("Registration successful:", responseData);
        router.push('/login');
      } else {
        console.log("Registration failed:", responseData);
        setError(responseData || 'An error occurred');
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      setError('An error occurred');
    }
  };

  if (isAuthenticated) return null;

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.heading}>Register</h2>
          {error && <p style={styles.error}>{error}</p>}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Register</button>
          <p style={{ textAlign: 'center', marginTop: '10px' }}>
            Already have an account? <a href="/login" style={{ color: 'blue' }}>Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  formWrapper: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '40px 30px',
    width: '400px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  heading: {
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  },
  input: {
    marginBottom: '15px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    textAlign: 'center',
  },
};
