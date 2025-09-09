import { useState, useEffect } from "react";
import Login from "./components/Login";
import ArtistAnimation from "./components/ArtistAnimation";
import GenreAnimation from "./components/GenreAnimation";
import PopularityHistogram from "./components/PopularityHistogram"
import { Song } from "./types";
import SongsPlayed from "./components/SongsPlayed";

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
  const [songsPopularity, setSongsPopularity] = useState<{ name: string; count: number; }[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);

  useEffect(() => {
    const fetchArtistData = async (time_range) => {
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

    const fetchGenreData = async (time_range) => {
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
          console.error("Failed to fetch genre data. Status:", response.status);
        }
      } catch (error) {
        console.error("Network or parsing error:", error);
      }
    };

    const fetchRecentlyPlayed = async () => {
    try {
        // 1. Fetch the list of recently played songs first
        const songsResponse = await fetch(`https://127.0.0.1:5000/recently-played`, {
            credentials: 'include',
        });
        if (!songsResponse.ok) {
            throw new Error(`Failed to fetch recently played songs. Status: ${songsResponse.status}`);
        }
        const songsData = await songsResponse.json();

        // 2. Concurrently fetch the song cover for each song
        const updatedSongsWithImages = await Promise.all(
            songsData.map(async (song) => {
                try {
                    const coverResponse = await fetch(`https://127.0.0.1:5000/song-cover?id=${song.id}`, {
                        credentials: 'include',
                    });

                    // Add a check to ensure the response is OK before parsing JSON
                    if (!coverResponse.ok) {
                        console.error(`Failed to fetch cover for song "${song.name}". Status: ${coverResponse.status}`);
                        // Return the original song object if the fetch failed
                        return song;
                    }

                    const coverData = await coverResponse.json();
                    
                    // Use a fallback URL in case 'url' is missing from the response
                    const imageUrl = coverData.url || 'path/to/placeholder-image.png';

                    return { ...song, image: imageUrl };

                } catch (error) {
                    console.error(`Network or parsing error for song "${song.name}":`, error);
                    // Return the original song object on error
                    return song;
                }
            })
        );

        // 3. Update the state a single time with the complete data
        setRecentlyPlayed(updatedSongsWithImages);

    } catch (error) {
        console.error('An error occurred during fetch:', error);
    }
};
    const transformToHistogram = (data) => {
      const bins = Array.from({ length: 10 }, (_, i) => i * 10);
      const histogramData = bins.map((binStart) => ({
        name: `${binStart}-${binStart + 9}`,
        count: 0,
      }));

      data.forEach((value) => {
        const binIndex = Math.floor(value / 10);
        if (binIndex >= 0 && binIndex < histogramData.length) {
          histogramData[binIndex].count += 1;
        }
      });

      return histogramData;
    };

// Your data fetching function
const fetchSongsPopularity = async () => {
  try {
    const response = await fetch(`https://127.0.0.1:5000/saved-tracks-popularity`, {
      credentials: 'include'
    });
    if (response.ok) {
      const data = await response.json();
      // Correctly call the transformation function and pass its result to the state setter
      const transformedData = transformToHistogram(data);
      setSongsPopularity(transformedData);
    } else {
      console.error("Failed to fetch song popularity. Status:", response.status);
    }
  } catch (error) {
    console.error("Network or parsing error:", error);
  }
};
    const fetchAllData = async () => {
      // First, check the authentication status
      try {
        const authResponse = await fetch('https://127.0.0.1:5000/is-authenticated', {
        credentials: 'include'
        });
        const authData = await authResponse.json();
        setLoginSuccess(authData.authenticated);

        if (authData.authenticated) {
          // If authenticated, proceed to fetch all other data sequentially
          await fetchArtistData('short_term');
          await fetchArtistData('medium_term');
          await fetchArtistData('long_term');
          
          await fetchGenreData('short_term');
          await fetchGenreData('medium_term');
          await fetchGenreData('long_term');
          await fetchSongsPopularity();
          fetchRecentlyPlayed();
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setLoginSuccess(false);
      }
    };
    
    // Call the master function
    fetchAllData();
  }, []);

    const handleLogout = async () => {
    try {
        const response = await fetch('https://127.0.0.1:5000/logout', {
            credentials: 'include'
        });

        if (response.ok || response.status === 302) {
            setLoginSuccess(false);
            window.location.reload();
        } else {
            console.error('Logout failed.');
        }
    } catch (error) {
        console.error('An error occurred during logout:', error);
    }
};

  // if user is not authenticated render login component otherwise render dashboard and components in dashboard
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full bg-[#000000] p-4 overflow-y-auto overscroll-y-none">
      {!loginSuccess ? (
        <Login />
      ) : (
        <>
          <div className="flex w-full justify-center text-2xl sm:text-3xl font-normal">
            <h1 className="text-white text-2xl">welcome to your dashboard</h1>
            <a href="https://127.0.0.1:5000/logout" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200">
    Log Out
</a>
          </div>
          <div className="flex w-full justify-center mt-5 flex-col md:flex-row">
            <PopularityHistogram values={songsPopularity} />
            <div className="flex flex-col w-full mt-5 md:mt-0 md:ml-5 max-h-[300px] border p-3 rounded-lg border-dotted">
              <p className="text-white mb-2">Recently Played</p>
              <div className="flex flex-col w-full gap-3">
                  {recentlyPlayed.map((song) => (
                      <SongsPlayed cover={song.image} name={song.name} key={song.id}/>
                  ))}
              </div>
          </div>
          </div>
          <div className="flex flex-col sm:flex-row w-full justify-between items-center">
            <ArtistAnimation chartData={artistData} />
            <GenreAnimation chartData={genreData} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
