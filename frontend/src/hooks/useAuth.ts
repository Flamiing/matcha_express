import { useState, useEffect } from 'react';
import authenticatedAxiosInstance from '@/utils/authenticatedAxiosInstance';

interface User {
    id: number;
    email: string;
}

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Attempt to fetch user data
                const response = await authenticatedAxiosInstance.get('/api/auth/me');
                console.log('User:', response.data);
                setUser(response.data);
            } catch (err) {
                // Handle errors and set user to null if not authenticated
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    const logout = async () => {
      try {
        await authenticatedAxiosInstance.post('/api/auth/logout', {}, { withCredentials: true });
        localStorage.removeItem('accessToken');
        setUser(null);
      } catch (err) {
        console.error('Logout failed:', err);
      }
    };

    return { user, logout };
};

export default useAuth;
