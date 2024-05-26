'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    return [isAuthenticated, setIsAuthenticated];
}

function checkAdmin() {
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAdmin(false);
            return;
        }

        const decodedToken = jwtDecode(token);
        const username = decodedToken.sub;

        if (token && username === 'admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, []);

    return [isAdmin, setIsAdmin];
}

const Header: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useAuth();
    const [isAdmin, setIsAdmin] = checkAdmin();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        if (typeof setIsAuthenticated === 'function') {
            setIsAuthenticated(false);
        }
        router.replace('/');
    };

    const renderAdminLinks = () => {
        return (
            <div className="flex gap-8 items-center">
                <Link href="/item/" className="hover:underline">Item</Link>
                <Link href="/box/" className="hover:underline">Subscription Box</Link>
                <Link href="/dashboard/" className="hover:underline">Profile</Link>
                {/* <Link href="/subscription/" className="hover:underline">Subscription</Link> */}
                <button onClick={handleLogout} className="font-bold bg-black text-white px-6 py-2 rounded-full hover:shadow-md">
                    Logout
                </button>
            </div>
        );
    };

    const renderUserLinks = () => {
        return (
            <div className="flex gap-8 items-center">
                <Link href="/dashboard/" className="hover:underline">Profile</Link>
                <button onClick={handleLogout} className="font-bold bg-black text-white px-6 py-2 rounded-full hover:shadow-md">
                    Logout
                </button>
            </div>
        );
    };

    if (!isAuthenticated) return null;

    return (
        <header className="container mx-auto py-4">
            <div className="flex flex-row justify-between items-center">
                <Link href={isAdmin ? "/landing-admin" : "/landing-user"} className="text-amber-900 text-lg font-bold">KoleksiKota</Link>
                {isAuthenticated && isAdmin && renderAdminLinks()}
                {isAuthenticated && !isAdmin && renderUserLinks()}
            </div>
        </header>
    );
};

export default Header;