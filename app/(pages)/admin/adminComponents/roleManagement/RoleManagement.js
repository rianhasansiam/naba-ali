'use client';

import { useState } from 'react';
import { useGetData } from '@/lib/hooks/useGetData';
import { Shield, UserCheck, UserX, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function RoleManagement() {
  const [updating, setUpdating] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newRole, setNewRole] = useState('');

  // Fetch users with roles
  const { data: usersData, isLoading, error, refetch } = useGetData({
    name: 'admin-users',
    api: '/api/admin/role',
    cacheType: 'USER_SPECIFIC'
  });

  const updateUserRole = async (userId, role) => {
    setUpdating(prev => ({ ...prev, [userId]: true }));

    try {
      const response = await fetch('/api/admin/role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          newRole: role
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh the user list
        await refetch();
        setShowConfirmModal(false);
        setSelectedUser(null);
      } else {
        alert(result.error || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error updating user role');
    } finally {
      setUpdating(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleRoleChange = (user, role) => {
    setSelectedUser(user);
    setNewRole(role);
    setShowConfirmModal(true);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">Error loading users: {error.message}</span>
          </div>
        </div>
      </div>
    );
  }

  const users = usersData?.users || [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-blue-600" />
          Role Management
        </h2>
        <p className="text-gray-600 mt-1">
          Manage user roles and permissions
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.image ? (
                          <Image 
                            className="h-10 w-10 rounded-full" 
                            src={user.image} 
                            alt={user.name}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? (
                        <Shield className="w-3 h-3 mr-1" />
                      ) : (
                        <UserCheck className="w-3 h-3 mr-1" />
                      )}
                      {user.role?.toUpperCase() || 'USER'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {user.role !== 'admin' ? (
                        <button
                          onClick={() => handleRoleChange(user, 'admin')}
                          disabled={updating[user._id]}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 disabled:opacity-50 flex items-center"
                        >
                          <UserCheck className="w-3 h-3 mr-1" />
                          {updating[user._id] ? 'Updating...' : 'Make Admin'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(user, 'user')}
                          disabled={updating[user._id]}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 disabled:opacity-50 flex items-center"
                        >
                          <UserX className="w-3 h-3 mr-1" />
                          {updating[user._id] ? 'Updating...' : 'Remove Admin'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Role Change
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to change <strong>{selectedUser.name}</strong>&apos;s role to <strong>{newRole.toUpperCase()}</strong>?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => updateUserRole(selectedUser._id, newRole)}
                  disabled={updating[selectedUser._id]}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating[selectedUser._id] ? 'Updating...' : 'Confirm'}
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedUser(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}