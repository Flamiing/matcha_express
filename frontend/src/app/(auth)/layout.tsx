// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useState } from 'react';

// const navLinks = [
//     { name: 'Register', href: '/register' },
//     { name: 'Login', href: '/login' },
//     { name: 'Forgot Password', href: '/forgot-password' },
// ];

// export default function AuthLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     const pathname = usePathname();
//     const [input, setInput] = useState('');

//     return (
//         <div>
//             <div>
//                 <input
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     type="text"
//                     placeholder="Username"
//                 />
//             </div>
//             {navLinks.map((link) => {
//                 const isActive = pathname.startsWith(link.href);
//                 return (
//                     <Link
//                         key={link.href}
//                         href={link.href}
//                         className={
//                             isActive ? 'font-bold mr-4' : 'mr-4 text-blue-600'
//                         }
//                     >
//                         {link.name}
//                     </Link>
//                 );
//             })}
//             {children}
//         </div>
//     );
// }
