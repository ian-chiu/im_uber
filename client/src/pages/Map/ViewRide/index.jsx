import styles from "./style.module.css";
import { Card, ListGroup, Tab, Tabs, Button } from "react-bootstrap";
import { getTimeString, getDateString } from "~/utils/time";

const ViewRide = (props) => {
  const { stops, ride, userInput, arrivalTimes } = props;

  const passengerStopIndex = {
    from: null,
    to: null,
  };
  if (userInput) {
    for (let i = 0; i < stops.length; i++) {
      if (stops[i].id === userInput.from.id) {
        passengerStopIndex.from = i;
      } else if (stops[i].id === userInput.to.id) {
        passengerStopIndex.to = i;
      }
    }
  }

  return (
    <Card className={styles.deck}>
      <div className={styles.deck}>
        <Tabs defaultActiveKey="ride-route" fill>
          <Tab eventKey="ride-route" title="路線">
            <Card.Header classname="border-bottom">{`日期：${arrivalTimes.length > 0 ? getDateString(arrivalTimes[0]) : "loading..."}`}</Card.Header>
            <ListGroup variant="flush">
              {arrivalTimes && arrivalTimes.length == stops.length
                ? stops.map((stop, index) => (
                    <ListGroup.Item
                      key={index}
                      className={`${styles.listGroupItem} ${
                        userInput &&
                        (stop.id === userInput.from.id || stop.id === userInput.to.id
                          ? styles.targetStopText
                          : null)
                      }`}
                    >
                      <div>{stop.name}</div>
                      <div>
                        {arrivalTimes
                          ? `${
                              userInput
                                ? stop.id === userInput.from.id
                                  ? "起點"
                                  : stop.id === userInput.to.id
                                  ? "終點"
                                  : ""
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
                  <Card.Header>駕駛</Card.Header>
                  <Card.Body className={styles.itemContainer}>
                    <div>
                      <div className="small fw-bold">姓名</div>
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
                  <Card.Header>乘客</Card.Header>
                  <Card.Body className="p-0">
                    <ListGroup variant="flush">
                      {ride.tickets.map((ticket, index) => (
                        <ListGroup.Item className={styles.itemContainer} key={index}>
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
