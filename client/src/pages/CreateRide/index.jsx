import "./style.css";
import "react-datetime/css/react-datetime.css";
import styles from "./style.module.css";
import { useRef, useState } from "react";
import { Button, Modal, Form, FloatingLabel, ListGroup, Card } from "react-bootstrap";
import * as yup from "yup";
import Datetime from "react-datetime";
import Map from "../Map";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const schema = yup.object().shape({
  lisensePlate: yup.string().trim().min(1).max(100).required(),
  departureTime: yup.date().required(),
  maxPassengers: yup.number().integer().min(1).max(100).required(),
  route: yup.array().min(2).required(),
});

const CreateRide = () => {
  const mapPageRef = useRef();

  const [show, setShow] = useState(false);
  const [stops, setStops] = useState([]);
  const [arrivalTimes, setArrivalTimes] = useState([]);
  const [values, setValues] = useState({
    lisensePlate: "",
    departureTime: new Date(),
    maxPassengers: 1,
    route: "",
  });
  const [errors, setErrors] = useState({
    lisensePlate: "",
    departureTime: "",
    maxPassengers: "",
    route: "",
  });

  const validateField = async (fieldName, value) => {
    try {
      await yup.reach(schema, fieldName).validate(value);
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error.message }));
    }
  };

  const handleShow = () => {
    setShow(true);
  };
  const handleModalHide = () => {
    setStops([...mapPageRef.current.getStops()]);
    setArrivalTimes([...mapPageRef.current.getArrivalTimes()]);
    setShow(false);
  };
  const handleSubmit = () => {
    validateField("lisensePlate", values.lisensePlate);
    validateField("departureTime", values.departureTime);
    validateField("maxPassengers", values.maxPassengers);
    validateField("route", values.route);

    if (!!errors.lisensePlate || !!errors.departureTime || !!errors.maxPassengers || !!errors.route) {
      console.log("Form submitted successfully");
    }
  };
  const handleLisensePlateChange = (event) => {
    setValues((prevValues) => ({ ...prevValues, lisensePlate: event.target.value }));
  };
  const handleDepartureTimeChange = (moment) => {
    setValues((prevValues) => ({ ...prevValues, departureTime: moment }));
  };
  const handleMaxPassengersChange = (event) => {
    setValues((prevValues) => ({ ...prevValues, maxPassengers: event.target.value }));
  };

  return (
    <>
      <Card className={styles.pageContainer}>
        <div>
          <Card.Header className={styles.header}>
            <IoIosArrowBack className={styles.goBackIcon} />
            <div className={styles.title}>新增行程</div>
          </Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <FloatingLabel label="車牌號碼">
                <Form.Control
                  type="text"
                  name="lisensePlate"
                  value={values.lisensePlate}
                  onChange={handleLisensePlateChange}
                  placeholder="placeholder"
                  isInvalid={!!errors.lisensePlate}
                />
                <Form.Control.Feedback type="invalid">{errors.lisensePlate}</Form.Control.Feedback>
              </FloatingLabel>
            </ListGroup.Item>
            <ListGroup.Item>
              <FloatingLabel label="出發時間">
                <Form.Control
                  type="date"
                  as={Datetime}
                  name="departureTime"
                  value={values.departureTime}
                  onChange={handleDepartureTimeChange}
                  placeholder="placeholder"
                  isInvalid={!!errors.departureTime}
                />
                <Form.Control.Feedback type="invalid">{errors.departureTime}</Form.Control.Feedback>
              </FloatingLabel>
            </ListGroup.Item>
            <ListGroup.Item>
              <FloatingLabel label="乘客人數">
                <Form.Control
                  type="number"
                  name="maxPassengers"
                  placeholder="placeholder"
                  value={values.maxPassengers}
                  onChange={handleMaxPassengersChange}
                  isInvalid={!!errors.maxPassengers}
                />
                <Form.Control.Feedback type="invalid">{errors.maxPassengers}</Form.Control.Feedback>
              </FloatingLabel>
            </ListGroup.Item>
            <ListGroup.Item
              className={styles.routePlanningButton}
              action
              onClick={() => handleShow()}
            >
              <div>路線規劃</div>
              <IoIosArrowForward />
            </ListGroup.Item>
            {stops.length ? (
              <ListGroup variant="flush">
                {stops.map((stop, index) => (
                  <ListGroup.Item key={index}>{stop.name}</ListGroup.Item>
                ))}
              </ListGroup>
            ) : null}
          </ListGroup>
        </div>
        <Button className={styles.submitButton} onClick={handleSubmit}>
          送出
        </Button>
      </Card>
      <Modal show={show} fullscreen onHide={handleModalHide}>
        <Map
          handleGoBack={handleModalHide}
          stops={stops}
          arrivalTimes={arrivalTimes}
          departureTime={values.departureTime}
          ref={mapPageRef}
        />
      </Modal>
    </>
  );
};

export default CreateRide;
