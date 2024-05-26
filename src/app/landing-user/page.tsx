'use client'

import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; 

const Page: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const isAuthenticated = true;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token);
            setUsername(decodedToken.sub);
        }
    }, []);

    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
            style={{ backgroundImage: 'url("https://ik.imagekit.io/tvlk/blog/2023/05/shutterstock_1445673728.jpg?tr=dpr-2,w-675")' }}
        >
            <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg text-center max-w-3xl">
                <h1 className="text-4xl font-bold mb-4 text-black">Selamat datang di KoleksiKota, {username}!</h1>
                <p className="text-lg mb-6 text-black">
                    Platform subscription box pertama di Indonesia. Pada platform ini, Anda bisa berlangganan subscription box dari berbagai daerah di Indonesia.
                </p>
                <p className="text-lg mb-6 font-bold text-black">
                    Rating dan Review
                </p>
                <p className="text-lg mb-6 text-black">
                    Anda memiliki kebebasan untuk memberikan ulasan dan menilai subscription box yang mereka nikmati. Anda juga dapat melihat ulasan dan rating dari pengguna lain sebelum memutuskan untuk berlangganan.
                </p>
                <p className="text-lg mb-6 font-bold text-black">
                    Subscription Box
                </p>
                <p className="text-lg mb-6 text-black">
                    Anda dapat dengan mudah menelusuri, memilih, dan mengelola subscription box yang anda inginkan. Dari melihat detail produk hingga mengatur langganan, semuanya dapat dilakukan dengan cepat dan mudah.
                </p>
            </div>
        </div>
    );
};

export default Page;
