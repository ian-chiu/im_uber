import styles from "./style.module.css";
import { Card, ListGroup, Tab, Tabs, Button } from "react-bootstrap";
import { useLocation } from "react-router";
import { getTimeString, getDateString } from "~/utils/time";

const ViewRide = (props) => {
  const location = useLocation();
  const { stops, ride, userInput, arrivalTimes } = props;

  const userInputStopIndex = {
    from: null,
    to: null,
  };
  if (userInput) {
    for (let i = 0; i < stops.length; i++) {
      if (stops[i].id === userInput.from.id) {
        userInputStopIndex.from = i;
      } else if (stops[i].id === userInput.to.id) {
        userInputStopIndex.to = i;
      }
    }
  }

  let bottomPanel = null;
  if (location.pathname.split("/")[1] === "ride") {
    if (ride && ride.status == 1) {
      bottomPanel = (
        <Card.Body className={styles.bottomPanel}>
          <Button size="sm" className={styles.joinRideButton}>
            駕駛完成任務
          </Button>
        </Card.Body>
      );
    } else {
      bottomPanel = (
        <Card.Body className={styles.bottomPanel}>
          <Button size="sm" className={styles.joinRideButton}>
            加入共乘
          </Button>
          <div className={styles.infoTexts}>
            <div>票價NTD100</div>
          </div>
        </Card.Body>
      );
    }
  } else if (ride && location.pathname.split("/")[1] === "driver") {
    if (ride && ride.status == 1) {
      bottomPanel = (
        <Card.Body className={styles.bottomPanel}>
          <Card.Text>
            任務...
          </Card.Text>
        </Card.Body>
      );
    } else {
      bottomPanel = (
        <Card.Body className={styles.bottomPanel}>
          <Button size="sm" className={styles.joinRideButton}>
            發車
          </Button>
          <div className={styles.infoTexts}>
            <div>收入NTD100</div>
          </div>
        </Card.Body>
      );
    }
  }

  let stopListGroupItems = [];
  if (stops) {
    stops.forEach((stop, index) => {
      const arrivalTime = arrivalTimes.find((arrivalTime) => arrivalTime.stopId === stop.id);
      const item = (
        <ListGroup.Item
          key={index}
          className={`${styles.listGroupItem} ${
            userInput &&
            (stop.id === userInput.from.id || stop.id === userInput.to.id
              ? styles.targetStopText
              : null)
          }`}
        >
          <div className={`${arrivalTime ? "" : "text-muted"}`}>{stop.name}</div>
          <div>
            {arrivalTime
              ? `${
                  userInput
                    ? stop.id === userInput.from.id
                      ? "起點"
                      : stop.id === userInput.to.id
                      ? "終點"
                      : ""
                    : ""
                } ${getTimeString(arrivalTime.date)}`
              : ""}
          </div>
        </ListGroup.Item>
      );
      stopListGroupItems.push(item);
    });
  }

  return (
    <Card className={styles.deck}>
      <div className={styles.deck}>
        <Tabs defaultActiveKey="ride-route" fill>
          <Tab eventKey="ride-route" title="路線">
            <Card.Header className="border-bottom">{`日期：${
              arrivalTimes.length > 0 ? getDateString(arrivalTimes[0].date) : "loading..."
            }`}</Card.Header>
            <ListGroup variant="flush">{stopListGroupItems}</ListGroup>
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
                      <div>{ride.license_plate}</div>
                    </div>
                    <div>
                      <div className="small fw-bold">載客人數</div>
                      <div>
                        {ride.tickets.length} / {ride.seats}人
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
                          {location.pathname.split("/")[1] === "driver" ? (
                            <>
                              <div>
                                <div className="small fw-bold">起點</div>
                                <div>{ticket.from.name}</div>
                              </div>
                              <div>
                                <div className="small fw-bold">終點</div>
                                <div>{ticket.to.name}</div>
                              </div>
                            </>
                          ) : null}
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
      {bottomPanel}
    </Card>
  );
};

export default ViewRide;
