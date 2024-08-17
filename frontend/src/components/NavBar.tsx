'use client'

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout(); // Call the logout function from useAuth
            // router.push('/'); // Redirect to homepage after logout
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="flex justify-between items-center p-4 border-b">
            {/* Logo Section */}
            <div className="text-xl font-bold">
                <Link href="/">Logo</Link>
            </div>

            {/* Conditional Navigation */}
            <div>
                {!user ? (
                    <Link href="/login">Login</Link>
                ) : (
                    <>
                        <span className="mr-4">Welcome, {user.email}</span>
                        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
