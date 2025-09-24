'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function CredentialsTestPage() {
  const { data: session, status } = useSession()
  const [testEmail, setTestEmail] = useState('test@example.com')
  const [testPassword, setTestPassword] = useState('password123')
  const [testResult, setTestResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testCredentialsLogin = async () => {
    setIsLoading(true)
    setTestResult('Testing credentials login...')

    try {
      const result = await signIn('credentials', {
        email: testEmail,
        password: testPassword,
        redirect: false,
      })

      if (result?.error) {
        setTestResult(`❌ Login failed: ${result.error}`)
      } else if (result?.ok) {
        setTestResult(`✅ Login successful! Refreshing session...`)
        // Force session refresh
        window.location.reload()
      } else {
        setTestResult(`⚠️ Unexpected result: ${JSON.stringify(result)}`)
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const createTestUser = async () => {
    setIsLoading(true)
    setTestResult('Creating test user...')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: testEmail,
          password: testPassword,
          confirmPassword: testPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setTestResult(`✅ Test user created successfully!`)
      } else {
        setTestResult(`❌ Failed to create user: ${data.error}`)
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testUserStatus = async () => {
    setIsLoading(true)
    setTestResult('Checking user status...')

    try {
      const response = await fetch('/api/auth/user-status')
      const data = await response.json()

      if (response.ok) {
        setTestResult(`✅ User Status:
        - Email: ${data.user?.email || 'N/A'}
        - ID: ${data.user?.id || 'N/A'}
        - Role: ${data.user?.role || 'N/A'}
        - Provider: ${data.user?.provider || 'N/A'}
        - Session ID: ${data.session?.id || 'N/A'}`)
      } else {
        setTestResult(`❌ ${data.error || data.message}`)
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Credentials Authentication Test</h1>

      {/* Session Status */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Current Session</h2>
        <div className="space-y-2">
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Email:</strong> {session?.user?.email || 'Not signed in'}</p>
          <p><strong>Name:</strong> {session?.user?.name || 'N/A'}</p>
          <p><strong>ID:</strong> {session?.user?.id || 'N/A'}</p>
          <p><strong>Role:</strong> {session?.user?.role || 'N/A'}</p>
          <p><strong>Provider:</strong> {session?.user?.provider || 'N/A'}</p>

          {session && (
            <button
              onClick={() => signOut()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Test Controls */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Test Email:</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Test Password:</label>
            <input
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={createTestUser}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Create Test User
            </button>
            
            <button
              onClick={testCredentialsLogin}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Test Login
            </button>

            {session && (
              <button
                onClick={testUserStatus}
                disabled={isLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                Check User Status
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Test Results */}
      {testResult && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded">
            {testResult}
          </pre>
        </div>
      )}

      {/* Debug Info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
        <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
          {JSON.stringify({ status, session }, null, 2)}
        </pre>
      </div>
    </div>
  )
}