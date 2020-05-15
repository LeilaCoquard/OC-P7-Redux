import React from "react";
import { connect, useStore } from "react-redux";
import { bindActionCreators } from "redux";
import { Marker } from "google-maps-react";
import {
  setHighlightRestaurantId,
  setSelectedRestaurantId,
  selectSelectedRestaurantId,
} from "../redux/restaurantListSlice";

export function MarkerRestaurant({
  restaurant,
  isHighlightedRestaurant,
  isSelectedRestaurant,
  setHighlightRestaurantId,
  setSelectedRestaurantId,
  ...restProps
}) {
  const store = useStore();

  const scroll = (id, oldId) => {
    const oldHeightOldId = oldId
      ? document.getElementById(oldId).offsetHeight
      : 0;
    const heightId = oldId ? document.getElementById(id).offsetHeight : 0;
    const topOldId = oldId ? document.getElementById(oldId).offsetTop : 0;
    const topId = document.getElementById(id).offsetTop;
    const topParent = document.getElementById("App-resto").offsetTop;

    document
      .getElementById("App-resto")
      .scrollTo(
        0,
        topId -
          topParent -
          (topOldId < topId ? oldHeightOldId - heightId : 0) -
          5
      );
  };

  return (
    <Marker
      {...restProps}
      name={restaurant.restaurantName}
      title={restaurant.restaurantName}
      position={{ lat: restaurant.lat, lng: restaurant.long }}
      icon={
        isHighlightedRestaurant || isSelectedRestaurant
          ? { url: "restaurantBig.png" }
          : { url: "restaurant.png" }
      }
      onMouseover={() => {
        setHighlightRestaurantId(restaurant.id);
      }}
      onMouseout={() => {
        setHighlightRestaurantId(null);
      }}
      onClick={() => {
        if (isSelectedRestaurant) {
          setSelectedRestaurantId(null);
          setHighlightRestaurantId(null);
        } else {
          const selectedRestaurantId = selectSelectedRestaurantId(
            store.getState()
          );
          setSelectedRestaurantId(restaurant.id);
          scroll(restaurant.id, selectedRestaurantId);
        }
      }}
    />
  );
}

const mapStateToProps = (state, props) => {
  return {
    isHighlightedRestaurant:
      state.restaurantsList.highlightRestaurantId === props.restaurant.id,
    isSelectedRestaurant:
      state.restaurantsList.selectedRestaurantId === props.restaurant.id,
    ...props,
  };
};

const mapDispatchToProps = (dispatch) => {
  const boundActions = bindActionCreators(
    { setHighlightRestaurantId, setSelectedRestaurantId },
    dispatch
  );
  return boundActions;
};

export default connect(mapStateToProps, mapDispatchToProps)(MarkerRestaurant);
