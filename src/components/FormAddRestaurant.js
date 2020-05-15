import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setFormRestaurantActive,
  addRestaurant,
} from "../redux/restaurantListSlice";
import axios from "axios";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
} from "react-google-places-autocomplete";
import { API_KEY } from "../constants";

export function FormAddRestaurant({ latLng }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [{ lat, lng }, setLatLng] = useState({
    lat: latLng.lat,
    lng: latLng.lng,
  });
  const closeModal = () => {
    dispatch(setFormRestaurantActive(false));
  };

  useEffect(() => {
    if (latLng.lat !== "") {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng.lat},${latLng.lng}&location_type=ROOFTOP&result_type=street_address&key=${API_KEY}`
        )
        .then((res) => {
          setAddress(res.data.results[0].formatted_address);
        });
    }
  }, [latLng.lat, latLng.lng]);

  const getLatLong = (newAddress) => {
    geocodeByAddress(newAddress).then((results) => {
      setLatLng({
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      });
    });
  };

  return (
    <>
      <div className="modal is-active">
        <div className="modal-background" onClick={closeModal}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Ajout d'un restaurant</p>
            <button
              className="delete"
              aria-label="close"
              onClick={closeModal}
            ></button>
          </header>
          <section className="modal-card-body">
            <input
              className="input"
              type="text"
              placeholder="Nom du restaurant"
              style={{ marginBottom: "5px" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <GooglePlacesAutocomplete
              inputClassName="input"
              type="text"
              placeholder={address}
              inputStyle={{ marginBottom: "5px" }}
              initialValue={address}
              onSelect={({ description }) => {
                setAddress(description);
                getLatLong(description);
              }}
            />
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-white"
              onClick={() => {
                dispatch(
                  addRestaurant({
                    restaurantName: name,
                    address: address,
                    lat: lat,
                    long: lng,
                  })
                );
                setName("");
                setAddress("");
                setLatLng({ lat: "", lng: "" });
                closeModal();
              }}
            >
              Envoyer
            </button>
            <button className="button is-white" onClick={closeModal}>
              Annuler
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}
