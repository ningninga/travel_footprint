import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import * as React from 'react';
import { Room, Star } from '@material-ui/icons';
import "./App.css";
import axios from "axios";
import { format } from "timeago.js"
import { useState, useEffect } from 'react';
import Register from "./components/Register";
import Login from "./components/Login";
import Alert from '@material-ui/lab/Alert';
import ImageModal from './components/ImageModal';
import TopNavbar from './components/TopNavbar';
import About from './components/About';

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
  const [alertTimeout, setAlertTimeout] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loginAlert, setLoginAlert] = useState(false);
  const [showAbout, setShowAbout] =useState(false);


  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('/pins');
        setPins(res.data);
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

  // Double click the map, if the user has not logged in, open the login form.
  const hanleAddClick = (e) => {
    console.log(e.lngLat);
    const lat = e.lngLat.lat;
    const long = e.lngLat.lng;
    if (currentUsername) {
      setNewPlace({
        lat: lat,
        long: long,
      });
    }
    else {
      setLoginAlert(true);
      setTimeout(() => {
        setLoginAlert(false);
        setShowLogin(true);
      }, 1000);
    }

  }

  // After user fill the form, send a post request
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
      imageUrl: selectedFile
    }

    try {
      const res = await axios.post('/pins', newPin, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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

  const handleImageClick = (imgSrc) => {
    setCurrentImage(imgSrc);
    setShowImageModal(true);
  };

  return (
      <div className="App" style={{ height: "100vh", width: "100%" }}>
       <TopNavbar 
        currentUsername={currentUsername}
        handleLogout={handleLogout}
        setShowLogin={setShowLogin} 
        setShowRegister={setShowRegister} 
        setCurrentUsername={setCurrentUsername} 
        myStorage={myStorage} 
        setAlertTimeout={setAlertTimeout} 
        setShowAbout={setShowAbout}
      />
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
          {loginAlert && <div className="alert-container">
            <Alert className="alert-timeout" severity="error">
              'You have to login to create your own pins'
            </Alert>
          </div>}

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
                  <div className={p.imageUrl ? 'card' : 'card-no-image'}>
                    {p.imageUrl &&
                      <img
                        className="image"
                        src={p.imageUrl}
                        onClick={() => handleImageClick(p.imageUrl)}
                        alt={p.title}
                      />}

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
                    <label>Select A Photo</label>
                    <input type='file' onChange={(e) => setSelectedFile(e.target.files[0])} />
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
        
          {alertTimeout &&
            <div className="alert-container">
              <Alert className="alert-timeout" severity="error">
                'You have been logged out due to inactivity'
              </Alert>
            </div>
          }
          {showAbout && <About setShowAbout={setShowAbout} />}
          {showRegister && <Register setShowRegister={setShowRegister} />}
          {showLogin && <Login setShowLogin={setShowLogin} setCurrentUsername={setCurrentUsername} myStorage={myStorage} setAlertTimeout={setAlertTimeout} />}
          <ImageModal
            showModal={showImageModal}
            imageSrc={currentImage}
            hideModal={() => setShowImageModal(false)}
          />
        </ReactMapGL>;
      </div>
      );
    
}


export default App;