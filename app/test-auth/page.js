'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function TestAuth() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setMessage('Attempting login...');
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        setMessage(`Error: ${result.error}`);
      } else if (result?.ok) {
        setMessage('Login successful! Refreshing session...');
        // Force session refresh
        window.location.reload();
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  if (status === 'loading') {
    return <div className="p-8">Loading authentication state...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Authentication Test</h1>
      
      {session ? (
        <div className="bg-green-100 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800">✓ Authenticated</h2>
          <div className="space-y-2 text-green-700">
            <p><strong>ID:</strong> {session.user?.id || 'Not available'}</p>
            <p><strong>Name:</strong> {session.user?.name || 'Not available'}</p>
            <p><strong>Email:</strong> {session.user?.email || 'Not available'}</p>
            <p><strong>Role:</strong> {session.user?.role || 'Not available'}</p>
            <p><strong>Provider:</strong> {session.user?.provider || 'Not available'}</p>
            <p><strong>Image:</strong> {session.user?.image ? 'Yes' : 'No'}</p>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/test-auth' })}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="bg-yellow-100 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">Not Authenticated</h2>
          <p className="text-yellow-700">Please log in to test the authentication system.</p>
        </div>
      )}

      {/* Credentials Login Form */}
      <div className="bg-white border-2 border-gray-200 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Email/Password Login</h3>
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Login with Email
          </button>
        </form>
        {message && (
          <div className={`mt-4 p-3 rounded ${
            message.includes('Error') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Google Login */}
      <div className="bg-white border-2 border-gray-200 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Google OAuth Login</h3>
        <button
          onClick={() => signIn('google', { callbackUrl: '/test-auth' })}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      {/* Test Database Connection */}
      <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Quick Test Credentials</h3>
        <p className="text-gray-600 mb-4">
          For testing, you can use these credentials if you have an existing account:
        </p>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm"><strong>Email:</strong> test@example.com</p>
          <p className="text-sm"><strong>Password:</strong> [Use your actual password]</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Make sure you have created an account first using the signup page.
        </p>
      </div>
    </div>
  );
}