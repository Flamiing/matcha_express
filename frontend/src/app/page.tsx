import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div>
            <h1>Landing Page</h1>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
            <Link href="/forgot-password">Forgot Password</Link>
        </div>
    );
}
