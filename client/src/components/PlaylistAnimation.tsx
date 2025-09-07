import { useEffect, useState } from "react"

const PlaylistAnimation =({playlistId}) => {
    const [popularityValues, setPopularityValues] = useState([]);
    useEffect(() => {
        const fetchPopularity = async () => {
            try {
                const response = await fetch(`https://127.0.0.1:5000/playlist-track-popularity?playlist_id=${playlistId}`, {
                    credentials: "include"
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setPopularityValues(data);
                    console.log(data);
                }
            } catch (error) {
                console.error("Failed to fetch popularity data:", error);
            }
        };
        fetchPopularity();
    }, [playlistId]);

    return(
        <div>

        </div>
    )
}

export default PlaylistAnimation