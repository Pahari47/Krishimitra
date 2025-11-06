import { useState, useEffect } from 'react';

const CropRecommendation = () => {
  const parameterRanges = {
    N: { min: 0, max: 200 },
    P: { min: 0, max: 200 },
    K: { min: 0, max: 200 },
    temperature: { min: -20, max: 60 },
    humidity: { min: 0, max: 100 },
    ph: { min: 0, max: 14 },
    rainfall: { min: 0, max: 1000 }
  };

  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('cropPredictionHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Error parsing history:', err);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('cropPredictionHistory', JSON.stringify(history));
    }
  }, [history]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const payload = {
      soil: {
        N: parseFloat(formData.N),
        P: parseFloat(formData.P),
        K: parseFloat(formData.K),
        ph: parseFloat(formData.ph),
        soil_temp: null,
        soil_moisture: null
      },
      weather: {
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        rainfall: parseFloat(formData.rainfall)
      }
    };

    const response = await fetch("http://localhost:5000/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();

    const crop = data.recommended_crop || data.data?.recommended_crop;

    setPrediction(crop);

    const newEntry = {
      ...formData,
      predicted_crop: crop,
      timestamp: new Date().toISOString(),
    };

    setHistory((prev) => [newEntry, ...prev.slice(0, 9)]);
  } catch (err) {
    setError("Failed to get prediction. Please try again.");
    console.error("Prediction error:", err);
  } finally {
    setLoading(false);
  }
};


  const clearHistory = () => {
    if (window.confirm('Clear prediction history?')) {
      localStorage.removeItem('cropPredictionHistory');
      setHistory([]);
    }
  };

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl mt-10 font-bold text-green-800 mb-2">
            Smart Crop Recommendation
          </h1>
          <p className="text-gray-600">
            Get AI-powered crop suggestions based on environmental conditions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Soil & Weather Parameters
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-6">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key === 'N'
                        ? 'Nitrogen (N)'
                        : key === 'P'
                        ? 'Phosphorus (P)'
                        : key === 'K'
                        ? 'Potassium (K)'
                        : key === 'ph'
                        ? 'pH Level'
                        : key.charAt(0).toUpperCase() + key.slice(1)}

                      <span className="text-gray-500 ml-1">
                        ({parameterRanges[key].min}-{parameterRanges[key].max}
                        {key === 'temperature'
                          ? '°C'
                          : key === 'humidity'
                          ? '%'
                          : key === 'rainfall'
                          ? 'mm'
                          : ''}
                        )
                      </span>
                    </label>

                    <input
                      type="number"
                      step={key === 'ph' ? '0.1' : '1'}
                      value={value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [key]: e.target.value
                        }))
                      }
                      required
                      min={parameterRanges[key].min}
                      max={parameterRanges[key].max}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={`Enter ${key}`}
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition ${
                  loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? 'Analyzing...' : 'Get Recommendation'}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recommendation Result
              </h2>

              {prediction ? (
                <div className="text-center py-8">
                  <p className="text-lg text-gray-600 mb-2">
                    The optimal crop for these conditions is:
                  </p>
                  <p className="text-3xl font-bold text-green-600 capitalize">
                    {prediction}
                  </p>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Enter parameters to get a recommendation</p>
                </div>
              )}
            </div>

            {/* History Section */}
            {history.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Prediction History
                  </h2>
                  <button
                    onClick={clearHistory}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {history.map((entry, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        const newFormData = {};
                        Object.keys(formData).forEach((key) => {
                          newFormData[key] = entry[key].toString();
                        });
                        setFormData(newFormData);
                        setPrediction(entry.predicted_crop);
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium capitalize">
                          {entry.predicted_crop}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 text-xs text-gray-500 mt-1">
                        <span>N: {entry.N}</span>
                        <span>P: {entry.P}</span>
                        <span>K: {entry.K}</span>
                        <span>Temp: {entry.temperature}°C</span>
                        <span>Hum: {entry.humidity}%</span>
                        <span>pH: {entry.ph}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This AI model analyzes soil nutrients and weather conditions to recommend the most suitable crops.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CropRecommendation;