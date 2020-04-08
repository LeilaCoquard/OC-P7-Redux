import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setFormRestaurantActive, addRestaurant } from "../restaurantListSlice";
import axios from "axios";

export function FormAddRestaurant({ latLng }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const closeModal = () => {
    dispatch(setFormRestaurantActive(false));
  };

  if (latLng.lat !== "") {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng.lat},${latLng.lng}&location_type=ROOFTOP&result_type=street_address&key=AIzaSyCaigs_WIRdg5EL906xTOQqpSQGzrKWzFY`
      )
      .then(res => {
        setAddress(res.data.results[0].formatted_address);
      });
  }

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
              onChange={e => setName(e.target.value)}
            />
            <input
              className="input"
              type="text"
              placeholder={address}
              style={{ marginBottom: "5px" }}
              value={address}
              onChange={e => setAddress(e.target.value)}
              readOnly
            />
            {/* <br /> */}
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-white"
              onClick={() => {
                dispatch(
                  addRestaurant({
                    restaurantName: name,
                    address: address,
                    lat: latLng.lat,
                    long: latLng.lng
                  })
                );
                setName("");
                setAddress("");
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
