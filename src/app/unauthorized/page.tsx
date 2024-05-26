'use client'
import { useRouter } from 'next/navigation';

export default function Unauthorized() {
  const router = useRouter();

  const goToHomepage = () => {
    router.push('/');
  };

  return (
    <div>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <button onClick={goToHomepage} style={{ backgroundColor: 'blue', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Go to Homepage</button>
    </div>
  );
}
