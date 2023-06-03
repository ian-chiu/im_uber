import styles from "./style.module.css";
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from "@react-google-maps/api";
import { IoIosArrowBack } from "react-icons/io";
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
  const [ride, setRide] = useState(null);

  let deck = null;
  if (location.pathname.includes("/driver/create-ride")) {
    deck = <SetRoute stops={stops} setStops={setStops} spots={spots} arrivalTimes={arrivalTimes} />;
  } else if (location.pathname.split("/")[1] === "ride") {
    //TODO: use real user input
    const userInput = {
      from: {
        name: "臺積電五廠",
        latitude: 24.774451062456148,
        longitude: 120.99816376901293,
        id: 0,
      },
      to: {
        name: "新竹市立動物園",
        latitude: 24.80044826523704,
        longitude: 120.97987888212046,
        id: 2,
      },
    };
    deck = (
      <ViewRide
        ride={ride}
        userInput={userInput}
        stops={stops}
        spots={spots}
        arrivalTimes={arrivalTimes}
      />
    );
  } else if (location.pathname.includes("/driver/ride/")) {
    deck = <ViewRide ride={ride} stops={stops} spots={spots} arrivalTimes={arrivalTimes} />;
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
    const updatedArrivalTimes = [
      {
        stopId: stops[0].id,
        date: new Date(departureTime),
      },
    ];
    if (stops.length === 1) {
      setZoom(15);
      setArrivalTimes(updatedArrivalTimes);
      setDirectionResponse(null);
      return;
    }

    const waypoints = [];
    const waypointStopIds = [];
    const passengerStopIds = new Set();
    if (ride && ride.tickets) {
      for (let ticket of ride.tickets) {
        passengerStopIds.add(ticket.from.id);
        passengerStopIds.add(ticket.to.id);
      }
    }

    for (let i = 1; i < stops.length - 1; i++) {
      if (location.pathname.includes("/driver/ride/")) {
        if (!passengerStopIds.has(stops[i].id)) {
          continue;
        }
      }
      waypointStopIds.push(stops[i].id);
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
    for (let i = 0; i < result.routes[0].legs.length; i++) {
      updatedArrivalTimes.push({
        stopId: waypointStopIds[i] || stops[stops.length - 1].id,
        date: addSeconds(updatedArrivalTimes[updatedArrivalTimes.length - 1].date, result.routes[0].legs[i].duration.value),
      });
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
    if (location.pathname.split("/")[1] === "ride" || location.pathname.split("/")[2] === "ride") {
      fetch("https://virtserver.swaggerhub.com/MONEY678678/im_uber/1.0.0/rides/asdf")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          data[0].status = 1;
          setRide(data[0]);
          setStops(
            data[0].stops.map((stop) => ({
              id: stop.id,
              name: stop.name,
              position: new window.google.maps.LatLng(stop.latitude, stop.longitude),
            }))
          );
          setDepartureTime(new Date(data[0]["departure_time"]));
        });
    } else if (location.pathname.split[1] === "create-ride") {
      if (props.stops) {
        setStops(props.stops);
      }
      if (props.arrivalTimes) {
        setArrivalTimes(props.arrivalTimes);
      }
      if (props.departureTime) {
        setDepartureTime(new Date(props.departureTime));
      }
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
      <div className={styles.goBackButton} onClick={handleGoBack}>
        <IoIosArrowBack />
      </div>
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
