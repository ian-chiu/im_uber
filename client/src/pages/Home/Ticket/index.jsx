import Badge from 'react-bootstrap/Badge';
import styles from "./style.module.css"
import { Link } from 'react-router-dom';
function Ticket({ data, linkto }) {
	let status = "再過...發車"
	let status_style = "bg-primary"
	switch (data.status) {
		case 1:
			status = "正在進行"
			status_style = "bg-danger"
			break;
		case 2:
			status = "已完成"
			status_style = "bg-dark"
	}
	return (
        <Link to={linkto} className={styles.ticket}>
			<div className={`${styles.header}`}>
				<div className={`${styles.rideStatus} small ${status_style}`}>{status}</div>
				<div className="d-flex justify-content-between align-items-center">
					<div>
						<div className="small">{data.from}</div>
						<div className="h3 m-0">{data.departure_time}</div>
					</div>
					<div className="d-flex flex-column justify-content-center align-items-center">
						<i className={`fa-solid fa-car-side ${styles.car}`}></i>
						<Badge pill bg="light" text="dark">
							<i className="fa-regular fa-clock"></i>
							<span className='px-1'>01:30</span>
						</Badge>
					</div>
					<div className={styles.arrival}>
						<div className="small">{data.to}</div>
						<div className="h3 m-0">{data.arrival_time}</div>
					</div>
				</div>
			</div>
			<div className={`${styles.footer}`}>
				<div className='d-flex w-100 justify-content-between pb-3'>
					<div>
						<div className="small fw-bold">車牌</div>
						<div>{data.vehicle.license_plate}</div>
					</div>
					<div>
						<div className="small fw-bold">駕駛</div>
						<div>{data.driver.name}</div>
					</div>
					<div>
						<div className="small fw-bold">人數</div>
						<div>{data.passengers.length} / {data.vehicle.seats}人</div>
					</div>
				</div>
				<div className='d-flex w-100 justify-content-between align-items-end'>
					<div>
						<div className="small fw-bold">日期</div>
						<div>{data.date}</div>
					</div>
					<div className='text-danger h5 mb-0'>$NTD 240</div>
				</div>
			</div>
		</Link>
	)
}

export default Ticket
