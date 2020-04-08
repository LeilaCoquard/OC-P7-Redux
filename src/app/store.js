import { configureStore } from "@reduxjs/toolkit";
import restaurantsReducer from "../restaurants-list/restaurantListSlice";
import googleMapReducer from "../map/mapSlice";

export default configureStore({
  reducer: {
    restaurantsList: restaurantsReducer,
    googleMap: googleMapReducer
  }
});
