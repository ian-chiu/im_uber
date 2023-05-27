import { Button, Container } from 'react-bootstrap'
import { useEffect } from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import Datetime from 'react-datetime';

import Ticket from '../Ticket'
import axios from '~/app/axios'
import styles from './style.module.css'
import banner from "~/assets/banner.jpg"


function Home(props) {
	useEffect(() => {
		axios.get("/users/me/tickets").then((res) => {
			console.log(res.data)
		})
	}, [])
	return (
		<>
			<Container fluid className={styles.banner}>
				<Container className={styles.bannerContent}>
					<div className={[styles.searchContainer, "d-flex"].join(" ")}>
						{props.searchInput}
					</div>
				</Container>
			</Container>	
			<Container lg fluid="md">
				<Alert variant={"danger"} className='p-2 mt-4 small'>
					<i className="fa-solid fa-circle-exclamation m-1"></i>
					預訂及抵達時間為參考時間，請以實際班次狀況為主
				</Alert>
				<div className={styles.tickets}>
					{data.map((data, index) => {
						return <Ticket key={index} data={data}/> 
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
