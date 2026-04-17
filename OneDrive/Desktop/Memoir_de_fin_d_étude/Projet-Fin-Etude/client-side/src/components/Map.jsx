import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";
import { Icon } from "leaflet";
import location from "../assets/location.png";
import MapFix from "./MapFix";

export default function Map({ coordinates, name }) {
  const locIcon = new Icon({
    iconUrl: location,
    iconSize: [30, 30],
  });

  return (
    <div className="w-full h-96 rounded-md overflow-hidden">
      {coordinates && coordinates.length === 2 ? (
        <MapContainer
          center={coordinates}
          zoom={13}
          className="w-full z-0 h-full"
        >
          <MapFix />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={coordinates} icon={locIcon}>
            <Popup>{name || "Location"}</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>No coordinates</p>
      )}
    </div>
  );
}
