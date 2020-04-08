import React from "react";
import styles from "./ImageRestaurant.module.css";

export function ImageRestaurant({ lat, long, active }) {
  return (
    <>
      <hr className={active ? styles.hrfadein : styles.hrfadeout} />
      <img
        src={`https://maps.googleapis.com/maps/api/streetview?location=${lat},${long}&size=150x150&key=AIzaSyCaigs_WIRdg5EL906xTOQqpSQGzrKWzFY`}
        alt="restaurant"
        className={`${styles.image} ${active ? styles.active : ""}`}
      />
    </>
  );
}
