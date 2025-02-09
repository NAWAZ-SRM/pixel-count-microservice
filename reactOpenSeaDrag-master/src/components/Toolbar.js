import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';

const TopNavbar = () => {
  return (
    <Navbar bg="light" variant="light">
      <Nav className="justify-content-center" style={{ width: '100%' }}>
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="https://www.mayirpsciences.com/" target="_blank">About</Nav.Link>
        <Nav.Link href="#">Contact</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default TopNavbar;