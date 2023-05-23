import React from 'react';
import Nav from 'react-bootstrap/Nav';
import LinkContainer from '~/common/components/LinkContainer';

const NavLink = (props) => {
    return (
        <Nav.Item>
            <LinkContainer to={props.link}>
            <Nav.Link eventKey={props.eventKey} href={props.link}>
                <span>{props.children}</span>
            </Nav.Link>
            </LinkContainer>
        </Nav.Item>
    );
};

export default NavLink;