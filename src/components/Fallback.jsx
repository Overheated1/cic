import "../style-sheets/Fallback.css"
import { useState, useEffect } from 'react';


export const Fallback = () => {
    
    const [showFallback, setShowFallback] = useState(false);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setShowFallback(true);
      }, 20);
  
      return () => clearTimeout(timeoutId);
    }, []);

    return (
        showFallback &&
        <section className="fallback-container">
            <img className="baby_bottle" width="150px" height="150px" src={require("../resources/test_tube.gif")} alt="Loading..." />      
        </section>
        // <section className="fallback-container">
        //     <video autoPlay className="baby_bottle" loop muted>
        //         <source src={require("../resources/baby_bottle.webm")} type="video/webm" />
        //     </video>
        // </section>
    );
}