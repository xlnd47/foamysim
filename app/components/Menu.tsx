'use client'

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Balance from './Balance';

export default function Menu() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold">
            FoamySim
          </Link>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <ul className={`md:flex md:space-x-4 md:items-center ${isOpen ? 'block' : 'hidden'} absolute md:relative top-16 md:top-0 left-0 md:left-auto right-0 md:right-auto bg-gray-100 dark:bg-gray-800 md:bg-transparent p-4 md:p-0 shadow md:shadow-none`}>
            <li><Link href="/" className="block py-2 md:py-0 hover:text-gray-600 dark:hover:text-gray-300">Home</Link></li>
            {user && (
              <>
                <li><Link href="/packages" className="block py-2 md:py-0 hover:text-gray-600 dark:hover:text-gray-300">Packages</Link></li>
                <li><Link href="/esims" className="block py-2 md:py-0 hover:text-gray-600 dark:hover:text-gray-300">My eSIMs</Link></li>
              </>
            )}
            <li><Link href="/about" className="block py-2 md:py-0 hover:text-gray-600 dark:hover:text-gray-300">About</Link></li>
            <li><Link href="/contact" className="block py-2 md:py-0 hover:text-gray-600 dark:hover:text-gray-300">Contact</Link></li>
            <li><ThemeToggle /></li>
          </ul>
        </div>
        {user && (
          <div className="py-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <Balance />
          </div>
        )}
      </div>
    </nav>
  );
}