import { useState } from 'react';
import {Container, Button} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavLink from './NavLink';
import { Link, useNavigate } from "react-router-dom";
import Offcanvas from 'react-bootstrap/Offcanvas';
import "./style.css"
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '~/pages/Auth/authSlice';
import axios from '~/app/axios';

function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const username = useSelector(state => state.auth.username)
    const [activeKey, setActiveKey] = useState("0")
    function handleLogout() {
        axios.get("/auth/logout").then(res => {
            dispatch(authActions.logout())
            navigate("/auth")
        })
    }
    console.log(username)
    return (
        <Navbar bg="light" variant="light">
            <Container>
                <Navbar.Brand as={Link} to="/">I'm Uber</Navbar.Brand>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />
                <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-sm`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
                    placement="end"
                >
                    <Offcanvas.Header closeButton />
                    <Offcanvas.Body bg="light" className='align-items-center justify-content-end'>
                        <div className='px-3 mb-0 text-dark'>您好，{username}</div>
                        <Button className='danger' variant='danger' onClick={() => {handleLogout()}}>
                            Logout
                        </Button>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
}

export default Header;