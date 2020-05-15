import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Header } from "./Header";
import MapContainer from "./container/MapContainer";
import { RestaurantsList } from "./container/RestaurantsList";
import { loadInitialRestaurants } from "./redux/restaurantListSlice";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadInitialRestaurants());
  }, [dispatch]);

  return (
    <div className="App">
      <div className="App-header">
        <Header />
      </div>
      <div className="App-map">
        <MapContainer />
      </div>
      <div className="App-resto" id="App-resto">
        <RestaurantsList />
      </div>
    </div>
  );
}

export default App;
