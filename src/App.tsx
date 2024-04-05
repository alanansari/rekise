import { LatLngTuple } from 'leaflet';
import './App.css'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-rotatedmarker'
import { useState,useEffect } from 'react';

const start = [22.1696 , 91.4996];
const end = [22.2637, 91.7159];
const speed = 20; // km/h
const startIcon = new L.Icon({
  iconUrl: 'pin1.png',
  iconSize: [25, 25]
});
const endIcon = new L.Icon({
  iconUrl: 'pin2.png',
  iconSize: [25, 25]
});
const arrowIcon = new L.Icon({
  iconUrl: 'arrow.png',
  iconSize: [10, 50],
  iconAnchor: [5, 25]
});
const rotationAngle = (Math.atan2(end[1] - start[1], end[0] - start[0]) * 180) / Math.PI;

const center = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];

const FPS = 2;

function App() {

  const [position, setPosition] = useState(start);
  const [angle, setAngle] = useState(rotationAngle);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const distance = speed / 3600 * FPS; // km/s
      const angle = Math.atan2(end[1] - position[1], end[0] - position[0]);
      setAngle(angle);
      const dx = distance * Math.cos(angle);
      const dy = distance * Math.sin(angle);
      setPosition([position[0] + dx, position[1] + dy]);
    }, 1000 / FPS);
    if (position[0] >= end[0] && position[1] >= end[1]) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  });



  return (
    <>
      <div style={{display:'flex',padding:'20px',marginBottom:'20px',border:'1px solid gray',borderRadius:'10px'}}>
        <div style={{padding:'10px'}}>
          <div style={{fontWeight:600}}>Starting</div>
          <div>Latitude: {start[0]}</div>
          <div>Longitude: {start[1]}</div>
        </div>
        <div style={{color:'blue',display:'flex',justifyContent:'center',alignItems:'center',margin:'0 40px'}}>Speed: {speed}kmph</div>
        <div style={{padding:'10px'}}>
          <div style={{fontWeight:600}}>Ending</div>
          <div>Latitude: {end[0]}</div>
          <div>Longitude: {end[1]}</div>
        </div>
      </div>
      <MapContainer center={center as LatLngTuple} zoom={10}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position as LatLngTuple} icon={arrowIcon} rotationAngle={angle}></Marker>
      <Marker position={start as LatLngTuple} icon={startIcon}></Marker>
      <Marker position={end as LatLngTuple} icon={endIcon}></Marker>
      </MapContainer>
    </>
  )
}

export default App
