import styles from "./style.module.css";
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import { Card, Button } from "react-bootstrap";
import { RiSteering2Fill } from "react-icons/ri";
import { IoMdPerson } from "react-icons/io";
import { useCallback, useEffect, useRef, useState } from "react";

const containerStyle = {
  width: "auto",
  height: "400px",
};

const Map = () => {
  const [stops, setStops] = useState([
    {
      name: "新竹高鐵站",
      position: { lat: 24.807282359338483, lng: 121.04050172232557 },
    },
    {
      name: "金山街塔",
      position: { lat: 24.777044600209447, lng: 121.02514493860002 },
    },
    {
      name: "台積電五廠",
      position: { lat: 24.774451062456148, lng: 120.99776133514902 },
    },
  ]);
  const [center, setCenter] = useState({ lat: 23.584, lng: 121.178 });
  const [directionResponse, setDirectionResponse] = useState(null);

  const calculateRoutes = async () => {
    if (!stops || stops.length < 2) {
      return null;
    }
    const directionService = new window.google.maps.DirectionsService();
    const waypoints = [];
    for (let i = 1; i < stops.length - 1; i++) {
      waypoints.push({
        location: new window.google.maps.LatLng(stops[i].position.lat, stops[i].position.lng),
        stopover: true,
      });
    }
    const result = await directionService.route({
      origin: new window.google.maps.LatLng(stops[0].position.lat, stops[0].position.lng),
      destination: new window.google.maps.LatLng(
        stops[stops.length - 1].position.lat,
        stops[stops.length - 1].position.lng
      ),
      waypoints: waypoints,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });
    setDirectionResponse(result);
    console.log(result);
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const onLoad = useCallback(function onLoad(map) {
    var bounds = new google.maps.LatLngBounds();
    stops.forEach((stop) => {
      bounds.extend(stop.position);
    });
    map.fitBounds(bounds);
  });

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    const bounds = new window.google.maps.LatLngBounds();
    stops.forEach((stop) => {
      bounds.extend(stop.position);
    });
    setCenter(bounds.getCenter());
    calculateRoutes();
  }, [isLoaded, stops]);

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          onLoad={onLoad}
          zoom={7}
          center={center}
          className={styles.mapContainer}
          mapContainerClassName="map-container"
          mapContainerStyle={containerStyle}
          options={{
            disableDefaultUI: true,
          }}
        >
          {directionResponse && <DirectionsRenderer directions={directionResponse} />}
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
      <Card>
        <Card.Header className={styles.cardHeader}>
          <div className={styles.container1}>
            <Card.Title>PlateNumber</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">datedatedate</Card.Subtitle>
          </div>
          <div className={styles.container2}>
            <Button className="p-1" size="sm">
              <div className={styles.textContainer}>
                <div className={styles.label}>
                  <RiSteering2Fill />
                  駕駛
                </div>
                <div className={styles.info}>王小明</div>
              </div>
              <div className={styles.divider} />
              <div className={styles.textContainer}>
                <div className={styles.label}>
                  <IoMdPerson />
                  乘客
                </div>
                <div className={styles.info}>
                  {0}/{5}人
                </div>
              </div>
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
          <Card.Text>
            Some quick example text to build on the card title and make up the bulk of the card's
            content.
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default Map;
