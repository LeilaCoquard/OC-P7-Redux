import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { selectMap } from "./mapSlice";

export const slice = createSlice({
  name: "restaurantsList",
  initialState: {
    restaurants: [],
    highlightRestaurantId: null,
    selectedRestaurantId: null,
    rangeFilter: { min: 0, max: 5 },
    formRatingActive: false,
    formRestaurantActive: false,
  },
  reducers: {
    loadRestaurants: (state, action) => {
      let loadingRestaurants = action.payload;
      loadingRestaurants.forEach((restaurant, i) => {
        restaurant.id = i;
        restaurant.isLoadingReview = true;
        restaurant.averageRating = getAverage(restaurant.ratings);
        restaurant.nbUserRating = restaurant.ratings.length;
      });
      state.restaurants = [...state.restaurants, ...loadingRestaurants];
    },
    addRating: (state, action) => {
      let index = state.restaurants.findIndex(
        (restaurant) => restaurant.id === action.payload.id
      );
      state.restaurants[index].ratings.push({
        stars: action.payload.stars,
        author: action.payload.author,
        comment: action.payload.comment,
      });
      state.restaurants[index].nbUserRating++;
      if (state.restaurants[index].averageRating === undefined) {
        state.restaurants[index].averageRating = action.payload.stars;
      } else {
        state.restaurants[index].averageRating =
          (action.payload.stars +
            state.restaurants[index].averageRating *
              (state.restaurants[index].nbUserRating - 1)) /
          state.restaurants[index].nbUserRating;
      }
    },
    addRestaurant: (state, action) => {
      let restaurant = {
        ...action.payload,
        isLoadingReview: true,
        ratings: [],
        averageRating: undefined,
        id: `${action.payload.lat}${action.payload.long}`,
      };
      state.restaurants.push(restaurant);
      state.formRestaurantActive = false;
    },
    addGoogleRestaurants: (state, action) => {
      action.payload.forEach((restaurantGoogle) => {
        if (
          !state.restaurants.find(
            (restaurant) => restaurant.id === restaurantGoogle.place_id
          )
        ) {
          state.restaurants.push({
            id: restaurantGoogle.place_id,
            restaurantName: restaurantGoogle.name,
            address: restaurantGoogle.vicinity,
            lat: restaurantGoogle.lat,
            long: restaurantGoogle.long,
            averageRating: restaurantGoogle.rating,
            nbUserRating: restaurantGoogle.user_ratings_total,
            isLoadingReview: false,
            ratings: [],
          });
        }
      });
    },
    addGoogleReviews: (state, action) => {
      let index = state.restaurants.findIndex(
        (restaurant) => restaurant.id === action.payload.reviews.place_id
      );

      state.restaurants[index].isLoadingReview = true;
      if (action.payload.reviews.ratings !== undefined) {
        action.payload.reviews.ratings.forEach((review) =>
          state.restaurants[index].ratings.push({
            author: review.author_name,
            stars: review.rating,
            comment: review.text,
          })
        );
      }
    },
    setHighlightRestaurantId: (state, action) => {
      state.highlightRestaurantId = action.payload;
    },
    setSelectedRestaurantId: (state, action) => {
      state.selectedRestaurantId = action.payload;
    },
    setRangeFilter: (state, action) => {
      state.rangeFilter = { ...action.payload };
    },
    setFormRatingActive: (state, action) => {
      state.formRatingActive = action.payload;
    },
    setFormRestaurantActive: (state, action) => {
      state.formRestaurantActive = action.payload;
    },
  },
});

export const {
  loadRestaurants,
  addRating,
  addRestaurant,
  addGoogleRestaurants,
  addGoogleReviews,
  setHighlightRestaurantId,
  setSelectedRestaurantId,
  setRangeFilter,
  setFormRatingActive,
  setFormRestaurantActive,
} = slice.actions;

export const loadInitialRestaurants = () => (dispatch) => {
  let newRestaurants = [];
  axios.get(`/restaurants.json`).then((res) => {
    newRestaurants = res.data;
    dispatch(loadRestaurants(newRestaurants));
  });
};

export const selectRestaurants = (state) => state.restaurantsList.restaurants;

export const selectVisibleRestaurants = (state) => {
  const map = selectMap(state);
  let visibleRestaurants = [];
  if (map === null) {
    return visibleRestaurants;
  }
  visibleRestaurants = state.restaurantsList.restaurants.filter((restaurant) =>
    map.getBounds().contains({ lat: restaurant.lat, lng: restaurant.long })
  );
  return visibleRestaurants;
};

export const selectHighlightRestaurantId = (state) =>
  state.restaurantsList.highlightRestaurantId;

export const selectSelectedRestaurantId = (state) =>
  state.restaurantsList.selectedRestaurantId;

export const selectSelectedRestaurantName = (state) =>
  state.restaurantsList.restaurants.find(
    (restaurant) => restaurant.id === state.restaurantsList.selectedRestaurantId
  ).restaurantName;

export const selectRangeFilter = (state) => state.restaurantsList.rangeFilter;

export const selectFilterRestaurants = (state) => {
  let visibleRestaurants = selectVisibleRestaurants(state);
  let range = selectRangeFilter(state);
  return visibleRestaurants.filter(
    (restaurant) =>
      (restaurant.averageRating >= range.min &&
        restaurant.averageRating <= range.max) ||
      restaurant.averageRating === undefined
  );
};

export const selectFormRatingActive = (state) =>
  state.restaurantsList.formRatingActive;

export const selectFormRestaurantActive = (state) =>
  state.restaurantsList.formRestaurantActive;

export const getAverage = (ratings) => {
  if (!ratings.length) {
    return undefined;
  }
  return (
    ratings.reduce((sum, rating) => sum + rating.stars, 0) / ratings.length
  );
};

export default slice.reducer;
