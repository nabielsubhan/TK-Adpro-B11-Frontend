'use client'

import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const Page: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);

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
                    Platform subscription box pertama di Indonesia. Pada platform ini, Anda bisa mengelola subscription box dari berbagai daerah di Indonesia.
                </p>
                <p className="text-lg mb-6 font-bold text-black">
                    Rating dan Review
                </p>
                <p className="text-lg mb-6 text-black">
                    Anda memiliki kontrol penuh atas ulasan dan penilaian yang diberikan oleh pengguna terhadap berbagai subscription box. Anda dapat mengelola, meninjau, mengedit, dan menghapus ulasan serta rating tersebut sesuai kebijakan.
                </p>
                <p className="text-lg mb-6 font-bold text-black">
                    Subscription Management
                </p>
                <p className="text-lg mb-6 text-black">
                    Anda memiliki kewenangan untuk mengatur status permintaan langganan subscription box, memastikan proses berjalan lancar dari permintaan hingga persetujuan atau penolakan.
                </p>
            </div>
        </div>
    );
};

export default Page;
