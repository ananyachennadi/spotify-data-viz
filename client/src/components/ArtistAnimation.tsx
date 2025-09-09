import { useState} from 'react';
import {LabelList, Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts'

interface ArtistAnimationProps {
    chartData: {
        short_term: { name: string, value: number }[];
        medium_term: { name: string, value: number }[];
        long_term: { name: string, value: number }[];
    }
}


const ArtistAnimation = ({chartData}:ArtistAnimationProps) => {
    type TimeRangeKey = 'short_term' | 'medium_term' | 'long_term';
    // set artist data when a change is detected in the input parameter
    const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeKey>('short_term');
    const dataForChart = chartData[selectedTimeRange];
  return (
	<div className='flex flex-col w-[95%] sm:w-[49%] h-[300px] rounded-xl p-5 bg-[#25272e] mt-5'>
        <p className='text-[#ffffff] mb-2'>Your Top Artists</p>
        <div className='flex-1'>
            <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={dataForChart} layout='vertical' key={selectedTimeRange}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip wrapperStyle={{ visibility: 'hidden',
    backgroundColor: 'transparent',
    border: 'none',
    padding: 0, }}/>
                    <Bar dataKey="value" fill='#fbc92c' animationEasing='ease-in' >
                        <LabelList dataKey="name" position="middle" fill='#000000' fontSize={12}/>
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="flex justify-center items-center mt-4">
            <div className="flex space-x-2">
                <button
                    onClick={() => setSelectedTimeRange('short_term')}
                    className={`px-3 py-1 text-xs rounded-full ${selectedTimeRange === 'short_term' ? 'bg-white text-black' : 'bg-gray-700 text-white'}`}
                >
                    short-term
                </button>
                <button
                    onClick={() => setSelectedTimeRange('medium_term')}
                    className={`px-3 py-1 text-xs rounded-full ${selectedTimeRange === 'medium_term' ? 'bg-white text-black' : 'bg-gray-700 text-white'}`}
                >
                    medium-term
                </button>
                <button
                    onClick={() => setSelectedTimeRange('long_term')}
                    className={`px-3 py-1 text-xs rounded-full ${selectedTimeRange === 'long_term' ? 'bg-white text-black' : 'bg-gray-700 text-white'}`}
                >
                    long-term
                </button>
            </div>
        </div>
    </div>
  )

};

export default ArtistAnimation;