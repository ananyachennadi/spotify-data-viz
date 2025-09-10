interface LoginProps{
    API_URL: string
}

const Login = ({API_URL} : LoginProps) => {
    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_URL}/login`);
            const data = await response.json();
            
            // Redirect the user's browser directly to the Spotify URL
            window.location.href = data.auth_url;
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
    return(
        <button
            onClick={handleLogin}
            className="text-white font-semibold bg-[#1db954] px-8 py-2 text-lg rounded-lg flex items-center justify-center h-[50px]"
        >
            <img 
            src="/spotify-logo1.png"
            className="h-full object-contain mr-2"
            />
            <span>Log in with Spotify</span>
        </button>
    );
}
export default Login;