'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CryptoJS from 'crypto-js';
import Item from '@/app/item/interface';
import Box from '../interface';

type DecryptBoxProps = {
    setFormData: React.Dispatch<React.SetStateAction<Box>>;
};

const DecryptBox: React.FC<DecryptBoxProps> = ({ setFormData }) => {
    const decryptBoxId = (boxId: string) => {
        const bytes = CryptoJS.AES.decrypt(boxId, 'secret');
        return bytes.toString(CryptoJS.enc.Utf8);
    };

    const searchParams = useSearchParams();
    const encryptedBoxId = searchParams ? searchParams.get('encryptedBoxId') : null;
    const id = encryptedBoxId ? decryptBoxId(encryptedBoxId) : null;

    useEffect(() => {
        const fetchBox = async () => {
            try {
                const response = await fetch(`http://34.124.239.11/box/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch box');
                }
                const boxData = await response.json();
                setFormData(boxData);

            } catch (error) {
                console.error('Error fetching box:', error);
            }
        };

        if (id) {
            fetchBox();
        }
    }, [id]);

    return null; // This component doesn't render anything itself
};

const Page = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<Box>({
        id: '',
        name: '',
        description: '',
        picture: '',
        price: 0,
        items: []
    });

    const [items, setItems] = useState<Item[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('http://34.124.239.11/item/list', {
                    cache: 'no-cache'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch items');
                }

                const itemsData: Item[] = await response.json();
                setItems(itemsData);

            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, []);

    useEffect(() => {
        const selectedItemsTotalPrice = formData.items.reduce((acc, item) => {
            acc += item.price;
            return acc;
        }, 0);
        setTotalPrice(selectedItemsTotalPrice);
    }, [formData.items]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'price' ? parseInt(value) : value
        }));
    };

    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>, selectedItem: Item) => {
        const { checked } = e.target;
        if (checked) {
            setFormData(prevState => ({
                ...prevState,
                items: [...prevState.items, selectedItem]
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                items: prevState.items.filter(item => item.id !== selectedItem.id)
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://34.124.239.11/box/edit/${formData.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to update box');
            }

            router.push('/box');
        } catch (error) {
            console.error('Error updating box:', error);
        }
    };

    const formatRupiah = (harga: number) => {
        return `Rp${harga.toLocaleString('id-ID')}`;
    };

    return (
        <main className="container mx-auto w-full max-w-4xl justify-between boxs-center">
            <Suspense fallback={<div>Loading...</div>}>
                <DecryptBox setFormData={setFormData} />
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
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Items</label>
                    {items.map(item => (
                        <div key={item.id} className="flex items-center">
                            <input type="checkbox" id={`item-${item.id}`} name={`item-${item.id}`} value={item.id} onChange={(e) => handleItemChange(e, item)} className="mr-2" checked={formData.items.some(i => i.id === item.id)} />
                            <label htmlFor={`item-${item.id}`}>{item.name} - {formatRupiah(item.price)}</label>
                        </div>
                    ))}
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total Price</label>
                    <div>{formatRupiah(totalPrice)}</div>
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update</button>
            </form>
        </main>
    );
};

export default Page;
