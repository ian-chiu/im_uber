import styles from "./style.module.css";
import { Card, ListGroup, CloseButton, Dropdown } from "react-bootstrap";
import { IoMdAddCircleOutline } from "react-icons/io";

const SetRoute = (props) => {
  const { stops, setStops, spots, arrivalTimes } = props;

  const handleSelectSpot = (eventKey) => {
    const newStop = {
      id: eventKey,
      name: spots[eventKey].name,
      position: new window.google.maps.LatLng(spots[eventKey].latitude, spots[eventKey].longitude),
    };
    setStops((prevStops) => [...prevStops, newStop]);
  };
  const handleRemoveStop = (removeId) => {
    setStops((prevStops) => prevStops.filter((stop) => stop.id !== removeId));
  };

  return (
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
              onSelect={handleSelectSpot}
              style={{ display: "flex", justifyContent: "center" }}
              drop="down-centered"
            >
              <Dropdown.Toggle variant="outline-secondary">
                <IoMdAddCircleOutline fontSize="1.3em" /> 新增站點
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {spots
                  ? spots.map((spot, index) => (
                      <Dropdown.Item
                        key={index}
                        eventKey={index}
                        disabled={stops.some((stop) => index.toString() === stop.id)}
                      >
                        {spot.name}
                      </Dropdown.Item>
                    ))
                  : null}
              </Dropdown.Menu>
            </Dropdown>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default SetRoute;
