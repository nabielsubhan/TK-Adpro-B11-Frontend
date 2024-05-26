// kalo pagenya cuman bisa diakses sama user doang coba tambah line 9-34 tapi kalo bisa dua duanya liat dashboard deh

'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function TesUser() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUser, setIsUser] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken) {
        setIsAuthenticated(true);
        if (decodedToken.sub !== 'admin') { 
            setIsUser(true);
        } else {
            router.push('/unauthorized');
        }
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, []);

  if (!isAuthenticated || !isUser) {
    return null;
  }

  return (
    <div>
      <h1>Welcome, User</h1>
    </div>
  );
}
