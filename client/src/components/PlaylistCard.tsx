const PlaylistCard =({cover, name}) =>{
    return(
        <div className="group h-96 [perspective:1000px]">
          <div className="relative h-full w-full rounded-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] bg-white">
            <div className="absolute inset-0">
              <img src={cover} />
            </div>
            <div className="absolute inset-0 h-full w-full rounded-xl bg-black/80 px-12 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <div className="flex min-h-full flex-col items-center justify-center">
                
              </div>
            </div>
          </div>
        </div>      
    )
}

export default PlaylistCard