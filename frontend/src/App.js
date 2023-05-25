import Map, { Marker, Popup } from 'react-map-gl';
import * as React from 'react';
import { Room, Star } from '@material-ui/icons';
import "./App.css";
import axios from "axios";
import { format } from "timeago.js"
import { useState, useEffect } from 'react';

function App() {
  const [viewport, setViewport] = useState({

    latitude: 53,
    longitude: -6,
    zoom: 5

  });
  const currentUser = "jianing"
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
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
  return (

    <div className="App" style={{ height: "100vh", width: "100%" }}>

      <Map
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onMove={(viewport) => setViewport(viewport)}
        onDblClick={hanleAddClick}

      >

        {pins.map((p) => (
          <>
            <Marker longitude={p.long} latitude={p.lat} anchor='center' scale={2} >
              <Room style={{
                fontSize: viewport.zoom * 7,
                color: p.username === currentUser ? 'tomato' : 'blue',
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
                  <div>
                    <Star className='star' />
                    <Star className='star' />
                    <Star className='star' />
                    <Star className='star' />
                    <Star className='star' />
                  </div>
                  <label>Information</label>
                  <span className='username'>Created by <b>{p.username}</b></span>
                  <span className='date'>{format(p.createdAt)}</span>
                </div>
              </Popup>)}
          </>
        ))}
        {newPlace && (
          <Popup
            longitude={newPlace.long}
            latitude={newPlace.lat}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setCurrentPlaceId(null)}>
            hello
          </Popup>
        )}

      </Map>;
    </div>
  );
}

export default App;
