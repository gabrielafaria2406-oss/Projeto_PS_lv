import { useEffect } from "react";
import "../styles/SplashScreen.css";
import logo from "../assets/logo-chroma.png";

function SplashScreen({ onFinish }) {

  useEffect(() => {

    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);

  }, [onFinish]);

  return (

    <div className="splash-screen">

      <img
        src={logo}
        alt="Chroma"
        className="splash-logo"
      />

    </div>

  );
}

export default SplashScreen;