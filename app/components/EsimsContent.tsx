'use client'

import { useState, useEffect } from 'react';
import { getEsims, cancelEsim } from '../services/esimService';
import CopyButton from './CopyButton';

interface Esim {
  orderNo: string;
  iccid: string;
  qrCodeUrl: string;
  esimStatus: string;
  expiredTime: string;
  packageList: Array<{
    packageName: string;
    duration: number;
    durationUnit: string;
    volume: number;
    locationCode: string;
    createTime: string;
  }>;
  msisdn: string;
  pin: string;
  puk: string;
  apn: string;
  esimTranNo: string;
  transactionId: string;
  imsi: string;
  activateTime: string | null;
  totalVolume: number;
  totalDuration: number;
  ac: string;
  shortUrl: string;
  smdpStatus: string;
  // Add downloadTime and updateTime if available from the API
  // downloadTime: string;
  // updateTime: string;
}

export default function EsimsContent() {
  const [esims, setEsims] = useState<Esim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEsim, setSelectedEsim] = useState<Esim | null>(null);
  const [cancellationStatus, setCancellationStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    async function fetchEsims() {
      try {
        const data = await getEsims();
        setEsims(data.obj.esimList);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch eSIMs');
        setLoading(false);
      }
    }

    fetchEsims();
  }, []);

  const handleEsimClick = (esim: Esim) => {
    console.log('eSIM clicked:', esim);
    setSelectedEsim(esim);
  };

  const handleCancelEsim = async (iccid: string) => {
    try {
      setCancellationStatus(null);
      const result = await cancelEsim(iccid);
      if (result.success) {
        setCancellationStatus({ success: true, message: 'eSIM cancelled successfully' });
        // Refresh the eSIM list
        const data = await getEsims();
        setEsims(data.obj.esimList);
      } else {
        setCancellationStatus({ success: false, message: result.errorMsg || 'Failed to cancel eSIM' });
      }
    } catch (error) {
      setCancellationStatus({ success: false, message: 'Failed to cancel eSIM' });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My eSIMs</h1>
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
          esims.map((esim) => (
            <div
              key={esim.iccid}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4"
            >
              <h2 className="text-xl font-semibold mb-2">{esim.packageList?.[0]?.packageName || 'Unknown Package'}</h2>
              <p>Status: {esim.esimStatus}</p>
              <p>Expires: {new Date(esim.expiredTime).toLocaleDateString()}</p>
              <p>Data: {(esim.totalVolume / 1024 / 1024 / 1024).toFixed(2)} GB</p>
              <p>Duration: {esim.totalDuration} {esim.packageList?.[0]?.durationUnit?.toLowerCase() || 'days'}</p>
              <button
                onClick={() => handleEsimClick(esim)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>
      {selectedEsim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto p-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-5xl">
            <h2 className="text-2xl font-bold mb-4">eSIM Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <p><strong>Alias ID:</strong> {selectedEsim.esimTranNo}</p>
                <p><strong>Duration:</strong> {selectedEsim.totalDuration} {selectedEsim.packageList?.[0]?.durationUnit || 'Days'}</p>
                <p><strong>Create time:</strong> {new Date(selectedEsim.packageList?.[0]?.createTime).toLocaleString()}</p>
                <p><strong>Activate time:</strong> {selectedEsim.activateTime ? new Date(selectedEsim.activateTime).toLocaleString() : '-'}</p>
                <p><strong>Download time:</strong> {selectedEsim.downloadTime ? new Date(selectedEsim.downloadTime).toLocaleString() : '-'}</p>
                <p><strong>Profile status:</strong> {selectedEsim.smdpStatus}</p>
                <p><strong>PIN:</strong> {selectedEsim.pin}</p>
                <p><strong>PUK:</strong> {selectedEsim.puk}</p>
                <p><strong>APN:</strong> {selectedEsim.apn}</p>
                <p><strong>Merchant tran id:</strong> {selectedEsim.transactionId}</p>
                <div className="flex items-center space-x-2">
                  <p><strong>Activation code:</strong> {selectedEsim.ac}</p>
                  <CopyButton text={selectedEsim.ac} />
                </div>
                <div className="flex items-center space-x-2">
                  <p><strong>QR code URL:</strong> <a href={selectedEsim.qrCodeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{selectedEsim.qrCodeUrl}</a></p>
                  <CopyButton text={selectedEsim.qrCodeUrl} />
                </div>
                <div className="flex items-center space-x-2">
                  <p><strong>Short URL:</strong> <a href={selectedEsim.shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{selectedEsim.shortUrl}</a></p>
                  <CopyButton text={selectedEsim.shortUrl} />
                </div>
                <p><strong>ICCID:</strong> {selectedEsim.iccid}</p>
                <p><strong>IMSI:</strong> {selectedEsim.imsi}</p>
              </div>
              <div className="space-y-2">
                <p><strong>Batch ID:</strong> {selectedEsim.orderNo}</p>
                <p><strong>Data:</strong> {(selectedEsim.totalVolume / 1024 / 1024 / 1024).toFixed(2)} GB</p>
                <p><strong>Update time:</strong> {selectedEsim.updateTime ? new Date(selectedEsim.updateTime).toLocaleString() : '-'}</p>
                <p><strong>Status:</strong> {selectedEsim.esimStatus}</p>
                <p><strong>Expired time:</strong> {new Date(selectedEsim.expiredTime).toLocaleDateString()}</p>
                {selectedEsim.qrCodeUrl && (
                  <div className="mt-4">
                    <p><strong>QR Code:</strong></p>
                    <img src={selectedEsim.qrCodeUrl} alt="QR Code" className="max-w-full h-auto" />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => handleCancelEsim(selectedEsim.iccid)}
              >
                Cancel eSIM
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => {
                  setSelectedEsim(null);
                  setCancellationStatus(null);
                }}
              >
                Close
              </button>
            </div>
            {cancellationStatus && (
              <div className={`mt-4 p-2 rounded ${cancellationStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {cancellationStatus.message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}