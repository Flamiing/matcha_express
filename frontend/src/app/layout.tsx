import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Matcha',
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Navbar />
                {children}
                <footer
                    style={{
                        backgroundColor: 'blue',
                        color: 'white',
                        padding: '10px',
                    }}
                >
                    <p>Footer</p>
                </footer>
            </body>
        </html>
    );
}
