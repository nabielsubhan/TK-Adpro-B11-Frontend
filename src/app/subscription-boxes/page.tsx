'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';
import { jwtDecode } from "jwt-decode";
import Box from '../box/interface';
import Link from 'next/link';

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

        if (token && username !== 'admin') {
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
    const [boxes, setBoxes] = useState<Box[]>([]);
    const [search, setSearch] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [filteredBoxes, setFilteredBoxes] = useState<Box[]>([]);

    useEffect(() => {
        const fetchBoxes = async () => {
            try {
                const response = await fetch('http://34.124.239.11/box/list', {
                    cache: 'no-cache',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const boxesData: Box[] = await response.json();
                setBoxes(boxesData);
                setFilteredBoxes(boxesData); // Initialize filtered boxes
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchBoxes();
    }, []);

    const encryptBoxId = (boxId: string) => {
        try {
            return CryptoJS.AES.encrypt(boxId, 'secret').toString();
        } catch (error) {
            console.error('Error encrypting box ID:', error);
            return '';
        }
    };
    

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleMinPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMinPrice(event.target.value ? parseFloat(event.target.value) : '');
    };

    const handleMaxPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMaxPrice(event.target.value ? parseFloat(event.target.value) : '');
    };

    useEffect(() => {
        const filterBoxes = () => {
            const filtered = boxes.filter((box) => {
                const matchesName = box.name.toLowerCase().includes(search.toLowerCase());
                const matchesMinPrice = minPrice === '' || box.price >= minPrice;
                const matchesMaxPrice = maxPrice === '' || box.price <= maxPrice;
                return matchesName && matchesMinPrice && matchesMaxPrice;
            });
            setFilteredBoxes(filtered);
        };

        filterBoxes();
    }, [search, minPrice, maxPrice, boxes]);

    const boxList = () => {
        return (
            <div className="grid grid-cols-3 gap-10">
                {filteredBoxes.map((box) => (
                    <div
                        key={box.id}
                        className="bg-white shadow-md rounded p-4 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-m font-bold">{box.name}</h2>
                        </div>
                        <div className="flex justify-center items-center">
                            <img src={box.picture} alt={box.name} className="w-auto h-48" />
                        </div>
                        <p className="text-sm mt-2">{box.description}</p>
                        <p className="text-sm font-semibold mt-2">
                            {formatRupiah(box.price)}
                        </p>
                        {box.items.length === 0 ? (
                            <p className="text-sm mt-2">No items</p>
                        ) : (
                            <p className="text-sm mt-2">
                                Items: {box.items.map((item) => item.name).join(', ')}
                            </p>
                        )}
                        <Link href={{ pathname: "/box-details", query: { boxId: box.id } }} className="hover:underline">View Details</Link>
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
                <p className="flex justify-center font-bold pb-4 text-lg">List Box</p>
                <input
                    type="text"
                    placeholder="Search boxes by name"
                    value={search}
                    onChange={handleSearchChange}
                    className="p-2 mb-4 w-full border rounded"
                />
                <div className="flex space-x-4 mb-4">
                    <input
                        type="number"
                        placeholder="Min price"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        className="p-2 w-full border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Max price"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        className="p-2 w-full border rounded"
                    />
                </div>
                <div>{boxList()}</div>
            </div>
        </main>
    );
};

export default Page;
