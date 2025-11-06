import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Forcusting from './components/Forcusting/Forcusting';
import SmartIniegration from './components/Smartintegration/SmartIniegration';
import WeatherSoildata from './components/WeatherSoildata/WeatherSoildata';
import CropRecomadation from './components/Croprecomendation/CropRecomadation';
import Chatbot from './components/Chatbot/Chatbot';
import PestDetection from './components/Pestdetection/PestDetection';


const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const ProtectedRoute = ({ children }) => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);
  
  return isSignedIn ? children : null;
};

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <Navbar />
        <Chatbot />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forcusting" element={<Forcusting />} />
          <Route path="/smartIrrigation" element={<SmartIniegration />} />
          <Route path="/weathersoildata" element={<WeatherSoildata />} />
          <Route path="/croprecommendation" element={<CropRecomadation />} />
          <Route path='/pestdetection' element={<PestDetection />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
