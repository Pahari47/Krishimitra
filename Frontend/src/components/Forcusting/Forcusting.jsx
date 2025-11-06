import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplet, Thermometer, Sun, CloudRain, Wind, Clock,
  AlertCircle, BarChart2, Calendar, Settings, Leaf, Bug,
  ChevronDown, ChevronUp, RefreshCw, Circle
} from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(...registerables);

const Forcusting = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();
  const [soilData, setSoilData] = useState({
    moisture: 65,
    temperature: 22,
    ph: 6.8,
    nutrients: {
      nitrogen: 45,
      phosphorus: 30,
      potassium: 25
    }
  });

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate changing data
      const interval = setInterval(() => {
        setSoilData(prev => ({
          ...prev,
          moisture: Math.max(30, Math.min(80, prev.moisture + (Math.random() * 6 - 3))),
          temperature: Math.max(15, Math.min(30, prev.temperature + (Math.random() * 2 - 1))),
          ph: Math.max(5.5, Math.min(7.5, prev.ph + (Math.random() * 0.4 - 0.2)))
        }));
      }, 5000);
      return () => clearInterval(interval);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Chart data
  const moistureHistory = {
    labels: ['6am', '9am', '12pm', '3pm', '6pm', '9pm'],
    datasets: [
      {
        label: 'Soil Moisture %',
        data: [68, 65, 60, 62, 64, 66],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const cropHealthData = {
    labels: ['Healthy', 'Warning', 'Critical'],
    datasets: [
      {
        data: [85, 10, 5],
        backgroundColor: [
          '#10b981',
          '#f59e0b',
          '#ef4444'
        ],
        borderWidth: 0
      }
    ]
  };

  const toggleCardExpand = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 h-40 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex mt-25 items-center"
          >
            <Leaf className="h-8 w-8 mb-20 text-green-600" />
            <h1 className="ml-2 text-xl mb-20 font-bold text-gray-900">Dashboard</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <button
              onClick={refreshData}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <RefreshCw className={`h-5 w-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-medium">KM</span>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500"></span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex border-b border-gray-200 mb-6"
        >
          {['overview', 'analytics', 'alerts', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === tab
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab === 'overview' && <BarChart2 className="mr-2 h-4 w-4" />}
              {tab === 'analytics' && <Calendar className="mr-2 h-4 w-4" />}
              {tab === 'alerts' && <AlertCircle className="mr-2 h-4 w-4" />}
              {tab === 'settings' && <Settings className="mr-2 h-4 w-4" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Soil Conditions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() => toggleCardExpand('soil')}
            >
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Droplet className="h-5 w-5 text-blue-500 mr-2" />
                Soil Conditions
              </h2>
              {expandedCard === 'soil' ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            {/* Preview content (visible when not expanded) */}
            {expandedCard !== 'soil' && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Moisture</span>
                      <Droplet className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {isLoading ? '--' : `${soilData.moisture.toFixed(1)}%`}
                    </div>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Temp</span>
                      <Thermometer className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {isLoading ? '--' : `${soilData.temperature.toFixed(1)}°C`}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">pH</span>
                      <Circle className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {isLoading ? '--' : soilData.ph.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence>
              {expandedCard === 'soil' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <div className="h-48">
                      <Line
                        data={moistureHistory}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Weather Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Sun className="h-5 w-5 text-yellow-500 mr-2" />
                Weather Forecast
              </h2>

              <div className="mt-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <Sun className="h-6 w-6 text-yellow-500 mr-3" />
                    <span>Today</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">32°C</div>
                    <div className="text-sm text-gray-500">Sunny</div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <CloudRain className="h-6 w-6 text-blue-400 mr-3" />
                    <span>Tomorrow</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">28°C</div>
                    <div className="text-sm text-gray-500">Rainy</div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <Wind className="h-6 w-6 text-gray-400 mr-3" />
                    <span>Wind</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">12 km/h</div>
                    <div className="text-sm text-gray-500">NE</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Crop Health Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() => toggleCardExpand('crop')}
            >
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Leaf className="h-5 w-5 text-green-500 mr-2" />
                Crop Health
              </h2>
              {expandedCard === 'crop' ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            {/* Preview content (visible when not expanded) */}
            {expandedCard !== 'crop' && (
              <div className="px-4 pb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Healthy</span>
                  </div>
                  <span className="font-medium">85%</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm">Warning</span>
                  </div>
                  <span className="font-medium">10%</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm">Critical</span>
                  </div>
                  <span className="font-medium">5%</span>
                </div>
              </div>
            )}

            <AnimatePresence>
              {expandedCard === 'crop' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <div className="h-48 mb-4">
                      <Pie
                        data={cropHealthData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                          <span>Healthy Plants</span>
                        </div>
                        <span className="font-medium">85%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                          <span>Potential Issues</span>
                        </div>
                        <span className="font-medium">10%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                          <span>Diseased Plants</span>
                        </div>
                        <span className="font-medium">5%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Irrigation Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Droplet className="h-5 w-5 text-blue-500 mr-2" />
                Irrigation Schedule
              </h2>

              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Next Irrigation</h3>
                    <p className="text-sm text-gray-600">Today at 5:30 PM</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <Droplet className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Last Irrigation</h3>
                    <p className="text-sm text-gray-600">Yesterday at 5:30 PM</p>
                    <p className="text-sm text-gray-600">Duration: 45 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pest Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Bug className="h-5 w-5 text-red-500 mr-2" />
                Pest Alerts
              </h2>

              <div className="mt-4 space-y-3">
                <div className="flex items-start p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Aphid Detected</h3>
                    <p className="text-sm text-gray-600">North-East quadrant</p>
                    <p className="text-xs text-red-500 mt-1">Action required</p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Whitefly Activity</h3>
                    <p className="text-sm text-gray-600">Increasing in South section</p>
                    <p className="text-xs text-yellow-500 mt-1">Monitor closely</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Nutrient Levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Leaf className="h-5 w-5 text-green-500 mr-2" />
                Nutrient Levels
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Nitrogen (N)</span>
                    <span className="text-sm font-medium text-gray-700">{soilData.nutrients.nitrogen}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${soilData.nutrients.nitrogen}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Phosphorus (P)</span>
                    <span className="text-sm font-medium text-gray-700">{soilData.nutrients.phosphorus}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: `${soilData.nutrients.phosphorus}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Potassium (K)</span>
                    <span className="text-sm font-medium text-gray-700">{soilData.nutrients.potassium}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${soilData.nutrients.potassium}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Forcusting;