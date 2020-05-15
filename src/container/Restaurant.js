import React, { useEffect, useCallback } from "react";
import styles from "./Restaurant.module.css";
import { StarsRating } from "../components/starsRating";
import { ImageRestaurant } from "../components/ImageRestaurant";
import { DetailsRating } from "../components/DetailsRating";
import { useSelector, useDispatch } from "react-redux";
import {
  selectHighlightRestaurantId,
  selectSelectedRestaurantId,
  setHighlightRestaurantId,
  setSelectedRestaurantId,
  addGoogleReviews,
} from "../redux/restaurantListSlice";
import { selectMap, selectGoogle } from "../redux/mapSlice";

export function Restaurant({ restaurant }) {
  const dispatch = useDispatch();
  const highlightRestaurantId = useSelector(selectHighlightRestaurantId);
  const selectedRestaurantId = useSelector(selectSelectedRestaurantId);
  const map = useSelector(selectMap);
  const google = useSelector(selectGoogle);

  const handleClick = () => {
    if (selectedRestaurantId === restaurant.id) {
      dispatch(setSelectedRestaurantId(null));
    } else {
      dispatch(setSelectedRestaurantId(restaurant.id));
    }
  };

  const toggleHover = () => {
    if (selectedRestaurantId !== restaurant.id) {
      if (highlightRestaurantId !== restaurant.id) {
        dispatch(setHighlightRestaurantId(restaurant.id));
      } else {
        dispatch(setHighlightRestaurantId(null));
      }
    }
  };

  const fetchReviews = useCallback(() => {
    if (selectedRestaurantId === restaurant.id && !restaurant.isLoadingReview) {
      const service = new google.maps.places.PlacesService(map);
      service.getDetails({ placeId: restaurant.id }, function (result) {
        let reviews = {};
        if (result.reviews === undefined) {
          reviews.place_id = result.place_id;
          dispatch(addGoogleReviews({ reviews }));
        } else {
          reviews.place_id = result.place_id;
          reviews.ratings = result.reviews.map(
            ({ author_name, rating, text }) => ({
              author_name,
              rating,
              text,
            })
          );
          dispatch(addGoogleReviews({ reviews }));
        }
      });
    }
  }, [dispatch, google, map, restaurant, selectedRestaurantId]);

  useEffect(() => {
    if (map) {
      fetchReviews();
    }
  }, [map, fetchReviews]);

  return (
    <div
      id={restaurant.id}
      className={
        highlightRestaurantId === restaurant.id ||
        selectedRestaurantId === restaurant.id
          ? styles.selectRestaurant
          : styles.restaurantBox
      }
      onClick={() => handleClick()}
      onMouseEnter={() => toggleHover()}
      onMouseLeave={() => toggleHover()}
    >
      <h3>{restaurant.restaurantName}</h3>
      {restaurant.ratings.length || restaurant.averageRating ? (
        <StarsRating averageRating={restaurant.averageRating} />
      ) : (
        <p>- No rating -</p>
      )}
      <div>
        <ImageRestaurant
          lat={restaurant.lat}
          long={restaurant.long}
          active={selectedRestaurantId === restaurant.id}
        />
      </div>
      <DetailsRating
        ratings={restaurant.ratings}
        active={selectedRestaurantId === restaurant.id}
      />
    </div>
  );
}
