import { Container } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Datetime from 'react-datetime';
import handleError from '~/utils/error';
import axios from '~/app/axios';
import Ticket from '../Ticket'
import styles from './style.module.css'

function Home(props) {
	const searchParams = new URLSearchParams(document.location.search)
	const [data, setData] = useState(null)
	const [arrivalInput, setArrivalInput] = useState(0)
	const [departureInput, setDepartureInput] = useState(1)
	const [arrival, setArrival] = useState(null)
	const [departure, setDeparture] = useState(null)
	const [departureTime, setDepartureTime] = useState(new Date())
	const [stops, setStops] = useState(null)
	useEffect(() => {
		props.setIsLoading(true)
		axios.get("/stops").then((res) => {
			setStops(res.data)
			if (Array.from(searchParams).length > 0) {
				let start_index = res.data.findIndex(el => el.name == searchParams.get('start_stop'))
				let end_index = res.data.findIndex(el => el.name == searchParams.get('dest_stop'))
				setDepartureInput(start_index)
				setArrivalInput(end_index)
				setDeparture(searchParams.get('start_stop'))
				setArrival(searchParams.get('dest_stop'))
				axios.get(`/cars?start_stop=${searchParams.get('start_stop')}&dest_stop=${searchParams.get('dest_stop')}&start_time=${searchParams.get('start_time')}`).then((res) => {
					setData(res.data)
					props.setIsLoading(false)
				}).catch(handleError)
			}
		}).catch(handleError)
	}, [])
	function handleSearch() {
		props.setIsLoading(true)
		let start_stop = stops[departureInput].name
		let dest_stop = stops[arrivalInput].name
		let start_time = departureTime.toISOString()
		axios.get(`/cars?start_stop=${start_stop}&dest_stop=${dest_stop}&start_time=${start_time}`).then((res) => {
			console.log(res.data)
			setData(res.data)
			setDeparture(start_stop)
			setArrival(dest_stop)
			props.setIsLoading(false)
		})
	}
	return (
		<>
			<Container fluid className={styles.banner}>
				<Container className={styles.bannerContent}>
					<div className={[styles.searchContainer, "d-flex"].join(" ")}>
						{
							<InputGroup>
								<FloatingLabel controlId="floatingDeparture" label="出發站">
									<Form.Select onChange={(evt) => setDepartureInput(evt.target.value)} value={departureInput}>
										{stops && stops.map((stop, index) => <option key={index} value={index}>{stop.name}</option>)}
									</Form.Select>
								</FloatingLabel>
								<FloatingLabel controlId="floatingArrival" label="目的站">
									<Form.Select onChange={(evt) => setArrivalInput(evt.target.value)} value={arrivalInput}>
										{stops && stops.map((stop, index) => <option key={index} value={index}>{stop.name}</option>)}
									</Form.Select>
								</FloatingLabel>
								<FloatingLabel controlId="departureTime" label="出發時間">
									<Form.Control value={departureTime} onChange={setDepartureTime} as={Datetime} />
								</FloatingLabel>
								<Button onClick={handleSearch} className='btn-danger d-flex align-items-center' variant="primary" type="submit">
									搜尋
								</Button>
							</InputGroup>
						}
					</div>
				</Container>
			</Container>
			<Container fluid="md">
				<Alert variant={"danger"} className='p-2 mt-4 small'>
					<i className="fa-solid fa-circle-exclamation m-1"></i>
					預訂及抵達時間為參考時間，請以實際班次狀況為主
				</Alert>
				<div className={styles.tickets}>
					{data && data.map((data, index) => {
						let deparutre_index = data.stops.findIndex(el => el.stopName == departure)
						let arrival_index = data.stops.findIndex(el => el.stopName == arrival)
						let departure_stop = data.stops[deparutre_index]
						let arrival_stop = data.stops[arrival_index]
						var diffMs = (new Date(Date.parse(departure_stop.eta)) - new Date(Date.parse(arrival_stop.eta)));
						var diffMins = Math.abs(Math.round(((diffMs % 86400000) % 3600000) / 60000)); // minutes
						if (deparutre_index > arrival_index || data.status != 0)
							return
						return <Ticket
							key={index}
							linkto={`/ride/${data._id}?start_stop=${stops[departureInput].name}&dest_stop=${stops[arrivalInput].name}&ticket_price=${diffMins}`}
							status={data.status}
							driver={data.driver}
							license_plate={data.license_plate}
							price={diffMins}
							occupied={data.tickets.length}
							seats={data.seats}
							departure_stop={departure_stop.stopName}
							arrival_stop={arrival_stop.stopName}
							departure_timestamp={new Date(Date.parse(departure_stop.eta))}
							arrival_timestamp={new Date(Date.parse(arrival_stop.eta))}
						/>
					})}
				</div>
			</Container>
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
	}
]

export default Home
