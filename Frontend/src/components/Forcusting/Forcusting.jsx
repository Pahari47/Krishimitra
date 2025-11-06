import React, { useState } from 'react';
import { Wifi, Activity, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function DeviceConnection() {
  const [step, setStep] = useState(1);
  const [deviceId, setDeviceId] = useState('');
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setConnectionStatus('success');
      setStep(3);
    }, 3000);
  };

  const resetConnection = () => {
    setStep(1);
    setDeviceId('');
    setWifiSSID('');
    setWifiPassword('');
    setConnectionStatus(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Connect Your Smart Farming Device</h1>
          <p className="text-gray-600">Get real-time soil data from your ESP32 sensor</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              1
            </div>
            <div className={`w-20 h-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              2
            </div>
            <div className={`w-20 h-1 ${step >= 3 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              3
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Device Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 1: Locate Your Device</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Find your Device ID</p>
                      <p>The Device ID is printed on a sticker on your ESP32 device. It starts with "ESP32-"</p>
                    </div>
                  </div>
                </div>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Device ID
                </label>
                <input
                  type="text"
                  placeholder="ESP32-XXXXXXXX"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!deviceId}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: WiFi Configuration */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step 2: Configure WiFi</h2>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <Wifi className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold mb-1">Connect to Device WiFi First</p>
                      <p>Connect your phone/computer to the WiFi network named "{deviceId || 'ESP32-XXXXXXXX'}" before proceeding.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your WiFi Network Name (SSID)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your WiFi name"
                      value={wifiSSID}
                      onChange={(e) => setWifiSSID(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WiFi Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your WiFi password"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleConnect}
                  disabled={!wifiSSID || !wifiPassword || isConnecting}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isConnecting ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect Device'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && connectionStatus === 'success' && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Successfully Connected!</h2>
                <p className="text-gray-600">Your ESP32 device is now connected and sending live soil data.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Device ID:</span>
                  <span className="text-sm font-semibold text-gray-800">{deviceId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Network:</span>
                  <span className="text-sm font-semibold text-gray-800">{wifiSSID}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <span className="inline-flex items-center text-sm font-semibold text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={resetConnection}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Connect Another Device
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Check our{' '}
            <a href="#" className="text-green-600 hover:text-green-700 font-semibold">
              Setup Guide
            </a>
            {' '}or{' '}
            <a href="#" className="text-green-600 hover:text-green-700 font-semibold">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}