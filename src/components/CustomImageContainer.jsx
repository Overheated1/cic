import React, { useEffect, useState } from 'react';

function CustomImageContainer({url,urlMobile}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed
      setIsMobile(isMobile);
    };

    handleResize(); // Initial check on load

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const imageUrl = isMobile ?
    urlMobile :
    url;

  return (
    <img
      className="container-principal-image"
      src={imageUrl}
      loading="lazy"
      alt="principal website image"
    />
  );
}

export default CustomImageContainer;