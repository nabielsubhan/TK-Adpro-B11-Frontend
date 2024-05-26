// src/LandingPage.tsx
import React from 'react';
import { useRouter } from 'next/navigation';

const Page: React.FC = () => {
    const router = useRouter();

    const handleLoginClick = () => {
        router.push('/login');
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
            style={{ backgroundImage: 'url("https://ik.imagekit.io/tvlk/blog/2023/05/shutterstock_1445673728.jpg?tr=dpr-2,w-675")' }}
        >
            <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg text-center max-w-3xl">
                <h1 className="text-4xl font-bold mb-4 text-black">Selamat datang di KoleksiKota</h1>
                <p className="text-lg mb-6 text-black">
                    Platform subscription box pertama di Indonesia. Pada platform ini, Anda bisa berlangganan subscription box dari berbagai daerah di Indonesia.
                </p>
                <p className="text-lg mb-6 text-black">
                    Untuk berlangganan dan tahu informasi lebih detail, segera klik button berikut.
                </p>
                <button
                    onClick={handleLoginClick}
                    className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default Page;
