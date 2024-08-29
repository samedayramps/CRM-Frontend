let isLoading = false;
let isLoaded = false;
let googleMapsPromise: Promise<void> | null = null;

export const loadGoogleMapsAPI = (): Promise<void> => {
  if (isLoaded) {
    return Promise.resolve();
  }
  if (isLoading) {
    return googleMapsPromise!;
  }
  
  isLoading = true;
  googleMapsPromise = new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => {
      isLoaded = true;
      isLoading = false;
      resolve();
    });
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};