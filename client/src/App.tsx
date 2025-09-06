import React from "react";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ArtistAnimation from "./components/ArtistAnimation";

function App() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [artistData, setArtistData] = useState({
    short_term: [],
    medium_term: [],
    long_term: []
  });


  useEffect(() => {
    // check if user is authenticated by sending a request to /is-authenticated path and set login success
    const checkAuthStatus = async () => {
        try {
          const response = await fetch('https://127.0.0.1:5000/is-authenticated', {
            credentials: 'include' 
          });
          if (response.ok) {
            const data = await response.json();
            setLoginSuccess(data.authenticated);
          } else {
            setLoginSuccess(false);
          }
        } catch (error) {
          console.error("Failed to check authentication status", error);
          setLoginSuccess(false);
        }
      };
    
      // fetch top artist data needed for artist animation and transform data into dictionary absed on given time-range
    const fetchArtistData = async(time_range) => {
        try {
            const response = await fetch(`https://127.0.0.1:5000/artist-animated?time_range=${time_range}`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                const transformedData = data.map((name, index) => ({
                    name: name,
                    value: 20 - (index * 2)
                }));
                setArtistData(prevData => ({
                    ...prevData,
                    [time_range]: transformedData
                }));
            } else {
                console.error("Failed to fetch artist data. Status:", response.status);
            }
        } catch (error) {
            console.error("Network or parsing error:", error);
        }
    };
    
    // Call the functions
    checkAuthStatus();
    fetchArtistData('short_term');
    fetchArtistData('medium_term');
    fetchArtistData('long_term');

  }, []);

  // if user is not authenticated render login component otherwise render dashboard and components in dashboard
  return (
    <div className="flex h-full w-full">
      {!loginSuccess ? (
        <Login />
      ) : (
        <>
        <Dashboard />
        <ArtistAnimation chartData={artistData}></ArtistAnimation>
        </>
      )}
    </div>
  )
}

export default App
