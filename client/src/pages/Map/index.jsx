import styles from "./style.module.css";
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from "@react-google-maps/api";
import { Button } from "react-bootstrap";
import { IoMdArrowBack } from "react-icons/io";
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { useLocation, useNavigate } from "react-router";
import SetRoute from "./SetRoute";
import ViewRide from "./ViewRide";

const libraries = ["places"];

const Map = forwardRef((props, _ref) => {
  const naviagte = useNavigate();
  const location = useLocation();

  const [center, setCenter] = useState({ lat: 23.584, lng: 121.178 });
  const [zoom, setZoom] = useState(7);
  const [directionResponse, setDirectionResponse] = useState(null);
  const [departureTime, setDepartureTime] = useState(new Date());
  const [spots, setSpots] = useState(null);
  const [stops, setStops] = useState([]);
  const [arrivalTimes, setArrivalTimes] = useState([]);

  let deck = null;
  if (location.pathname.split("/")[1] === "create-ride") {
    deck = <SetRoute stops={stops} setStops={setStops} spots={spots} arrivalTimes={arrivalTimes} />;
  } else if (location.pathname.split("/")[1] === "ride") {
    deck = (
      <ViewRide
        stops={stops}
        setStops={setStops}
        setDepartureTime={setDepartureTime}
        departureTime={departureTime}
        spots={spots}
        arrivalTimes={arrivalTimes}
      />
    );
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const calculateRoutes = async () => {
    if (stops.length === 0) {
      setDirectionResponse(null);
      setArrivalTimes([]);
      return;
    }
    const updatedArrivalTimes = [new Date(departureTime)];
    if (stops.length === 1) {
      setZoom(15);
      setArrivalTimes(updatedArrivalTimes);
      setDirectionResponse(null);
      return;
    }

    const waypoints = [];
    for (let i = 1; i < stops.length - 1; i++) {
      waypoints.push({
        location: stops[i].position,
        stopover: true,
      });
    }
    const directionService = new window.google.maps.DirectionsService();
    const result = await directionService.route({
      origin: stops[0].position,
      destination: stops[stops.length - 1].position,
      waypoints: waypoints,
      travelMode: window.google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: departureTime,
        trafficModel: "pessimistic",
      },
    });
    setDirectionResponse(result);

    const addSeconds = (date, seconds) => {
      const dateCopy = new Date(date);
      dateCopy.setSeconds(date.getSeconds() + seconds);
      return dateCopy;
    };
    for (let i = 1; i < stops.length; i++) {
      updatedArrivalTimes.push(
        addSeconds(updatedArrivalTimes[i - 1], result.routes[0].legs[i - 1].duration.value)
      );
    }
    setArrivalTimes(updatedArrivalTimes);
  };

  const handleGoBack = () => {
    if (props.handleGoBack) {
      props.handleGoBack();
    } else {
      naviagte(-1);
    }
  };

  useEffect(() => {
    fetch("https://virtserver.swaggerhub.com/MONEY678678/im_uber/1.0.0/stops")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSpots(data);
      });
    if (props.stops) {
      setStops(props.stops);
    }
    if (props.arrivalTimes) {
      setArrivalTimes(props.arrivalTimes);
    }
    if (props.departureTime) {
      setDepartureTime(new Date(props.departureTime));
    }
  }, []);

  useEffect(() => {
    calculateRoutes();
    if (stops.length == 0) {
      return;
    }
    const bounds = new window.google.maps.LatLngBounds();
    stops.forEach((stop) => {
      bounds.extend(stop.position);
    });
    setCenter(bounds.getCenter());
  }, [stops]);

  useImperativeHandle(_ref, () => ({
    getStops: () => {
      return stops;
    },
    getArrivalTimes: () => {
      return arrivalTimes;
    },
  }));

  return (
    <div className={styles.pageContainer}>
      <Button className={styles.goBackButton} variant="secondary" onClick={handleGoBack}>
        <IoMdArrowBack />
      </Button>
      <div className={styles.mapContainer}>
        {isLoaded ? (
          <GoogleMap
            zoom={zoom}
            center={center}
            className={styles.mapContainer}
            mapContainerClassName="map-container"
            options={{
              disableDefaultUI: true,
            }}
          >
            {directionResponse && <DirectionsRenderer directions={directionResponse} />}
          </GoogleMap>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      {deck}
    </div>
  );
});

export default Map;
