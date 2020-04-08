import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Header } from "./Header";
import MapContainer from "./map/Map";
import { RestaurantsList } from "./restaurants-list/RestaurantsList";
import { loadInitialRestaurants } from "./restaurants-list/restaurantListSlice";
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
      <div className="App-resto">
        <RestaurantsList />
      </div>
    </div>
  );
}

export default App;
