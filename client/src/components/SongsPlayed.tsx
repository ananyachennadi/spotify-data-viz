interface RecentlyPlayedProps {
  name: string;
  cover: string;
}

const RecentlyPlayed = ({name, cover}: RecentlyPlayedProps) => {
    console.log(cover)
    console.log(name)
    return(
        <div className="h-[72px] w-full flex items-center justify-start rounded-md">
            <img src={cover} alt={name} className="h-full w-auto object-cover mr-5" />
            <p className="text-white">{name}</p>
        </div>
    )
}

export default RecentlyPlayed;