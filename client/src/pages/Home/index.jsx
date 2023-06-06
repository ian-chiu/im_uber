import { Button, Container } from 'react-bootstrap'
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import Datetime from 'react-datetime';
import { Link } from 'react-router-dom';

import Header from "~/common/components/Header";
import Ticket from './Ticket'
import axios from '~/app/axios'
import styles from './style.module.css'
import Search from './Search'
import { useState } from 'react';
import handleError from '~/utils/error';
import { useSelector } from 'react-redux';
import useUpdateEffect from '~/common/hooks/useUpdateEffect';
import useDebounce from '~/common/hooks/useDebounce';

function Home(props) {
	const location = useLocation();
	const username = useSelector(state => state.auth.username)
	const [data, setData] = useState(null)
	const [arrival, setArrival] = useState(0)
	const [departure, setDeparture] = useState(1)
	const [departureTime, setDepartureTime] = useState(new Date())
	const [stops, setStops] = useState(null)
	const role = location.pathname.includes("driver") ? "driver" : "passenger"
	useDebounce(() => {
		axios.get("/stops").then((res) => {
			setStops(res.data)
		}).catch(handleError)
		if (location.pathname.includes("driver")) {
			axios.get(`/cars?driver=${username}`).then((res) => {
				setData(res.data)
			})
		} else {
			axios.get("/tickets").then((res) => {
				setData(res.data)
			})
		}
	}, 500, [username, location])
	const searchQuery = (stops && departure > -1 && departureTime && arrival > -1 ?
		`?start_stop=${stops[departure].name}&dest_stop=${stops[arrival].name}&start_time=${departureTime.toISOString()}` : ""
	);

	return (<>
		<Header/>
        <Routes>
			{/* {role == "driver" && <Route path='*' element={<Search searchInput={searchInput} />}/>} */}
			<Route path='/search' element={<Search />} />
			<Route path='*' element={
				<>
				{!(role == "driver") && (
					<div className={styles.banner}>
						<Container className={styles.bannerContent}>
							<h4 className='text-white'>搜尋共乘</h4>
							<div className={[styles.searchContainer, "d-flex"].join(" ")}>
								{
									<InputGroup>
										<FloatingLabel controlId="floatingDeparture" label="出發站">
											<Form.Select onChange={(evt) => setDeparture(evt.target.value)} value={departure}>
												{stops && stops.map((stop, index) => <option key={index} value={index}>{stop.name}</option>)}
											</Form.Select>
										</FloatingLabel>
										<FloatingLabel controlId="floatingArrival" label="目的站">
											<Form.Select onChange={(evt) => setArrival(evt.target.value)} value={arrival}>
												{stops && stops.map((stop, index) => <option key={index} value={index}>{stop.name}</option>)}
											</Form.Select>
										</FloatingLabel>
										<FloatingLabel controlId="departureTime" label="出發時間">
											<Form.Control value={departureTime} onChange={setDepartureTime} as={Datetime} />
										</FloatingLabel>
										<Button as={Link} to={`/search${searchQuery}`} className='btn-danger d-flex align-items-center' variant="primary" type="submit">
											搜尋
										</Button>
									</InputGroup>
								}
							</div>
						</Container>
					</div>
				)}
					<Container className='pt-5'>
						<Alert variant={"danger"} className='p-2 small'>
							<i className="fa-solid fa-circle-exclamation m-1"></i>
							預訂及抵達時間為參考時間，請以實際班次狀況為主
						</Alert>
						<h4>我的共乘</h4>
						<div className={styles.tickets}>
							{data && data.map((data, index) => {
								let price = 0
								if (role == "driver" && data.tickets) {
									for (let ticket of data.tickets) {
										price += ticket.price
									}
								}
								// console.log(role == "driver", data, new Date(data.departure_time))
								return role == "driver" ? (data.stops && data.stops.length > 0 &&
									<Ticket
										key={index}
										linkto={`/driver/ride/${data._id}`}
										status={data.status}
										driver={data.driver}
										license_plate={data.license_plate}
										price={price}
										occupied={data.passengers.length}
										seats={data.seats}
										departure_stop={data.stops.slice(-1)[0]["stopName"]}
										arrival_stop={data.stops[0]["stopName"]}
										departure_timestamp={new Date(Date.parse(data.departure_time))}
										arrival_timestamp={new Date(Date.parse(data.stops.slice(-1)[0]["eta"]))}
									/>
								) :  (data.ride &&
									<Ticket
										key={index}
										linkto={`/ride/${data.car_id}/tickets/${data._id}`}
										status={data.ride.status}
										driver={data.ride.driver}
										license_plate={data.ride.license_plate}
										price={data.price}
										occupied={data.ride.passengers.length}
										seats={data.ride.seats}
										departure_stop={data.boardingStop}
										arrival_stop={data.destinationStop}
										departure_timestamp={new Date(Date.parse(data.departure_time))}
										arrival_timestamp={new Date(Date.parse(data.arrival_time))}
									/>
								)
							})}
						</div>
					</Container>
					{
						role == "driver" &&
						<Button as={Link} to="/driver/create-ride" variant={"danger"} className={styles.addRideBtn}><i className="fa-solid fa-circle-plus"></i>新增共乘</Button>
					}
				</>} />
        </Routes>
	</>
	)
}

export default Home
