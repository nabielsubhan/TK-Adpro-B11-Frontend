
// tambahin importan sama line 9-34 ya di page yang cuman buat user, kalo bisa dua duanya bisa cek kode di dashboard

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

export default function TesUser() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken) {
        setIsAuthenticated(true);
        if (decodedToken.sub !== 'admin') { // Assuming the token has a 'role' field
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <h1>Welcome, User</h1>
    </div>
  );
}
