'use client'

import React, { useState, useEffect, Suspense } from 'react';
import CryptoJS from 'crypto-js';
import { useRouter, useSearchParams } from 'next/navigation';
import jwtDecode from 'jwt-decode';

type Item = {
    id: string;
    name: string;
    price: number;
    picture: string;
    description: string;
};

type Box = {
    id: string;
    name: string;
    description: string;
    picture: string;
    price: number;
    items: Item[];
};

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const decodedToken: { sub: string } = jwtDecode(token);
        const username = decodedToken.sub;

        if (token && username === 'admin') {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            router.back();
        }
    }, []);

    return [isAuthenticated];
}

type DecryptItemProps = {
    setFormData: React.Dispatch<React.SetStateAction<Item>>;
};

const DecryptItem: React.FC<DecryptItemProps> = ({ setFormData }) => {
    const decryptItemId = (itemId: string) => {
        const bytes = CryptoJS.AES.decrypt(itemId, 'secret');
        return bytes.toString(CryptoJS.enc.Utf8);
    };

    const searchParams = useSearchParams();
    const encryptedItemId = searchParams ? searchParams.get('encryptedItemId') : null;
    const id = encryptedItemId ? decryptItemId(encryptedItemId) : null;

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await fetch(`http://34.124.239.11/item/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch item');
                }
                const itemData = await response.json();
                setFormData(itemData);

            } catch (error) {
                console.error('Error fetching item:', error);
            }
        };

        if (id) {
            fetchItem();
        }
    }, [id]);

    return null; // This component doesn't render anything itself
};

const Page = () => {
    const [formData, setFormData] = useState<Item>({
        id: '',
        name: '',
        price: 0,
        picture: '',
        description: ''
    });

    const [isAuthenticated] = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'price' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://34.124.239.11/item/edit/${formData.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }

            router.push('/item');

        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    return (
        <main className="container mx-auto w-full max-w-4xl justify-between items-center">
            <Suspense fallback={<div>Loading...</div>}>
                <DecryptItem setFormData={setFormData} />
            </Suspense>
            <form className="max-w-sm mx-auto mt-8" onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="picture" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Picture URL</label>
                    <input type="url" id="picture" name="picture" value={formData.picture} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                    <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update</button>
            </form>
        </main>
    );
};

export default Page;
