'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Ticket, Calendar, Percent } from 'lucide-react';

const AllCupons = () => {
  const [coupons] = useState([
    {
      id: 1,
      code: 'WELCOME20',
      discount: 20,
      type: 'percentage',
      description: 'Welcome discount for new customers',
      minAmount: 50,
      usageLimit: 100,
      used: 45,
      startDate: '2025-09-01',
      endDate: '2025-12-31',
      status: 'active'
    },
    {
      id: 2,
      code: 'SUMMER50',
      discount: 50,
      type: 'fixed',
      description: 'Summer sale fixed discount',
      minAmount: 200,
      usageLimit: 50,
      used: 23,
      startDate: '2025-06-01',
      endDate: '2025-09-30',
      status: 'active'
    },
    {
      id: 3,
      code: 'EXPIRED10',
      discount: 10,
      type: 'percentage',
      description: 'Expired promotion code',
      minAmount: 30,
      usageLimit: 200,
      used: 156,
      startDate: '2025-01-01',
      endDate: '2025-08-31',
      status: 'expired'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'disabled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
        <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          <Plus size={16} />
          <span>Add Coupon</span>
        </button>
      </div>

      <div className="space-y-4">
        {coupons.map((coupon, index) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Ticket className="text-gray-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">{coupon.code}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(coupon.status)}`}>
                    {coupon.status.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{coupon.description}</p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Discount</p>
                    <div className="flex items-center space-x-1">
                      <Percent className="text-green-600" size={16} />
                      <span className="font-bold text-green-600">
                        {coupon.type === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Min Amount</p>
                    <span className="font-bold text-gray-900">${coupon.minAmount}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Usage</p>
                    <span className="font-bold text-gray-600">{coupon.used}/{coupon.usageLimit}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Valid Until</p>
                    <div className="flex items-center space-x-1">
                      <Calendar className="text-gray-400" size={16} />
                      <span className="font-bold text-gray-900">{coupon.endDate}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
                <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AllCupons;
