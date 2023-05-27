import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { Card, ListGroup, Badge, CloseButton, Tab, Tabs, Button } from "react-bootstrap";

const ViewRide = (props) => {
  const { stops, setStops, departureTime, setDepartureTime, spots, arrivalTimes } = props;
  const [ride, setRide] = useState(null);
  const [passengerStops, setPassengerStops] = useState({
    from: null,
    to: null,
  });

  // TODO: use real user input
  const [userInput, setUserInput] = useState({
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
  });

  const getTimeString = (date) => {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
  };
  const getDateString = (date) => {
    // Get year, month, and day part from the date
    let year = date.toLocaleString("default", { year: "numeric" });
    let month = date.toLocaleString("default", { month: "2-digit" });
    let day = date.toLocaleString("default", { day: "2-digit" });

    // Generate yyyy-mm-dd date string
    return year + "-" + month + "-" + day;
  };

  useEffect(() => {
    fetch("https://virtserver.swaggerhub.com/MONEY678678/im_uber/1.0.0/rides/asdf")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setRide(data[0]);
        const updatedStops = data[0].stops.map((stop) => ({
          id: stop.id,
          name: stop.name,
          position: new window.google.maps.LatLng(stop.latitude, stop.longitude),
        }));
        const updatedPassengerStops = {
          from: null,
          to: null,
        };
        for (let i = 0; i < updatedStops.length; i++) {
          if (updatedStops[i].id === userInput.from.id) {
            updatedPassengerStops.from = i;
          } else if (updatedStops[i].id === userInput.to.id) {
            updatedPassengerStops.to = i;
          }
        }
        setPassengerStops({ ...updatedPassengerStops });
        setStops(updatedStops);
        setDepartureTime(new Date(data[0]["departure_time"]));
      });
  }, []);

  return (
    <Card className={styles.deck}>
      <div className={styles.deck}>
        <Tabs defaultActiveKey="ride-route" className="mb-3" fill>
          <Tab eventKey="ride-route" title="路線圖">
            <ListGroup variant="flush">
              {arrivalTimes && arrivalTimes.length == stops.length
                ? stops.map((stop, index) => (
                    <ListGroup.Item
                      key={index}
                      className={`${styles.listGroupItem} ${
                        stop.id === userInput.from.id || stop.id === userInput.to.id
                          ? styles.targetStopText
                          : null
                      }`}
                    >
                      <div>{stop.name}</div>
                      <div>
                        {arrivalTimes
                          ? `${
                              stop.id === userInput.from.id
                                ? "起程"
                                : stop.id === userInput.to.id
                                ? "終點"
                                : ""
                            } ${getTimeString(arrivalTimes[index])}`
                          : "loading..."}
                      </div>
                    </ListGroup.Item>
                  ))
                : null}
            </ListGroup>
          </Tab>
          <Tab eventKey="ride-info" title="共乘資訊">
            {ride && arrivalTimes.length ? (
              <div className={styles.infoContainer}>
                <Card className={styles.card}>
                  <Card.Header>時間</Card.Header>
                  <Card.Body className={styles.itemContainer}>
                    <div>
                      <div className="small fw-bold">日期</div>
                      <div>{getDateString(new Date(departureTime))}</div>
                    </div>
                    <div>
                      <div className="small fw-bold">起點</div>
                      <div>{userInput.from.name}</div>
                    </div>
                    <div>
                      <div className="small fw-bold">終點</div>
                      <div>{userInput.to.name}</div>
                    </div>
                    <div>
                      <div className="small fw-bold">起點ETA</div>
                      <div>
                        {passengerStops.from !== null
                          ? getTimeString(new Date(arrivalTimes[passengerStops.from]))
                          : null}
                      </div>
                    </div>
                    <div>
                      <div className="small fw-bold">終點ETA</div>
                      <div>
                        {passengerStops.to !== null
                          ? getTimeString(new Date(arrivalTimes[passengerStops.to]))
                          : null}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                <Card className={styles.card}>
                  <Card.Header>駕駛資訊</Card.Header>
                  <Card.Body className={styles.itemContainer}>
                    <div>
                      <div className="small fw-bold">駕駛姓名</div>
                      <div>{ride.driver.name}</div>
                    </div>
                    <div>
                      <div className="small fw-bold">電話</div>
                      <div>{ride.driver.phone}</div>
                    </div>
                    <div>
                      <div className="small fw-bold">車牌</div>
                      <div>{ride.vehicle.license_plate}</div>
                    </div>
                    <div>
                      <div className="small fw-bold">載客人數</div>
                      <div>
                        {ride.tickets.length} / {ride.vehicle.seats}人
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                <Card className={styles.card}>
                  <Card.Header>乘客資訊</Card.Header>
                  <Card.Body className="p-0">
                    <ListGroup variant="flush">
                      {ride.tickets.map((ticket, index) => (
                        <ListGroup.Item className={styles.itemContainer}>
                          <div>
                            <div className="small fw-bold">姓名</div>
                            <div>{ticket.user.name}</div>
                          </div>
                          <div>
                            <div className="small fw-bold">電話</div>
                            <div>{ticket.user.phone}</div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </div>
            ) : null}
          </Tab>
        </Tabs>
      </div>
      <Card.Body className={styles.bottomPanel}>
        <Button className={styles.joinRideButton}>加入共乘</Button>
        <div className={styles.priceLabel}>NTD100</div>
      </Card.Body>
    </Card>
  );
};

export default ViewRide;
