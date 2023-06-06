import { Form, Button, ButtonGroup, ToggleButton } from 'react-bootstrap' 
import styles from './style.module.css'
import { useDispatch } from 'react-redux'
import { authActions } from './authSlice'
import { useState } from 'react'
import axios from "~/app/axios"
import { toast } from 'react-toastify'
import { redirect, useNavigate } from 'react-router'
import { useEffect } from 'react'

function Auth(props) {
    const navigate = useNavigate();
    const dispath = useDispatch()
    const [usernameInput, setUsernameInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const [phoneInput, setPhoneInput] = useState("")
    const [confirmPasswordInput, setConfPasswordInput] = useState("")
    const [radioValue, setRadioValue] = useState('passenger');
    const [isLogin, setIsLogin] = useState(true);
    const radios = [
      { name: 'passenger', value: 'passenger' },
      { name: 'driver', value: 'driver' },
    ];
    useEffect(() => {
        props.setIsLoading(false)
    })
    function handleLogin() {
        axios.post("/auth/login", {
            "username": usernameInput,
            "password": passwordInput
          }).then(res_login => {
            axios.post("/users/role", {
                "role": radioValue
            }).then(res => {
                dispath(authActions.setRole(radioValue))
                dispath(authActions.login())
                dispath(authActions.setUsername(res_login.data["User"].userName))
                toast.success("login success " + radioValue)
                if (radioValue == "driver")
                    navigate("/driver")
                else
                    navigate("/")
            })
        }).catch(err => {
            toast.error(err.response.data.message)
        })
    }
    function handleRegister() {
        if (passwordInput == confirmPasswordInput) {
            axios.post("/auth/signup", {
                "username": usernameInput,
                "password": passwordInput,
                "phone": phoneInput
              }).then(res => {
                setIsLogin(true)
                toast.success("Register success")
            }).catch(err => {
                toast.error(err.response.data.message)
            })
        } else {
            toast.error("Confirm password not match")
        }
    }
	return (
        <div className={["d-flex w-100 h-100", styles.page].join(' ')}>
            <div className={['d-flex', styles.left, styles.content].join(' ')}>1</div>   
            <div  className={['d-flex justify-content-center align-items-center', styles.right, styles.content].join(' ')}>
                <div className={styles.form}>
                    <h3>{isLogin ? "Login" : "Register"}</h3>
                    <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control placeholder="Enter username" value={usernameInput} onChange={(event) => setUsernameInput(event.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={passwordInput} onChange={(event) => setPasswordInput(event.target.value)}/>
                    </Form.Group>
                    {
                        !isLogin ?<>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={confirmPasswordInput} onChange={(event) => setConfPasswordInput(event.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="phone" placeholder="0900000000" value={phoneInput} onChange={(event) => setPhoneInput(event.target.value)}/>
                            </Form.Group>
                        </>
                        :
                        <Form.Group>
                            <Form.Label>Role</Form.Label>
                            <div className={styles.choose}>
                            <ButtonGroup>
                                {radios.map((radio, idx) => (
                                    <ToggleButton
                                        key={idx}
                                        id={`radio-${idx}`}
                                        type="radio"
                                        variant='outline-danger'
                                        name="radio"
                                        value={radio.value}
                                        checked={radioValue === radio.value}
                                        onChange={(e) => setRadioValue(e.currentTarget.value)}
                                    >
                                    {radio.name}
                                    </ToggleButton>
                                ))}
                            </ButtonGroup>
                            </div>
                        </Form.Group>
                    }
                    <Button onClick={() => { 
                        if (isLogin) {
                            handleLogin()
                        } else {
                            handleRegister()
                        }
                    }} className='w-100 btn-danger mt-3' variant="primary">
                        Submit
                    </Button>
                    {
                        isLogin ?
                        <div className={styles.registerNow}>Not a member? <a className='text-primary' onClick={() => setIsLogin(false)}>Register now</a></div>
                        :
                        <div className={styles.registerNow}>Already a member? <a className='text-primary' onClick={() => setIsLogin(true)}>Login</a></div>
                    }
                    </Form>
                </div>
            </div>
        </div>
	)
}

export default Auth
