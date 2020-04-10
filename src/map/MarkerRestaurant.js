import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Marker } from "google-maps-react";
import {
  setHighlightRestaurant,
  setSelectedRestaurant,
  selectHighlightRestaurant,
  selectSelectedRestaurant
} from "../restaurants-list/restaurantListSlice";

export default function MarkerRestaurant({ restaurant, ...restProps }) {
  const dispatch = useDispatch();
  let highlightRestaurant = useSelector(selectHighlightRestaurant);
  let selectedRestaurant = useSelector(selectSelectedRestaurant);

  return (
    <Marker
      {...restProps}
      name={restaurant.restaurantName}
      title={restaurant.restaurantName}
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
  );
}
