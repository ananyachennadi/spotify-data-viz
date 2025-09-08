import React from "react";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import ArtistAnimation from "./components/ArtistAnimation";
import GenreAnimation from "./components/GenreAnimation";
import PlaylistAnimation from "./components/PlaylistAnimation";

function App() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [artistData, setArtistData] = useState({
    short_term: [],
    medium_term: [],
    long_term: []
  });
  const [genreData, setGenreData] = useState({
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

    // fetch top genre data needed for genre animation
    const fetchGenreData = async(time_range) => {
        try {
            const response = await fetch(`https://127.0.0.1:5000/genre-animated?time_range=${time_range}`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setGenreData(prevData => ({
                    ...prevData,
                    [time_range]: data
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
    fetchGenreData('short_term');
    fetchGenreData('medium_term');
    fetchGenreData('long_term');

  }, []);

  // if user is not authenticated render login component otherwise render dashboard and components in dashboard
  return (
    <div className="flex flex-col justify-center items-center h-full w-full bg-[#1C1C1E] p-6">
      {!loginSuccess ? (
        <Login />
      ) : (
        <>
        <div className="flex justify-start w-full text-2xl sm:text-3xl font-normal">
          <h1 className="text-white text-2xl">welcome to your dashboard</h1>
        </div>
        <div className="flex w-full justify-center items-center space-x-6">
            <ArtistAnimation chartData={artistData} />
            <GenreAnimation chartData={genreData} />
        </div>
        <div className="flex">
          <PlaylistAnimation playlistId='34DBc5q2EDa6snxvsLsSw9'/>
        </div>
        </>
      )}
    </div>
  );
}

export default App
