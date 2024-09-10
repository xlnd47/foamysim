'use client'

import { useState, useEffect, useMemo } from 'react';
import { getPackages, orderPackage } from '../services/packageService';
import CopyButton from './CopyButton';

interface Package {
  packageCode: string;
  name: string;
  price: number;
  currencyCode: string;
  volume: number;
  duration: number;
  durationUnit: string;
  location: string;
  description: string;
}

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [orderStatus, setOrderStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const data = await getPackages();
        setPackages(data.obj.packageList);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch packages');
        setLoading(false);
      }
    }

    fetchPackages();
  }, []);

  const filteredPackages = useMemo(() => {
    return packages.filter(pkg =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [packages, searchTerm]);

  const handlePackageClick = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  const formatLocation = (location: string) => {
    return location.split(',').map(loc => loc.trim()).join(', ');
  };

  const handleOrderPackage = async (pkg: Package) => {
    try {
      setOrderStatus(null);
      const result = await orderPackage(pkg.packageCode, pkg.price);
      if (result.success) {
        setOrderStatus({ success: true, message: `Order successful! Order number: ${result.obj.orderNo}` });
      } else {
        setOrderStatus({ success: false, message: result.errorMsg || 'Order failed' });
      }
    } catch (error) {
      setOrderStatus({ success: false, message: 'Failed to place order' });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Packages</h1>
      <input
        type="text"
        placeholder="Search packages..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          // Skeleton loader
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full text-center text-red-500">{error}</div>
        ) : (
          filteredPackages.map((pkg) => (
            <div
              key={pkg.packageCode}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handlePackageClick(pkg)}
            >
              <h2 className="text-xl font-semibold mb-2">{pkg.name}</h2>
              <p>Price: {(pkg.price / 10000).toFixed(2)} {pkg.currencyCode}</p>
              <p>Data: {pkg.volume / 1024 / 1024 / 1024} GB</p>
              <p>Duration: {pkg.duration} {pkg.durationUnit.toLowerCase()}s</p>
            </div>
          ))
        )}
      </div>
      {selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto p-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{selectedPackage.name}</h2>
            <div className="space-y-2">
              <p><strong>Package Code:</strong> {selectedPackage.packageCode}</p>
              <p><strong>Price:</strong> {(selectedPackage.price / 10000).toFixed(2)} {selectedPackage.currencyCode}</p>
              <p><strong>Data:</strong> {selectedPackage.volume / 1024 / 1024 / 1024} GB</p>
              <p><strong>Duration:</strong> {selectedPackage.duration} {selectedPackage.durationUnit.toLowerCase()}s</p>
              <div>
                <strong>Location:</strong>
                <p className="text-sm mt-1">{formatLocation(selectedPackage.location)}</p>
              </div>
              <p><strong>Description:</strong> {selectedPackage.description}</p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={() => handleOrderPackage(selectedPackage)}
              >
                Order Package
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => {
                  setSelectedPackage(null);
                  setOrderStatus(null);
                }}
              >
                Close
              </button>
            </div>
            {orderStatus && (
              <div className={`mt-4 p-2 rounded ${orderStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {orderStatus.message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}