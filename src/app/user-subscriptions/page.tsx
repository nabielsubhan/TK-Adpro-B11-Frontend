'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode'; // Ensure correct import

interface Subscription {
    subscriptionId: string;
    createdDate: string;
    subscriptionCode: string;
    approvalStatus: string;
    subscriptionStatus: string;
    subscriptionType: string;
    startDate: string | null;
    endDate: string | null;
    customerId: string;
    boxId: string;
}

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const decodedToken: any = jwtDecode(token); // Add type assertion for `any`
        const username = decodedToken.sub || ''; // Ensure username is defined

        if (token) {
            setIsAuthenticated(true);
            setUsername(username);
        } else {
            setIsAuthenticated(false);
            router.back();
        }
    }, []);

    return [isAuthenticated, username] as const; // Use `as const` for tuple return type
}

const SubscriptionsPage: React.FC = () => {
    const [isAuthenticated, username] = useAuth();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [reload, setReload] = useState<boolean>(true);
    const [filter, setFilter] = useState<string>('');

    useEffect(() => {
        if (reload) {
            fetch('http://35.247.189.213/subscriptions')
                .then((res) => res.json())
                .then((data: Subscription[]) => {
                    setSubscriptions(data);
                    setReload(false);
                })
                .catch((error) => {
                    console.error('Error reloading subscriptions:', error);
                });
        }
    }, [reload]);

    const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value);
    };

    const handleCancel = async (subscriptionId: string) => {
        try {
            const response = await fetch(`http://35.247.189.213/subscriptions/${subscriptionId}/unsubscribe`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Error:', response.statusText);
            } else {
                setReload(true);
            }
        } catch (error) {
            console.error('Error cancelling subscription:', error);
        }
    };

    const filteredSubscriptions = subscriptions.filter(subscription => {
        return subscription.customerId === username && (filter === '' || subscription.subscriptionStatus === filter);
    });

    const subscriptionStatuses = ['PENDING', 'SUBSCRIBED', 'CANCELLED'];

    if (!isAuthenticated) return null;
    return (
        <div>
            <select
                value={filter}
                onChange={handleFilterChange}
                style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f9f9f9',
                    color: '#333',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    marginTop: '16px',
                    marginLeft: '16px'
                }}
            >
                <option value="">All</option>
                {subscriptionStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>

            {filteredSubscriptions.length === 0 ? (
                <h3 style={{ textAlign: 'center' }}>Belum ada Subscription</h3>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px' }}>
                    {filteredSubscriptions.map((subscription) => (
                        <div key={subscription.subscriptionId} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', width: '300px' }}>
                            <h3>Subscription Code: {subscription.subscriptionCode}</h3>
                            <p><strong>ID:</strong> {subscription.subscriptionId}</p>
                            <p><strong>Created Date:</strong> {format(new Date(subscription.createdDate), 'dd-MM-yyyy HH:mm:ss')}</p>
                            <p><strong>Approval Status:</strong> {subscription.approvalStatus}</p>
                            <p><strong>Subscription Status:</strong> {subscription.subscriptionStatus}</p>
                            <p><strong>Type:</strong> {subscription.subscriptionType}</p>
                            <p><strong>Start Date:</strong> {subscription.startDate ? format(new Date(subscription.startDate), 'dd-MM-yyyy HH:mm:ss') : 'N/A'}</p>
                            <p><strong>End Date:</strong> {subscription.endDate ? format(new Date(subscription.endDate), 'dd-MM-yyyy HH:mm:ss') : 'N/A'}</p>
                            <div>
                                <button
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: subscription.subscriptionStatus === 'CANCELLED' ? 'grey' : 'red',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleCancel(subscription.subscriptionId)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubscriptionsPage;
