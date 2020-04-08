import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import {
  selectRestaurants,
  setHighlightRestaurant,
  setSelectedRestaurant,
  setFormRestaurantActive,
  selectHighlightRestaurant,
  selectSelectedRestaurant,
  selectFormRestaurantActive
} from "../restaurants-list/restaurantListSlice";
import { setMapReady, setBounds } from "./mapSlice";
import ModalPortal from "../portal/ModalPortal";
import { FormAddRestaurant } from "../restaurants-list/form-add-restaurant/FormAddRestaurant";

export function MapContainer(props) {
  const dispatch = useDispatch();
  const restaurants = useSelector(selectRestaurants);
  let highlightRestaurant = useSelector(selectHighlightRestaurant);
  let selectedRestaurant = useSelector(selectSelectedRestaurant);
  let formRestaurantActive = useSelector(selectFormRestaurantActive);

  const [geolocation, setGeolocation] = useState({
    lat: 48.859788,
    lng: 2.426219
  });

  const [newRestaurantLatLng, setNewRestaurantLatLng] = useState({
    lat: "",
    lng: ""
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        setGeolocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  return (
    <>
      <Map
        containerStyle={containerStyle}
        google={props.google}
        zoom={14}
        center={geolocation}
        initialCenter={geolocation}
        onReady={(_, map) => {
          const listener = props.google.maps.event.addListener(
            map,
            "bounds_changed",
            function() {
              window.map = map;
              dispatch(setMapReady(true));
              props.google.maps.event.removeListener(listener);
            }
          );
        }}
        onBounds_changed={(_, map) => {
          const listener = props.google.maps.event.addListener(
            map,
            "bounds_changed",
            function() {
              dispatch(setBounds(window.map.getBounds().toJSON()));
              props.google.maps.event.removeListener(listener);
            }
          );
        }}
        onClick={(t, map, c) => {
          dispatch(setFormRestaurantActive(true));
          setNewRestaurantLatLng({ lat: c.latLng.lat(), lng: c.latLng.lng() });
        }}
      >
        <Marker name={"Your position"} position={geolocation} />

        {restaurants.map(restaurant => (
          <Marker
            name={restaurant.restaurantName}
            title={restaurant.restaurantName}
            key={restaurant.restaurantName}
            position={{ lat: restaurant.lat, lng: restaurant.long }}
            icon={
              highlightRestaurant === restaurant.restaurantName ||
              selectedRestaurant === restaurant.restaurantName
                ? { url: "restaurantBig.png" }
                : { url: "restaurant.png" }
            }
            onMouseover={() => {
              dispatch(setHighlightRestaurant(restaurant.restaurantName));
            }}
            onMouseout={() => {
              dispatch(setHighlightRestaurant(null));
            }}
            onClick={() => {
              if (selectedRestaurant === restaurant.restaurantName) {
                dispatch(setSelectedRestaurant(null));
                dispatch(setHighlightRestaurant(null));
              } else {
                dispatch(setSelectedRestaurant(restaurant.restaurantName));
              }
            }}
          />
        ))}
      </Map>

      {formRestaurantActive ? (
        <ModalPortal>
          <FormAddRestaurant latLng={newRestaurantLatLng} />
        </ModalPortal>
      ) : null}
    </>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyCaigs_WIRdg5EL906xTOQqpSQGzrKWzFY"
})(MapContainer);

const containerStyle = {
  position: "absolute",
  width: "70%",
  height: "100%"
};
