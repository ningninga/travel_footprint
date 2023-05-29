import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import mapboxgl from "mapbox-gl"; // This is a dependency of react-map-gl even if you didn't explicitly install it

import * as React from 'react';
import { Room, Star } from '@material-ui/icons';
import "./App.css";
import axios from "axios";
import { format } from "timeago.js"
import { useState, useEffect } from 'react';
import Register from "./components/Register";
import Login from "./components/Login"


// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
function App() {
  const myStorage = window.localStorage;
  const [viewport, setViewport] = useState({

    latitude: 53,
    longitude: -6,
    zoom: 5

  });
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('http://16.16.60.18/api/pins');
        setPins(res.data)
      } catch (err) {
        console.log(err)
      }
    };
    getPins();
  }, []);
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport(prevState => ({
      ...prevState,
      latitude: lat,
      longitude: long
    }));
  }

  const hanleAddClick = (e) => {
    console.log(e)
    const lat = e.lngLat.lat;
    const long = e.lngLat.lng;

    setNewPlace({
      lat: lat,
      long: long,
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    }

    try {
      const res = await axios.post('http://16.16.60.18/api/pins', newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err)
    }
  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUsername(null);
     
  };

  return (

    <div className="App" style={{ height: "100vh", width: "100%" }}>

      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onMove={(viewport) => setViewport(viewport)}
        onDblClick={hanleAddClick}
        transitionDuration="2000"

      >

        {pins.map((p) => (
          <>
            <Marker longitude={p.long} latitude={p.lat} anchor='center' scale={2} offsetLeft={-viewport.zoom * 3.5} offsetTop={-viewport.zoom * 7} >
              <Room style={{
                fontSize: viewport.zoom * 7,
                color: p.username === currentUsername ? 'tomato' : 'blue',
                cursor: "pointer"
              }}
                onClick={() => { handleMarkerClick(p._id, p.lat, p.long); }}

              />
            </Marker>

            {p._id === currentPlaceId && (
              <Popup longitude={p.long} latitude={p.lat}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}>
                <div className='card'>
                  <label>Place</label>
                  <h4 className='place'>{p.title}</h4>
                  <label>Review</label>
                  <p className='desc'>{p.desc}</p>
                  <label>Rating</label>
                  <div className='stars'>
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className='username'>Created by <b>{p.username}</b></span>
                  <span className='date'>{format(p.createdAt)}</span>
                </div>
              </Popup>)
            }

          </>
        ))}
        {newPlace && (
          <>
            <Marker
              latitude={newPlace.lat}
              longitude={newPlace.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color: "tomato",
                  cursor: "pointer",
                }}
              />
            </Marker>
            <Popup
              longitude={newPlace.long}
              latitude={newPlace.lat}
              anchor="left"
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}>
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input placeholder='Enter a title' onChange={(e) => setTitle(e.target.value)} />
                  <label>Review</label>
                  <textarea placeholder='Tell us something about it' onChange={(e) => setDesc(e.target.value)} />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button className='submitButton' type="submit">Add Pin</button>
                </form>
              </div>
            </Popup>
          </>
        )}
        {currentUsername ? (<button className='button logout' onClick={handleLogout}>Log out</button>) : (<div className='buttons'>
          <button className='button login' onClick={() => {setShowLogin(true); setShowRegister(false);}}>Login</button>
          <button className='button register' onClick={() => {setShowRegister(true); setShowLogin(false)}}>Register</button>
        </div>)}
        {showRegister && <Register setShowRegister={setShowRegister}/>}
        {showLogin && <Login setShowLogin={setShowLogin}  setCurrentUsername={setCurrentUsername} myStorage={myStorage}/>}
      </ReactMapGL>;
    </div >
  );
}

export default App;
