import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { selectMap } from "../map/mapSlice";

export const slice = createSlice({
  name: "restaurantsList",
  initialState: {
    restaurants: [],
    highlightRestaurant: null,
    selectedRestaurant: null,
    rangeFilter: { min: 0, max: 5 },
    formRatingActive: false,
    formRestaurantActive: false
  },
  reducers: {
    loadRestaurants: (state, action) => {
      state.restaurants = [...state.restaurants, ...action.payload];
    },
    addRating: (state, action) => {
      let restaurant = state.restaurants.find(
        e => e.restaurantName === action.payload.restaurantName
      );
      restaurant.ratings.push({
        stars: action.payload.stars,
        author: action.payload.author,
        comment: action.payload.comment
      });
    },
    addRestaurant: (state, action) => {
      let restaurant = { ...action.payload, ratings: [] };
      state.restaurants.push(restaurant);
    },
    setHighlightRestaurant: (state, action) => {
      state.highlightRestaurant = action.payload;
    },
    setSelectedRestaurant: (state, action) => {
      state.selectedRestaurant = action.payload;
    },
    setRangeFilter: (state, action) => {
      state.rangeFilter = { ...action.payload };
    },
    setFormRatingActive: (state, action) => {
      state.formRatingActive = action.payload;
    },
    setFormRestaurantActive: (state, action) => {
      state.formRestaurantActive = action.payload;
    }
  }
});

export const {
  loadRestaurants,
  addRating,
  addRestaurant,
  setHighlightRestaurant,
  setSelectedRestaurant,
  setRangeFilter,
  setFormRatingActive,
  setFormRestaurantActive
} = slice.actions;

export const loadInitialRestaurants = () => dispatch => {
  let newRestaurants = [];
  axios.get(`/restaurants.json`).then(res => {
    newRestaurants = res.data;
    dispatch(loadRestaurants(newRestaurants));
  });
};

export const selectRestaurants = state => state.restaurantsList.restaurants;

export const selectVisibleRestaurants = state => {
  const map = selectMap(state);
  let visibleRestaurants = [];
  if (map === null) {
    return visibleRestaurants;
  }
  visibleRestaurants = state.restaurantsList.restaurants.filter(restaurant =>
    map.getBounds().contains({ lat: restaurant.lat, lng: restaurant.long })
  );
  return visibleRestaurants;
};

export const selectHighlightRestaurant = state =>
  state.restaurantsList.highlightRestaurant;

export const selectSelectedRestaurant = state =>
  state.restaurantsList.selectedRestaurant;

export const selectRangeFilter = state => state.restaurantsList.rangeFilter;

export const selectFilterRestaurants = state => {
  let visibleRestaurants = selectVisibleRestaurants(state);
  let range = selectRangeFilter(state);
  return visibleRestaurants.filter(
    restaurant =>
      (getAverage(restaurant.ratings) >= range.min &&
        getAverage(restaurant.ratings) <= range.max) ||
      restaurant.ratings.length === 0
  );
};

export const selectFormRatingActive = state =>
  state.restaurantsList.formRatingActive;

export const selectFormRestaurantActive = state =>
  state.restaurantsList.formRestaurantActive;

export const getAverage = ratings => {
  if (!ratings.length) {
    return undefined;
  }
  return (
    ratings.reduce((sum, rating) => sum + rating.stars, 0) / ratings.length
  );
};

export default slice.reducer;
