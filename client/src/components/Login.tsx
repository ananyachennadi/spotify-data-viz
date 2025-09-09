interface LoginProps{
    API_URL: string
}

const Login = ({API_URL} : LoginProps) => {
    return(
        <a href={`${API_URL}/login`} className="text-white font-semibold bg-[#1db954] px-8 py-2 text-lg rounded-lg flex items-center justify-center h-[50px]">
            <img 
            src="/spotify-logo1.png"
            className="h-full object-contain mr-2"
            />
            <span>Log in with Spotify</span>
        </a>
    )
}
export default Login;