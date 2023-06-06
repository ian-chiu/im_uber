import Badge from 'react-bootstrap/Badge';
import styles from "./style.module.css"
import { Link } from 'react-router-dom';
import { getDateString, getTimeString, getDiffString } from '~/utils/time';

function Ticket({ status, linkto, departure_stop, arrival_stop, departure_timestamp, arrival_timestamp, price, seats, occupied, driver, license_plate }) {
	let status_text = "待發車"
	let status_style = "bg-primary"
	switch (status) {
		case 0:	
			status_text = "待發車"
			status_style = "bg-primary"
			break;
		case 1:
			status_text = "正在進行"
			status_style = "bg-danger"
			break;
		case 2:
			status_text = "已完成"
			status_style = "bg-dark"
			break;
	}
	let duration = getDiffString(arrival_timestamp - departure_timestamp)
	return (
        <Link to={linkto} className={styles.ticket}>
			<div className={`${styles.header}`}>
				{status != null && 
					<div className={`${styles.rideStatus} small ${status_style}`}>{status_text}</div>
				}
				<div className="d-flex justify-content-between align-items-center">
					<div>
						<div className="small">{departure_stop}</div>
						<div className="h3 m-0">{getTimeString(departure_timestamp)}</div>
					</div>
					<div className="d-flex flex-column justify-content-center align-items-center">
						<i className={`fa-solid fa-car-side ${styles.car}`}></i>
						<Badge pill bg="light" text="dark">
							<i className="fa-regular fa-clock"></i>
							<span className='px-1'>{duration}</span>
						</Badge>
					</div>
					<div className={styles.arrival}>
						<div className="small">{arrival_stop}</div>
						<div className="h3 m-0">{getTimeString(arrival_timestamp)}</div>
					</div>
				</div>
			</div>
			<div className={`${styles.footer}`}>
				<div className='d-flex w-100 justify-content-between pb-3'>
					<div>
						<div className="small fw-bold">車牌</div>
						<div>{license_plate}</div>
					</div>
					<div>
						<div className="small fw-bold">駕駛</div>
						<div>{driver}</div>
					</div>
					<div>
						<div className="small fw-bold">人數</div>
						<div>{occupied} / {seats}人</div>
					</div>
				</div>
				<div className='d-flex w-100 justify-content-between align-items-end'>
					<div>
						<div className="small fw-bold">日期</div>
						<div>{getDateString(departure_timestamp)}</div>
					</div>
					<div className='text-danger h5 mb-0'>$NTD {price}</div>
				</div>
			</div>
		</Link>
	)
}

export default Ticket
