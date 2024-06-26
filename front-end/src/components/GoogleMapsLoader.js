import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const GoogleMapsLoader = ({ children }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    if (loadError) {
        return <div>Error loading map: {loadError.message}</div>;
    }

    return isLoaded ? <>{children}</> : <div>Loading...</div>;
};

export default GoogleMapsLoader;
