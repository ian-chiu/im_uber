import { useState } from 'react';
import {Container, Button} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavLink from './NavLink';
import { Link } from "react-router-dom";
import Offcanvas from 'react-bootstrap/Offcanvas';
import "./style.css"
import { useDispatch } from 'react-redux';
import { authActions } from '~/pages/Auth/authSlice';
import axios from '~/app/axios';

function Header() {
    const dispatch = useDispatch()
    const [activeKey, setActiveKey] = useState("0")
    function handleLogout() {
        axios.get("/auth/logout").then(res => {
            console.log(document.cookie)
            dispatch(authActions.logout())
        })
    }
    return (
        <Navbar bg="light" variant="light" expand="sm">
            <Container>
                <Navbar.Brand as={Link} to="/">I'm Uber</Navbar.Brand>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />
                <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-sm`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
                    placement="end"
                >
                    <Offcanvas.Header closeButton />
                    <Offcanvas.Body className='justify-content-end'>
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