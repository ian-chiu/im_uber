import "react-datetime/css/react-datetime.css";
import styles from "./style.module.css";
import { useRef, useState } from "react";
import { Button, Modal, Form, FloatingLabel, ListGroup, Card } from "react-bootstrap";
import * as yup from "yup";
import Datetime from "react-datetime";
import Map from "../index";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import axios from "~/app/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const schema = yup.object().shape({
  licensePlate: yup.string().trim().min(1).max(100).required(),
  departureTime: yup.date().required(),
  maxPassengers: yup.number().integer().min(1).max(100).required(),
});

const CreateRide = () => {
  const mapPageRef = useRef();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [stops, setStops] = useState([]);
  const [arrivalTimes, setArrivalTimes] = useState([]);
  const [values, setValues] = useState({
    licensePlate: "",
    departureTime: new Date(),
    maxPassengers: 1,
  });
  const [errors, setErrors] = useState({
    licensePlate: "",
    departureTime: "",
    maxPassengers: "",
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
    validateField("licensePlate", values.licensePlate);
    validateField("departureTime", values.departureTime);
    validateField("maxPassengers", values.maxPassengers);

    if (stops.length < 2) {
      toast.error("路線必需要有兩個站以上");
    }

    if (
      errors.licensePlate.length === 0 &&
      errors.departureTime.length === 0 &&
      errors.maxPassengers.length === 0
    ) {
      axios
        .post("/cars", {
          departure_time: values.departureTime.toISOString(),
          stops: stops.map((stop) => stop.name),
          stops_eta: arrivalTimes.map((arrivalTime) => arrivalTime.date.toISOString()),
          license_plate: values.licensePlate,
          seats: values.maxPassengers,
        })
        .then((res) => {
          toast.success("成功新增共乘");
          navigate("/driver/ride");
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  };
  const handleGoBack = () => {
    navigate("/driver/ride");
  };
  const handlelicensePlateChange = (event) => {
    setValues((prevValues) => ({ ...prevValues, licensePlate: event.target.value }));
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
            <IoIosArrowBack className={styles.goBackIcon} onClick={handleGoBack} />
            <div className={styles.title}>新增行程</div>
          </Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <FloatingLabel label="車牌號碼">
                <Form.Control
                  type="text"
                  name="licensePlate"
                  value={values.licensePlate}
                  onChange={handlelicensePlateChange}
                  placeholder="placeholder"
                  isInvalid={!!errors.licensePlate}
                />
                <Form.Control.Feedback type="invalid">{errors.licensePlate}</Form.Control.Feedback>
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
