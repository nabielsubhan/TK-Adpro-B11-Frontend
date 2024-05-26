'use client'

import React, { useEffect, useState } from 'react';
import { useRouter} from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { format } from 'date-fns';

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

const SubscriptionsPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        const res = await fetch('http://35.247.189.213/subscriptions');
        const data: Subscription[] = await res.json();
        setSubscriptions(data);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };

    fetchData();
  }, [reload]);

  const handleAccept = async (subscriptionId: string) => {
    try {
      const response = await fetch(`http://35.247.189.213/subscriptions/${subscriptionId}/change-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!response.ok) {
        console.error('Error:', response.statusText);
      } else {
        setReload(!reload);
      }
    } catch (error) {
      console.error('Error accepting subscription:', error);
    }
  };

  const handleReject = async (subscriptionId: string) => {
    try {
      const response = await fetch(`http://35.247.189.213/subscriptions/${subscriptionId}/change-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (!response.ok) {
        console.error('Error:', response.statusText);
      } else {
        setReload(!reload);
      }
    } catch (error) {
      console.error('Error rejecting subscription:', error);
    }
  };

  if (!isAuthenticated) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px' }}>
      {subscriptions.map((subscription) => (
        <div key={subscription.subscriptionId} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', width: '300px' }}>
          <h3>Subscription Code: {subscription.subscriptionCode}</h3>
          <p><strong>ID:</strong> {subscription.subscriptionId}</p>
          <p><strong>Created Date:</strong> {format(new Date(subscription.createdDate), 'dd-MM-yyyy HH:mm:ss')}</p>
          <p><strong>Approval Status:</strong> {subscription.approvalStatus}</p>
          <p><strong>Subscription Status:</strong> {subscription.subscriptionStatus}</p>
          <p><strong>Type:</strong> {subscription.subscriptionType}</p>
          <p><strong>Customer ID:</strong> {subscription.customerId}</p>
          <p><strong>Box ID:</strong> {subscription.boxId}</p>
          <p><strong>Start Date:</strong> {subscription.startDate ? format(new Date(subscription.startDate), 'dd-MM-yyyy HH:mm:ss') : 'N/A'}</p>
          <p><strong>End Date:</strong> {subscription.endDate ? format(new Date(subscription.endDate), 'dd-MM-yyyy HH:mm:ss') : 'N/A'}</p>
          {subscription.approvalStatus === 'PENDING' && subscription.subscriptionStatus !== 'CANCELLED' && (
            <div>
              <button style={{ 
                  marginRight: '8px', 
                  padding: '8px 16px', 
                  backgroundColor: 'green', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}  onClick={() => handleAccept(subscription.subscriptionId)}>Approve</button>
              <button style={{ 
                  padding: '8px 16px', 
                  backgroundColor: 'red', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }} onClick={() => handleReject(subscription.subscriptionId)}>Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubscriptionsPage;
