import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Container } from 'react-bootstrap';
import './topnavbar.css';

function TopNavbar({
  setShowLogin,
  setShowRegister,
  currentUsername,
  handleLogout,
  setShowAbout,
  setCurrentUsername,
  myStorage,
  setAlertTimeout
}) {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <div className="navbar-content">
          <Navbar.Brand href="/home">Travel-Footprint</Navbar.Brand>
          <div className="navbar-nav-wrapper">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className="nav-right">
              <Nav>
                <>
                <Nav.Link onClick={() => {setShowAbout(true); setShowLogin(false); setShowRegister(false)}}>About Us</Nav.Link>
                {currentUsername ? (
                  <>
                    <Navbar.Text className="nav-username">Hi, {currentUsername}</Navbar.Text>
                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link onClick={() => {setShowLogin(true); setShowRegister(false); setShowAbout(false);}}>Login</Nav.Link>
                    <Nav.Link onClick={() => {setShowRegister(true); setShowLogin(false); setShowAbout(false);}}>Register</Nav.Link>
                  </>
                )}
                
                </>
              </Nav>
            </Navbar.Collapse>
          </div>
        </div>
      </Container>
    </Navbar>
  );
}


export default TopNavbar;

