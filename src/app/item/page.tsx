'use client'

import { useState, useEffect } from 'react';
import Item from './interface';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';

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

        if (token && username === 'admin') {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            router.back();
        }
    }, []);

    return [isAuthenticated, setIsAuthenticated];
}

const Page: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useAuth();
    const router = useRouter();
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('http://34.124.239.11/item/list', {
                    cache: 'no-cache'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const itemsData: Item[] = await response.json();
                setItems(itemsData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchItems();
    }, []);

    const handleDelete = async (itemId: string) => {
        try {
            const response = await fetch(`http://34.124.239.11/item/delete/${itemId}`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            const updatedItems = items.filter(item => item.id !== itemId);
            setItems(updatedItems);

        } catch (error) {
            console.error('Error deleting item:', error);
            window.alert('Item tidak berhasil dihapus! Coba cek lagi apakah ada Box yang berisi Item ini!');
        }
    };

    const encryptItemId = (itemId: string) => {
        return CryptoJS.AES.encrypt(itemId, 'secret').toString();
    };

    const itemList = () => {
        return (
            <div className="grid grid-cols-3 gap-10">
                {items.map(item => (
                    <div key={item.id} className="bg-white shadow-md rounded p-4 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-m font-bold">{item.name}</h2>
                            <div className="flex space-x-2">
                                <button className="mr-1" onClick={() => handleDelete(item.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-red-700 hover:fill-red-900" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <Link href={{ pathname: "/item/edit", query: { encryptedItemId: encryptItemId(item.id) } }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-green-700 hover:fill-green-900" viewBox="0 0 24 24">
                                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                    </svg>
                                </Link>
                            </div>
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
            <p className="flex justify-center">Klik button berikut ini untuk buat Item baru:</p>
            <div className="flex justify-center mt-2">
                <button className="bg-black text-white px-6 py-2 rounded-full hover:shadow-md">
                    <Link href="/item/create">
                        Create Item
                    </Link>
                </button>
            </div>
            <div className="bg-neutral-200 p-8 rounded-lg mt-8 pt-4">
                <p className="flex justify-center font-bold pb-4 text-lg">List Item</p>
                <div>{itemList()}</div>
            </div>
        </main>
    )
};

export default Page;
