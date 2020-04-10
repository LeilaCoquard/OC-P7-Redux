import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import {
  selectRestaurants,
  setFormRestaurantActive,
  selectFormRestaurantActive,
  addGoogleRestaurants
} from "../restaurants-list/restaurantListSlice";
import { setMapReady, setBounds, selectMap } from "./mapSlice";
import ModalPortal from "../portal/ModalPortal";
import { FormAddRestaurant } from "../restaurants-list/form-add-restaurant/FormAddRestaurant";
import MarkerRestaurant from "./MarkerRestaurant";

export function MapContainer(props) {
  const dispatch = useDispatch();
  const restaurants = useSelector(selectRestaurants);
  let formRestaurantActive = useSelector(selectFormRestaurantActive);
  let map = useSelector(selectMap);

  const [geolocation, setGeolocation] = useState({
    lat: 48.859788,
    lng: 2.426219
  });

  const [newRestaurantLatLng, setNewRestaurantLatLng] = useState({
    lat: 48.859788,
    lng: 2.426219
  });

  const fetchPlaces = useCallback(() => {
    const service = new props.google.maps.places.PlacesService(map);

    let request = {
      location: {
        lat: map.center.lat(),
        lng: map.center.lng()
      },
      radius: "500",
      type: "restaurant"
    };

    service.nearbySearch(request, function(result) {
      dispatch(
        addGoogleRestaurants(
          result.map(({ place_id, name, vicinity, geometry, rating }) => ({
            place_id,
            name,
            vicinity,
            rating,
            lat: geometry.location.lat(),
            long: geometry.location.lng()
          }))
        )
      );
    });
    // googleRestaurants = result.map(restaurant =>
    //   service.getDetails({ placeId: restaurant.place_id }, function(){return result}
  }, [props.google, map, dispatch]);

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

  useEffect(() => {
    if (map) {
      fetchPlaces();
    }
  }, [map, fetchPlaces, geolocation]);

  return (
    <>
      <Map
        containerStyle={containerStyle}
        google={props.google}
        zoom={15}
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
          setNewRestaurantLatLng({ lat: c.latLng.lat(), lng: c.latLng.lng() });
          dispatch(setFormRestaurantActive(true));
        }}
        onDragend={fetchPlaces}
      >
        <Marker name={"Your position"} position={geolocation} />

        {restaurants.map(restaurant => (
          <MarkerRestaurant restaurant={restaurant} key={restaurant.id} />
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
  apiKey: "AIzaSyCaigs_WIRdg5EL906xTOQqpSQGzrKWzFY",
  language: "fr",
  libraries: ["places"]
})(MapContainer);

const containerStyle = {
  position: "absolute",
  width: "70%",
  height: "100%"
};
