import PlaylistAnimation from './PlaylistAnimation'
const PlaylistCard =({cover, name, id}) =>{
    return (
  <div className="group w-full [perspective:1000px]">
    <div className="relative w-full pt-[100%]">
      <div className="absolute inset-0 rounded-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] [backface-visibility:hidden]">
        {/* Front of the Card */}
        <div className="absolute inset-0 rounded-xl overflow-hidden relative">
          {cover && cover.length > 0 ? (
            <img src={cover} className="h-full w-full object-cover" />
          ) : (
            <img src='/playlist-placeholder.png' className="h-full w-full object-cover"></img>
          )}
        </div>
        <div className="absolute inset-0 h-full w-full rounded-xl bg-black/80 px-12 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden] justify-items-center">
          <PlaylistAnimation playlistId={id}/>
        </div>
      </div>
    </div>
  </div>
);
}

export default PlaylistCard