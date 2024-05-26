'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import LandingPage from './components/LandingPage';

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

const Page: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useAuth();
    const [isAdmin, setIsAdmin] = checkAdmin();
    const router = useRouter();

    return (
        <div>
            <LandingPage />
        </div>
    );
};

export default Page;