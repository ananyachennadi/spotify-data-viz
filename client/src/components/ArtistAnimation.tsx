import { useState } from 'react';
import {Area, AreaChart, BarChart, XAxis, YAxis, Tooltip} from 'recharts'

const ArtistAnimation = () => {
    const [chartData, setChartData] = useState([]);
    
    const fetchData = async() => {
            console.log('hekko')
        
        try {
            const response = await fetch('https://127.0.0.1:5000/artist-animated', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                const transformedData = data.map((name, index) => ({
                    name: name,
                    value: 20 - (index * 2)
                }));
                setChartData(transformedData);
            } else {
                console.error("Failed to fetch artist data. Status:", response.status);
            }
            

        } catch (error) {
            console.error("Network or parsing error:", error);
        }
    };

    fetchData();
  return (
	<div>
        <AreaChart width={500} height={300} data={chartData}>
            <XAxis dataKey='name'></XAxis>
            <YAxis></YAxis>
            <Tooltip />
            <Area dataKey='index'></Area>
        </AreaChart>
	</div>
  )
};

export default ArtistAnimation;