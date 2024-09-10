'use client'

import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function SignOut() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button 
      onClick={handleSignOut}
      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      Sign Out
    </button>
  );
}