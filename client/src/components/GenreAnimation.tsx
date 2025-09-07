import { useState, useEffect } from 'react';
import { LabelList, Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const GenreAnimation = ({ chartData }) => {
    // set genre data when a change is detected in the input parameter
    const [genreData, setGenreData] = useState({
        short_term: [],
        medium_term: [],
        long_term: []
    });
    const [selectedTimeRange, setSelectedTimeRange] = useState('short_term');

    useEffect(() => {
        setGenreData(prevData => ({
            ...prevData,
            ...chartData
        }));
    }, [chartData]);

    // The return statement must be inside the component
    return (
        <div className='flex flex-col w-[47%] h-[300px] rounded-xl p-5 bg-[#25272e]'>
            <p className='text-[#ffffff] mb-2'>Your Top Genres</p>
            <div className='flex-1'>
                <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={genreData[selectedTimeRange]} layout='vertical' key={selectedTimeRange}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="genre" hide />
                        <Tooltip wrapperStyle={{visibility: 'hidden',
    backgroundColor: 'transparent',
    border: 'none',
    padding: 0,}}/>
                        <Bar dataKey="count" fill='#FF8C94' animationEasing='ease-in'>
                            <LabelList dataKey="genre" position="middle" fill='#000000' fontSize={13} />
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
    );
};

export default GenreAnimation;