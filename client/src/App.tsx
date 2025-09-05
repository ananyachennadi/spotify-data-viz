import React from "react";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { useSearchParams } from "react-router-dom"
import ArtistAnimation from "./components/ArtistAnimation";

function App() {
  // check if the user is authentication and use setLoginSuccess to indicate this
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkAuthStatus = async () => {
        try {
          const response = await fetch('https://127.0.0.1:5000/is-authenticated', {
            credentials: 'include' 
          });
          if (response.ok) {
            const data = await response.json();
            setLoginSuccess(data.authenticated);
          } else {
            setLoginSuccess(false);
          }
        } catch (error) {
          console.error("Failed to check authentication status", error);
          setLoginSuccess(false);
        }
      };

    checkAuthStatus();
  }, []);

  // if user is not authenticated render login component otherwise render dashboard
  return (
    <div className="flex w-[90%] h-[90%] mx-auto bg-[#f3f2ec] rounded-lg align-self m-8 md:m-10 lg:p-12">
      {!loginSuccess ? (
        <Login />
      ) : (
        <>
        <Dashboard />
        <ArtistAnimation></ArtistAnimation>
        </>
      )}
    </div>
  )
}

export default App
