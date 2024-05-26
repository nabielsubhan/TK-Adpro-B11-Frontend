"use client";

import { useState, useEffect } from "react";
import Box from "./interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";

const Page: React.FC = () => {
    const router = useRouter();
    const [boxes, setBoxes] = useState<Box[]>([]);

    useEffect(() => {
        const fetchBoxes = async () => {
            try {
                const response = await fetch("http://34.124.239.11/box/list", {
                    cache: "no-cache",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const boxesData: Box[] = await response.json();
                setBoxes(boxesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchBoxes();
    }, []);

    const handleDelete = async (boxId: string) => {
        try {
            const response = await fetch(
                `http://34.124.239.11/box/delete/${boxId}`,
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete box");
            }

            const updatedBoxes = boxes.filter((box) => box.id !== boxId);
            setBoxes(updatedBoxes);
        } catch (error) {
            console.error("Error deleting box:", error);
        }
    };

    const encryptBoxId = (boxId: string) => {
        return CryptoJS.AES.encrypt(boxId, "secret").toString();
    };

    const boxList = () => {
        return (
            <div className="grid grid-cols-3 gap-10">
                {boxes.map((box) => (
                    <div
                        key={box.id}
                        className="bg-white shadow-md rounded p-4 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-m font-bold">{box.name}</h2>
                            <div className="flex space-x-2">
                                <button className="mr-1" onClick={() => handleDelete(box.id)}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 fill-red-700 hover:fill-red-900"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                <Link
                                    href={{
                                        pathname: "/box/edit",
                                        query: { encryptedBoxId: encryptBoxId(box.id) },
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 fill-green-700 hover:fill-green-900"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                    </svg>
                                </Link>
                            </div>
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
                                Items: {box.items.map((item) => item.name).join(", ")}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const formatRupiah = (harga: number) => {
        return `Rp${harga.toLocaleString("id-ID")}`;
    };

    return (
        <main className="container mx-auto w-full max-w-4xl justify-between items-center">
            <div className="flex justify-center mt-8">
                <button className="bg-black text-white px-6 py-2 rounded-full hover:shadow-md">
                    <Link href="/box/create">Create Box</Link>
                </button>
            </div>
            <div className="my-8">{boxList()}</div>
        </main>
    );
};

export default Page;
