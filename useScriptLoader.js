import { useEffect, useState } from 'react';

export const useScriptLoader = (src, id, shouldLoad) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!shouldLoad) return;
    
    // Check if script already exists to avoid duplicates
    if (document.getElementById(id)) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      // Optional: Cleanup script if component unmounts and we want to remove it
      // For tracking scripts, we usually leave them injected once consented.
    };
  }, [src, id, shouldLoad]);

  return isLoaded;
};

export default useScriptLoader;