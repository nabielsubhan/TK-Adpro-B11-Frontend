'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function CreateProfile() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      console.log('Token di local storage:', token);

      if (!token) {
        router.push('/login');
        return;
      }

      const decodedToken = jwtDecode(token);
      const username = decodedToken.sub;

      console.log('Decoded token:', decodedToken);
      console.log('Username yang didapatkan:', username);

      const response = await fetch(`http://34.87.122.103/api/profile/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, phoneNumber, address }),
      });

      if (response.ok) {
        router.push('/dashboard?message=Profile created successfully');
      } else {
        const responseData = await response.text();
        setError(responseData || 'An error occurred');
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      setError('An error occurred');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f2f2f2' }}>
      <div style={{ borderRadius: '10px', width: '300px', background: '#fff' }}>
        <form style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }} onSubmit={handleSubmit}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Profile</h2>
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', background: '#007bff', color: '#fff', cursor: 'pointer' }}>Create</button>
          <p style={{ textAlign: 'center', marginTop: '10px' }}>
            Back to <a href="/dashboard" style={{ color: 'blue' }}>profile</a>
          </p>
        </form>
      </div>
    </div>
  );
}
