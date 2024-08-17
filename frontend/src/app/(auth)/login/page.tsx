'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const router = useRouter();

    const handleClick = () => {
        console.log('Login button clicked');
        router.push('/home');
    };

    return (
        <>
            <h1>Login Page</h1>
            <button onClick={handleClick}>Login</button>
        </>
    );
};

export default LoginPage;
