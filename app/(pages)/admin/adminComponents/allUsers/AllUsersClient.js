'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import defaultAvatar from '../../../../../public/logo.png';
import { 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  Mail, 
  Calendar,
  ShoppingBag,
  DollarSign,
  Crown,
  Star,
  Eye
} from 'lucide-react';
import { useGetData } from '@/lib/hooks/useGetData';

const AllUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  const { data, isLoading, error } = useGetData({ name: 'users', api: '/api/users' });

  useEffect(() => {
    if (data) {
      // Ensure data is always an array
      setAllUsers(Array.isArray(data) ? data : [data]);
    }
  }, [data]);

  // Search filter
  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserStatusIcon = (status) => {
    switch ((status || 'regular').toLowerCase()) {
      case 'vip':
        return <Crown className="text-gray-600" size={16} />;
      case 'premium':
        return <Star className="text-gray-600" size={16} />;
      default:
        return <Users className="text-gray-600" size={16} />;
    }
  };

  const getUserStatusColor = (status) => {
    switch ((status || 'regular').toLowerCase()) {
      case 'vip':
      case 'premium':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage your customer base and relationships</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent w-full lg:w-72"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
          >
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={user?.image || defaultAvatar}
                  alt={user?.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    <div className="flex items-center space-x-1">
                      {getUserStatusIcon(user.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserStatusColor(user.status)}`}>
                        {(user.role || 'User').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail size={14} className="mr-2" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <div className="flex items-center text-sm">
                    <Calendar size={14} className="mr-2 text-gray-400" />
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
               
                
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    <Eye size={14} />
                    <span>View</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
