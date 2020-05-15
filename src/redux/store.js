import { configureStore } from "@reduxjs/toolkit";
import restaurantsReducer from "./restaurantListSlice";
import googleMapReducer from "./mapSlice";

export default configureStore({
  reducer: {
    restaurantsList: restaurantsReducer,
    googleMap: googleMapReducer,
  },
});
