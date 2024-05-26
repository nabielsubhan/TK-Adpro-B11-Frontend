import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

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
  const [userProfile, setUserProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            router.push('/login');
            return;
          }
      
          const decodedToken = jwtDecode(token);
          const username = decodedToken.sub;
      
          console.log('Decoded token:', decodedToken);
          console.log('Username yang didapatkan:', username);
      
          const response = await fetch(`http://34.87.122.103/api/profile/${username}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            console.log('Data profil yang didapatkan:', data);
            setUserProfile(data);
            setProfileExists(true);
          } else {
            setProfileExists(false);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };      

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const handleCreateProfile = () => {
    router.push('/create-profile');
  };

  if (!isAuthenticated) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f2f2f2' }}>
      <div style={{ width: '50%', maxWidth: '600px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', background: '#fff' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Dashboard</h1>
        {router.query.message && <p style={{ textAlign: 'center', marginBottom: '20px', color: 'green' }}>{router.query.message}</p>}
        {profileExists && userProfile &&
          <>
            <p>Full Name: {userProfile.fullName}</p>
            <p>Phone Number: {userProfile.phoneNumber}</p>
            <p>Address: {userProfile.address}</p>
          </>
        }
        {!profileExists &&
          <button onClick={handleCreateProfile} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', background: '#007bff', color: '#fff', cursor: 'pointer' }}>Create Profile</button>
        }
        <button onClick={handleLogout} style={{ width: '100%', marginTop: '10px', padding: '10px', borderRadius: '5px', border: 'none', background: '#007bff', color: '#fff', cursor: 'pointer' }}>Logout</button>
      </div>
    </div>
  );
}
