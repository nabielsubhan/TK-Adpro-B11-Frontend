// kalo buat page yang cmn bisa diakses sm admin tambahin import sama line 9-34 aja kalo bisa dua duanya liat dashboard dah

'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function TesAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken) {
        setIsAuthenticated(true);
        if (decodedToken.sub === 'admin') { 
          setIsAdmin(true);
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

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div>
      <h1>Welcome, Admin</h1>
    </div>
  );
}
