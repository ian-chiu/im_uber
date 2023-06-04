import { Button, Container } from 'react-bootstrap'
import { Route, Routes } from "react-router-dom";
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


function Home(props) {
	const [arrival, setArrival] = useState(0)
	const [departure, setDeparture] = useState(1)
	const [departureTime, setDepartureTime] = useState(new Date())
	const [stops, setStops] = useState(null)
	useEffect(() => {
		axios.get("/stops").then((res) => {
			setStops(res.data)
		}).catch(handleError)
	}, [])
	let searchInput = (
		<InputGroup>
			<FloatingLabel controlId="floatingDeparture" label="出發站">
				<Form.Select onChange={setDeparture} value={departure}>
					{stops && stops.map((stop, index) => <option key={index} value={index}>{stop.name}</option>)}
				</Form.Select>
			</FloatingLabel>
			<FloatingLabel controlId="floatingArrival" label="目的站">
				<Form.Select onChange={setArrival} value={arrival}>
					{stops && stops.map((stop, index) => <option key={index} value={index}>{stop.name}</option>)}
				</Form.Select>
			</FloatingLabel>
			<FloatingLabel controlId="departureTime" label="出發時間">
				<Form.Control value={departureTime} onChange={setDepartureTime} as={Datetime} />
			</FloatingLabel>
			<Button as={Link} to={"/search"} className='btn-danger d-flex align-items-center' variant="primary" type="submit">
				搜尋
			</Button>
		</InputGroup>
	)
	return (<>
		<Header/>
        <Routes>
			{/* {props.driver && <Route path='*' element={<Search searchInput={searchInput} />}/>} */}
			<Route path='/search' element={<Search searchInput={searchInput} />} />
			<Route path='*' element={
				<>
				{!props.driver && (
					<div className={styles.banner}>
						<Container className={styles.bannerContent}>
							<h4 className='text-white'>搜尋共乘</h4>
							<div className={[styles.searchContainer, "d-flex"].join(" ")}>
								{searchInput}
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
							{data.map((data, index) => {
								return <Ticket key={index} linkto={props.driver ? "/driver/ride/1" : "/ride/1"} data={data}/> 
							})}
						</div>
					</Container>
					{
						props.driver &&
						<Button as={Link} to="/driver/create-ride" variant={"danger"} className={styles.addRideBtn}><i class="fa-solid fa-circle-plus"></i>新增共乘</Button>
					}
				</>} />
        </Routes>
	</>
	)
}

var data = [
	{
		"to": "新竹高鐵站",
		"from": "臺積23廠",
		"date": "2022/05/31",
		"departure_time": "10:10",
		"arrival_time": "12:00",
		"driver": {
			"name": "邱士權"
		},
		"status": 1,
		"passengers": [
			{
				"name": "邱士懿"
			}, {
				"name": "邱士懿"
			}
		],
		"vehicle": {
			"license_plate": "ABC-1234",
			"seats": 5
		}
	}, 
	{
		"to": "新竹高鐵站",
		"from": "臺積23廠",
		"date": "2022/05/31",
		"departure_time": "10:10",
		"arrival_time": "12:00",
		"driver": {
			"name": "邱士權"
		},
		"status": 0,
		"passengers": [
			{
				"name": "邱士懿"
			}, {
				"name": "邱士懿"
			}
		],
		"vehicle": {
			"license_plate": "ABC-1234",
			"seats": 5
		}
	}, 
	{
		"to": "新竹高鐵站",
		"from": "臺積23廠",
		"date": "2022/05/31",
		"departure_time": "10:10",
		"arrival_time": "12:00",
		"driver": {
			"name": "邱士權"
		},
		"status": 0,
		"passengers": [
			{
				"name": "邱士懿"
			}, {
				"name": "邱士懿"
			}
		],
		"vehicle": {
			"license_plate": "ABC-1234",
			"seats": 5
		}
	}, 
	{
		"to": "新竹高鐵站",
		"from": "臺積23廠",
		"date": "2022/05/31",
		"departure_time": "10:10",
		"arrival_time": "12:00",
		"driver": {
			"name": "邱士權"
		},
		"status": 2,
		"passengers": [
			{
				"name": "邱士懿"
			}, {
				"name": "邱士懿"
			}
		],
		"vehicle": {
			"license_plate": "ABC-1234",
			"seats": 5
		}
	}, 
	{
		"to": "新竹高鐵站",
		"from": "臺積23廠",
		"date": "2022/05/31",
		"departure_time": "10:10",
		"arrival_time": "12:00",
		"driver": {
			"name": "邱士權"
		},
		"status": 2,
		"passengers": [
			{
				"name": "邱士懿"
			}, {
				"name": "邱士懿"
			}
		],
		"vehicle": {
			"license_plate": "ABC-1234",
			"seats": 5
		}
	}, 
]

export default Home
