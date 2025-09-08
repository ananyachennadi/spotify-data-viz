import { useEffect, useState } from "react"
import { Bar, ResponsiveContainer, Line, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";

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

const PlaylistAnimation =({playlistId}) => {
    const [popularityValues, setPopularityValues] = useState<{ name: string; count: number; }[]>([]);
    useEffect(() => {
        const fetchPopularity = async () => {
            try {
                const response = await fetch(`https://127.0.0.1:5000/playlist-track-popularity?playlist_id=${playlistId}`, {
                    credentials: "include"
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const histogramData = transformToHistogram(data);
                    setPopularityValues(histogramData);
                }
            } catch (error) {
                console.error("Failed to fetch popularity data:", error);
            }
        };
        fetchPopularity();
    }, [playlistId]);

    return(
        <div className="h-[300px] w-[300px] bg-[#f6f2f1] rounded-xl p-5 flex flex-col">
            <p className='text-[#000000] mb-2'>Song Popularity Breakdown</p>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={popularityValues}>
                    <XAxis
                        dataKey="name"
                        hide
                    />
                    <YAxis hide/>
                    <Tooltip wrapperStyle={{visibility: 'hidden',
                        backgroundColor: 'transparent',
                        border: 'none',
                        padding: 0,}}/>
                    <Area type="monotone" dataKey="count" stroke="#a0c4c3" fill="#c1d6db" fillOpacity={0.6}/>
                    <CartesianGrid strokeDasharray="3 3" />
                </AreaChart>
            </ResponsiveContainer>
            <div className="flex flex-row items-centre justify-between">
                <p className="text-xs">least popular</p>
                <p className="text-xs">most popular</p>
            </div>
        </div>
    )
}

export default PlaylistAnimation