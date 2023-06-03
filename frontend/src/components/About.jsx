import React from 'react';
import './about.css';
import { Cancel, Room } from "@material-ui/icons";

function About({ setShowAbout}) {
  return (
    <>
    <div className="aboutContainer">
        <div className="logo">
            <Room className="logoIcon" />
            <span>NN Pin</span>
        </div>
        <p className='about-content'><br/><br/><br/>Are you ready for leaving your unique memory here?<br/><br/><br/>Come and join us!<br/><br/><br/>Double click our map and leave your own reviews!</p>
        <Cancel className="aboutCancel" onClick={() => setShowAbout(false)} />
    </div>
    </>
  );
}

export default About;