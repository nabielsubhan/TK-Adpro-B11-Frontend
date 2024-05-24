import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (!token) {
      router.push('/login');
    }
  }, []);

  return [isAuthenticated, setIsAuthenticated];
}

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f2f2f2' }}>
      <div style={{ width: '50%', maxWidth: '600px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', background: '#fff' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Dashboard</h1>
        {router.query.message && <p style={{ textAlign: 'center', marginBottom: '20px', color: 'green' }}>{router.query.message}</p>}
        <button onClick={handleLogout} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', background: '#007bff', color: '#fff', cursor: 'pointer' }}>Logout</button>
      </div>
    </div>
  );
}
