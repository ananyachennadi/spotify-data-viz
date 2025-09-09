import { Bar, ResponsiveContainer, Line, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";

const PopularityHistogram =({values}) => {
    return(
        <div className="h-[300px] w-[95%] md:w-[60%] bg-[#f6f2f1] rounded-xl p-5 flex flex-col flex-grow items-center">
            <p>How popular are your saved songs?</p>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={values}>
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
                    <CartesianGrid strokeDasharray=" 3" />
                </AreaChart>
            </ResponsiveContainer>
            <div className="flex flex-row items-center justify-between w-full">
                <p className="text-xs text-black">least popular</p>
                <p className="text-xs text-black">most popular</p>
            </div>
        </div>
    )
}

export default PopularityHistogram