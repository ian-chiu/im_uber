import styles from "../../style.module.css";
import { Card, ListGroup, CloseButton } from "react-bootstrap";

const ViewRide = (props) => {
  const { stops, setStops, arrivalTimes } = props;

  return (
    <Card className={styles.deck}>
      <Card.Header className={styles.cardHeader}>
        <Card.Title className={styles.cardTitle}>Another Component</Card.Title>
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
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default ViewRide;
