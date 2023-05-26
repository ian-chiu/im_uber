import "./style.css";
import styles from "./style.module.css";
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import { Card, Button, ListGroup, CloseButton } from "react-bootstrap";
import { RiSteering2Fill } from "react-icons/ri";
import { IoMdPerson, IoMdArrowBack, IoMdAddCircleOutline } from "react-icons/io";
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router";

const libraries = ["places"];

const Map = forwardRef((props, _ref) => {
  const naviagte = useNavigate();

  const [center, setCenter] = useState({ lat: 23.584, lng: 121.178 });
  const [zoom, setZoom] = useState(7);
  const [directionResponse, setDirectionResponse] = useState(null);
  const [departureTime, setDepartureTime] = useState(new Date());
  const [locations, setLocations] = useState(null);
  const [stops, setStops] = useState([]);
  const [arrivalTimes, setArrivalTimes] = useState([]);

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

  const handleSelectLocation = (eventKey) => {
    const newStop = {
      id: eventKey,
      name: locations[eventKey].name,
      position: new window.google.maps.LatLng(
        locations[eventKey].latitude,
        locations[eventKey].longitude
      ),
    };
    setStops((prevStops) => [...prevStops, newStop]);
  };

  const handleRemoveStop = (removeId) => {
    setStops((prevStops) => prevStops.filter((stop) => stop.id !== removeId));
  };

  const handleGoBack = () => {
    if (props.handleGoBack) {
      props.handleGoBack();
    } else {
      naviagte(-1);
    }
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    fetch("https://virtserver.swaggerhub.com/MONEY678678/im_uber/1.0.0/stops")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setLocations(data);
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
      <Card className={styles.deck}>
        <Card.Header className={styles.cardHeader}>
          <Card.Title className={styles.cardTitle}>路線規劃</Card.Title>
        </Card.Header>
        <Card.Body className={styles.cardBody}>
          <ListGroup variant="flush">
            {arrivalTimes && arrivalTimes.length == stops.length
              ? stops.map((stop, index) => (
                  <ListGroup.Item key={index} className={styles.listGroupItem}>
                    <div className={styles.container1}>
                      <div>{stop.name}</div>
                      <div>
                        {arrivalTimes
                          ? `${arrivalTimes[index].getHours()}:${arrivalTimes[index]
                              .getMinutes()
                              .toString()
                              .padStart(2, "0")}`
                          : "loading..."}
                      </div>
                    </div>
                    <div className={styles.container2}>
                      <CloseButton
                        onClick={() => {
                          handleRemoveStop(stop.id);
                        }}
                      />
                    </div>
                  </ListGroup.Item>
                ))
              : null}
            <ListGroup.Item>
              <Dropdown
                onSelect={handleSelectLocation}
                style={{ display: "flex", justifyContent: "center" }}
                drop="down-centered"
              >
                <Dropdown.Toggle variant="outline-secondary">
                  <IoMdAddCircleOutline fontSize="1.3em" /> 新增站點
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {locations
                    ? locations.map((location, index) => (
                        <Dropdown.Item key={index} eventKey={index}>
                          {location.name}
                        </Dropdown.Item>
                      ))
                    : null}
                </Dropdown.Menu>
              </Dropdown>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
});

export default Map;
