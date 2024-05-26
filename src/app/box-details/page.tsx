'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';
import Item from '../item/interface';
import Box from '../box/interface';

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const decodedToken = jwtDecode(token);
        const username = decodedToken.sub;

        if (token && username != 'admin') {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            router.back();
        }
    }, []);

    return [isAuthenticated, setIsAuthenticated];
}

const decryptBoxId = (boxId: string | null) => {
    if (!boxId) {
        return '';
    }
    const bytes = CryptoJS.AES.decrypt(boxId, 'secret');
    return bytes.toString(CryptoJS.enc.Utf8);
};

const Page: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useAuth();
    const router = useRouter();
    const [items, setItems] = useState<Item[]>([]);
    const [boxData, setBoxData] = useState<Box | null>(null); // Define boxData state
    const searchParams = useSearchParams();
    const boxId = searchParams ? searchParams.get('boxId') : null;

    useEffect(() => {
        const fetchBoxAndItems = async () => {
            try {
                // Fetch box data
                const boxResponse = await fetch(`http://34.124.239.11/box/${boxId}`, {
                    cache: 'no-cache'
                });

                if (!boxResponse.ok) {
                    throw new Error('Failed to fetch box data');
                }

                const boxData = await boxResponse.json();
                setBoxData(boxData);

                setItems(boxData.items);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (boxId) {
            fetchBoxAndItems();
        }
    }, [boxId]);

    const itemList = () => {
        return (
            <div className="grid grid-cols-3 gap-10">
                {items.map(item => (
                    <div key={item.id} className="bg-white shadow-md rounded p-4 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-m font-bold">{item.name}</h2>
                        </div>
                        <div className="flex justify-center items-center">
                            <img src={item.picture} alt={item.name} className="w-auto h-48" />
                        </div>
                        <p className="text-sm mt-2">{item.description}</p>
                        <p className="text-sm font-semibold mt-2">{formatRupiah(item.price)}</p>
                    </div>
                ))}
            </div>
        );
    };

    const formatRupiah = (harga: number) => {
        return `Rp${harga.toLocaleString('id-ID')}`;
    };

    if (!isAuthenticated) return null;

    return (
        <main className="container mx-auto w-full max-w-4xl justify-between items-center">
            <div className="bg-neutral-200 p-8 rounded-lg mt-8 pt-4">
                {boxData && ( // Check if boxData exists before rendering
                    <div>
                        <div className="flex justify-center items-center">
                            <img src={boxData.picture} alt={boxData.name} className="w-auto h-48" />
                        </div>
                        <p className="text-sm mt-2">{boxData.description}</p>
                        <p className="text-sm font-semibold mt-2">
                            {formatRupiah(boxData.price)}
                        </p>
                    </div>
                )}
                <p className="flex justify-center font-bold pb-4 text-lg">List Item</p>
                <div>{itemList()}</div>
                <div className="flex justify-center mt-8">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Subscribe
                    </button>
                </div>
            </div>
        </main>
    )
};

export default Page;
