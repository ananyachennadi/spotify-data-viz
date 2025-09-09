import { useState, useEffect } from "react";
import Login from "./components/Login";
import ArtistAnimation from "./components/ArtistAnimation";
import GenreAnimation from "./components/GenreAnimation";
import PlaylistCard from "./components/PlaylistCard";
import { Playlist } from "./types";

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
  const [playlistsData, setPlaylistsData] = useState<Playlist[]>([]);

  useEffect(() => {
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

    const getPlaylistImages = async (playlists) => {
      const updatedPlaylists = await Promise.all(
        playlists.map(async (playlist) => {
          try {
            const response = await fetch(`https://127.0.0.1:5000/get-playlist-cover?playlist_id=${playlist.id}`, {
              credentials: 'include'
            });
            if (response.ok) {
              const data = await response.json();
              return { ...playlist, image: data };
            } else {
              console.error("Failed to fetch cover for playlist:", playlist.name);
              return playlist;
            }
          } catch (error) {
            console.error("Network or parsing error for playlist:", playlist.name, error);
            return playlist;
          }
            })
          );
      setPlaylistsData(updatedPlaylists.filter(p => p.image !== null));    
    };

    const getPlaylists = async () => {
      try {
        const response = await fetch(`https://127.0.0.1:5000/user-playlists`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          const validPlaylists = data.filter(playlist => playlist.id);
          setPlaylistsData(validPlaylists);
          // Only call getPlaylistImages AFTER playlistsData is fetched
          getPlaylistImages(validPlaylists);
        } else {
          console.error("Failed to fetch playlists. Status:", response.status);
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
    getPlaylists();
  }, []);

  // if user is not authenticated render login component otherwise render dashboard and components in dashboard
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full bg-[#1C1C1E] p-4 overflow-y-auto overscroll-y-none">
      {!loginSuccess ? (
        <Login />
      ) : (
        <>
          <div className="flex w-full justify-center text-2xl sm:text-3xl font-normal">
            <h1 className="text-white text-2xl">welcome to your dashboard</h1>
          </div>
          <div className="flex flex-col sm:flex-row w-full justify-between items-center">
            <ArtistAnimation chartData={artistData} />
            <GenreAnimation chartData={genreData} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-[3vw] gap-y-[3vh] p-5 w-full ">
            {playlistsData.map((playlist) => (
              <PlaylistCard id={playlist.id} cover={playlist.image} name={playlist.name} key={playlist.id}/>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
