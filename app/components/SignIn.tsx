'use client'

import { useState } from 'react';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup } from 'firebase/auth';

export default function SignIn() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isSigningIn}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
    >
      {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
    </button>
  );
}