import React from "react";
import styles from "./Restaurant.module.css";
import { StarsRating } from "../stars-rating/starsRating";
import { ImageRestaurant } from "../image-restaurant/ImageRestaurant";
import { DetailsRating } from "../details-rating/DetailsRating";
import { useSelector, useDispatch } from "react-redux";
import {
  selectHighlightRestaurant,
  selectSelectedRestaurant,
  setHighlightRestaurant,
  setSelectedRestaurant
} from "../restaurantListSlice";

export function Restaurant({ restaurant }) {
  const dispatch = useDispatch();
  const highlightRestaurant = useSelector(selectHighlightRestaurant);
  const selectedRestaurant = useSelector(selectSelectedRestaurant);

  const handleClick = () => {
    if (selectedRestaurant === restaurant.restaurantName) {
      dispatch(setSelectedRestaurant(null));
    } else {
      dispatch(setSelectedRestaurant(restaurant.restaurantName));
    }
  };

  const toggleHover = () => {
    if (selectedRestaurant !== restaurant.restaurantName) {
      if (highlightRestaurant !== restaurant.restaurantName) {
        dispatch(setHighlightRestaurant(restaurant.restaurantName));
      } else {
        dispatch(setHighlightRestaurant(null));
      }
    }
  };

  return (
    <div
      key={restaurant.restaurantName}
      className={
        highlightRestaurant === restaurant.restaurantName ||
        selectedRestaurant === restaurant.restaurantName
          ? styles.selectRestaurant
          : styles.restaurantBox
      }
      onClick={() => handleClick()}
      onMouseEnter={() => toggleHover()}
      onMouseLeave={() => toggleHover()}
    >
      <h3>{restaurant.restaurantName}</h3>
      {restaurant.ratings.length || restaurant.googleRating ? (
        <StarsRating
          ratings={restaurant.ratings}
          googleRating={restaurant.googleRating}
        />
      ) : (
        <p>- No rating -</p>
      )}
      <div>
        <ImageRestaurant
          lat={restaurant.lat}
          long={restaurant.long}
          active={selectedRestaurant === restaurant.restaurantName}
        />
      </div>
      <DetailsRating
        ratings={restaurant.ratings}
        active={selectedRestaurant === restaurant.restaurantName}
      />
    </div>
  );
}
