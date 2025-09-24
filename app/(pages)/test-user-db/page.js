import { auth } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/mongodb'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Server component to test user database integration
export default async function TestUserDbPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  // Get user from database to verify they exist
  let dbUser = null
  let allUsers = []
  let error = null

  try {
    const { database } = await connectToDatabase()
    
    // Get current user from database
    if (session.user?.email) {
      dbUser = await database.collection("users").findOne({ 
        email: session.user.email.toLowerCase() 
      })
    }
    
    // Get count of all users
    const userCount = await database.collection("users").countDocuments()
    
    // Get recent users (last 5) for display
    allUsers = await database.collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .project({ 
        name: 1, 
        email: 1, 
        provider: 1, 
        role: 1, 
        createdAt: 1,
        lastLoginAt: 1 
      })
      .toArray()

  } catch (err) {
    error = err.message
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">User Database Test</h1>
      
      {/* Current Session Info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Current Session</h2>
        <div className="space-y-2">
          <p><strong>Name:</strong> {session.user?.name || 'N/A'}</p>
          <p><strong>Email:</strong> {session.user?.email || 'N/A'}</p>
          <p><strong>ID:</strong> {session.user?.id || 'N/A'}</p>
          <p><strong>Role:</strong> {session.user?.role || 'N/A'}</p>
          <p><strong>Image:</strong> {session.user?.image ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Database User Info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Database Record</h2>
        {error ? (
          <div className="text-red-600">
            <p><strong>Error:</strong> {error}</p>
          </div>
        ) : dbUser ? (
          <div className="space-y-2">
            <p className="text-green-600 font-semibold">✓ User exists in database</p>
            <p><strong>Database ID:</strong> {dbUser._id.toString()}</p>
            <p><strong>Name:</strong> {dbUser.name}</p>
            <p><strong>Email:</strong> {dbUser.email}</p>
            <p><strong>Provider:</strong> {dbUser.provider || 'N/A'}</p>
            <p><strong>Role:</strong> {dbUser.role}</p>
            <p><strong>Created:</strong> {dbUser.createdAt ? new Date(dbUser.createdAt).toLocaleString() : 'N/A'}</p>
            <p><strong>Last Login:</strong> {dbUser.lastLoginAt ? new Date(dbUser.lastLoginAt).toLocaleString() : 'N/A'}</p>
            <p><strong>Email Verified:</strong> {dbUser.emailVerified ? 'Yes' : 'No'}</p>
          </div>
        ) : (
          <div className="text-yellow-600">
            <p><strong>⚠️ User not found in database</strong></p>
          </div>
        )}
      </div>

      {/* Recent Users */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Users in Database ({allUsers.length} shown)</h2>
        {allUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Provider</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user, index) => (
                  <tr key={user._id.toString()} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.provider || 'N/A'}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No users found in database</p>
        )}
      </div>

      {/* Test Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
        <div className="space-y-4">
          <div>
            <Link 
              href="/api/auth/signout" 
              className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sign Out
            </Link>
          </div>
          <div>
            <Link 
              href="/login" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </div>
          <div>
            <Link 
              href="/signup" 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Go to Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}