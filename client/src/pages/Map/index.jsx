import styles from "./style.module.css";
import { GoogleMap, useJsApiLoader, DirectionsRenderer, MarkerF } from "@react-google-maps/api";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import SetRoute from "./SetRoute";
import ViewRide from "./ViewRide";
import axios from "~/app/axios";
import CarIconPng from "~/assets/images/car.png";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

const libraries = ["places"];

const Map = forwardRef((props, _ref) => {
  const naviagte = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [center, setCenter] = useState({ lat: 23.584, lng: 121.178 });
  const [zoom, setZoom] = useState(7);
  const [directionResponse, setDirectionResponse] = useState(null);
  const [departureTime, setDepartureTime] = useState(new Date());
  const [spots, setSpots] = useState(null);
  const [stops, setStops] = useState([]);
  const [arrivalTimes, setArrivalTimes] = useState([]);
  const [ride, setRide] = useState(null);
  const [driverRevenue, setDriverRevenue] = useState(null);
  const [driverPosition, setDriverPosition] = useState(null);
  const [rideStatus, setRideStatus] = useState(null);
  const [myTicket, setMyTicket] = useState(null);

  let deck = null;
  if (location.pathname.includes("/driver/create-ride")) {
    deck = <SetRoute stops={stops} setStops={setStops} spots={spots} arrivalTimes={arrivalTimes} />;
  } else if (location.pathname.split("/")[1] === "ride") {
    let userInput = {
      ticketPrice: searchParams.get("ticket_price"),
      from: searchParams.get("start_stop"),
      to: searchParams.get("dest_stop"),
      joined: false,
    };
    if (myTicket) {
      userInput = {
        ticketPrice: myTicket.price,
        from: myTicket.boardingStop,
        to: myTicket.destinationStop,
        joined: true,
      };
    }
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
    deck = (
      <ViewRide
        ride={ride}
        setRideStatus={setRideStatus}
        stops={stops}
        spots={spots}
        arrivalTimes={arrivalTimes}
        driverRevenue={driverRevenue}
      />
    );
  }

  let driverMarker = null;
  if (driverPosition) {
    driverMarker = <MarkerF position={driverPosition} icon={CarIconPng} />;
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const calculateRoutes = async () => {
    const currentTime = new Date();
    const setArrivalTimesIfConditionMeets = (updated) => {
      if (location.pathname.includes("/driver/create-ride") || currentTime > departureTime) {
        setArrivalTimes(updated);
      }
    };
    if (stops.length === 0) {
      setDirectionResponse(null);
      setArrivalTimesIfConditionMeets([]);
      return;
    }
    const targetTime = currentTime > departureTime ? currentTime : departureTime;
    const updatedArrivalTimes = [
      {
        stopId: stops[0].id,
        date: targetTime,
      },
    ];
    if (stops.length === 1) {
      setZoom(15);
      setArrivalTimesIfConditionMeets([targetTime]);
      setDirectionResponse(null);
      return;
    }

    const waypoints = [];
    const waypointStopIds = [];
    const passengerStopIds = new Set();
    if (ride && ride.tickets) {
      for (let ticket of ride.tickets) {
        passengerStopIds.add(ticket.boardingStop);
        passengerStopIds.add(ticket.destinationStop);
      }
    }

    for (let i = 1; i < stops.length - 1; i++) {
      // if (location.pathname.includes("/driver/ride/")) {
      //   if (!passengerStopIds.has(stops[i].name)) {
      //     continue;
      //   }
      // }
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
        departureTime: targetTime,
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
        date: addSeconds(
          updatedArrivalTimes[updatedArrivalTimes.length - 1].date,
          result.routes[0].legs[i].duration.value
        ),
      });
    }
    setArrivalTimesIfConditionMeets(updatedArrivalTimes.map((item) => item.date));
  };

  const handleGoBack = () => {
    if (props.handleGoBack) {
      props.handleGoBack();
    } else {
      naviagte(-1);
    }
  };

  const getCarsFromId = () => {
    if (location.pathname.split("/")[1] === "ride" || location.pathname.split("/")[2] === "ride") {
      axios.get(`/cars/${params.id}`).then((res) => {
        const data = res.data;
        setRide(data);
        setStops(
          data.stops.map((stop) => ({
            id: stop.id,
            name: stop.stopName,
            position: new window.google.maps.LatLng(
              stop.location.latitude,
              stop.location.longitude
            ),
          }))
        );
        setDepartureTime(new Date(data.departure_time));
        setArrivalTimes(data.stops.map((stop) => new Date(Date.parse(stop.eta))));
        let revenue = 0;
        let updatedMyTicket = null;
        if (data.tickets && data.tickets.length) {
          for (let ticket of data.tickets) {
            revenue += ticket.price;
            if (ticket._id === params.ticket_id) {
              updatedMyTicket = ticket;
            }
          }
        }
        setDriverRevenue(revenue);
        setMyTicket(updatedMyTicket);
      });
    }
  };

  useEffect(() => {
    axios.get("/stops").then((res) => {
      setSpots(res.data);
    });
    getCarsFromId();
    if (location.pathname.includes("/driver/create-ride")) {
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
    getCarsFromId();
  }, [rideStatus]);

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

  useEffect(() => {
    if (!ride || !ride.status === 1) {
      return;
    }
    const postDriverGeoPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          axios
            .post("/cars/update-gps", {
              gps_position: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
            })
            .catch((err) => {
              toast.error(err.response.data.message);
            });
        },
        (err) => {
          toast.error("無法取得駕駛GPS座標");
          console.log(err);
        }
      );
    };
    const getDriverGeoPosition = () => {
      axios.get(`/cars/${params.id}/gps`).then((res) => {
        const position = res.data.gps_position;
        setDriverPosition(new window.google.maps.LatLng(position.latitude, position.longitude));
      });
    };
    const timeInterval = 15000;
    if (location.pathname.includes("/driver/ride/")) {
      postDriverGeoPosition();
      setInterval(postDriverGeoPosition, timeInterval);
    }
    getDriverGeoPosition();
    setInterval(getDriverGeoPosition, timeInterval);
  }, [ride]);

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
            {driverMarker}
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
