'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/config';
import { getRedirectResult } from 'firebase/auth';

export default function AuthRedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User successfully signed in
          console.log('User signed in:', result.user);
          router.push('/'); // Redirect to home page or dashboard
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
    };

    handleRedirectResult();
  }, [router]);

  return null;
}