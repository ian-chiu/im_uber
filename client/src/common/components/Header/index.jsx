import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavLink from './NavLink';
import Offcanvas from 'react-bootstrap/Offcanvas';
import "./style.css"

function Header() {
    const [activeKey, setActiveKey] = useState("0")
    return (
        <Navbar bg="dark" variant="dark" expand="sm">
            <Container>
                <Navbar.Brand href="#">MusicTalk</Navbar.Brand>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />
                <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-sm`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
                    placement="end"
                >
                    <Offcanvas.Header closeButton />
                    <Offcanvas.Body>
                        <Nav variant="pills" activeKey={activeKey} onSelect={setActiveKey} className="justify-content-end flex-grow-1 pe-3">
                            <NavLink eventKey="1" link="/instrument">Link</NavLink>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
}

export default Header;