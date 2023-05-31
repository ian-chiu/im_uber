import { Form, Button } from 'react-bootstrap' 
import styles from './style.module.css'
import { useDispatch } from 'react-redux'
import { authActions } from './authSlice'

function Auth(props) {
    const dispath = useDispatch()
	return (
        <div className={["d-flex w-100 h-100", styles.page].join(' ')}>
            <div className={['d-flex', styles.left, styles.content].join(' ')}>1</div>   
            <div  className={['d-flex justify-content-center align-items-center', styles.right, styles.content].join(' ')}>
                <div className={styles.form}>
                    <h3>{props.driver ? "Driver Login" : "Passenger Login"}</h3>
                    <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Button onClick={() => dispath(authActions.login())} className='w-100 btn-danger' variant="primary" type="submit">
                        Submit
                    </Button>
                    </Form>
                </div>
            </div>
        </div>
	)
}

export default Auth
