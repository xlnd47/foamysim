'use client'

import { useAuth } from './context/AuthContext';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Welcome to FoamySim</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        {user ? (
          <div>
            <p className="mb-4">Welcome, {user.email}!</p>
            <SignOut />
          </div>
        ) : (
          <div>
            <p className="mb-4">Please sign in to continue:</p>
            <SignIn />
          </div>
        )}
      </div>
    </>
  );
}