import { useState, useContext } from 'react';
import { StoreContext, ACTION_TYPES } from '../store/coffee-store/context';
const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  // const [latLong, setLatLong] = useState("");
  const {dispatch} = useContext(StoreContext);
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const success = (position:GeolocationPosition) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    dispatch({
      type:ACTION_TYPES.SET_LAT_LONG,
      payload: { latLong: `${latitude},${longitude}` },
    });
    // setLatLong(`${latitude},${longitude}`);
    setLocationErrorMsg("");
    setIsFindingLocation(false);
  };

  const error = () => {
    setIsFindingLocation(false);
    setLocationErrorMsg("Unable to retrieve your location");
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
        setIsFindingLocation(false);
      setLocationErrorMsg("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    // latLong,
    handleTrackLocation,
    locationErrorMsg,
    isFindingLocation
  };
};

export default useTrackLocation;