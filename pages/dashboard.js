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
    <div>
      <h1>Dashboard</h1>
      {router.query.message && <p>{router.query.message}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
