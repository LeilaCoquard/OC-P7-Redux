import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { Restaurant } from "./Restaurant";
import {
  slice,
  selectRangeFilter,
  selectFilterRestaurants,
  selectFormRatingActive,
} from "../redux/restaurantListSlice";
import InputRange from "react-input-range";
import "./InputRange.css";
import ModalPortal from "../ModalPortal";
import { FormAddRating } from "../components/FormAddRating";

const useBoundActions = (actions) => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};

export function RestaurantsList() {
  const rangeFilter = useSelector(selectRangeFilter);
  const filteredRestaurants = useSelector(selectFilterRestaurants);
  const { setRangeFilter } = useBoundActions(slice.actions);
  const formRatingActive = useSelector(selectFormRatingActive);

  return (
    <>
      <div className="div-filter">
        <i className="fas fa-filter fa-lg"></i>
        <InputRange
          maxValue={5}
          minValue={0}
          value={rangeFilter}
          formatLabel={(value) => `${value} étoile(s)`}
          onChange={(range) => {
            setRangeFilter(range);
          }}
        />
      </div>
      {filteredRestaurants !== []
        ? filteredRestaurants.map((restaurant, i) => (
            <Restaurant key={restaurant.id} restaurant={restaurant} />
          ))
        : null}
      {formRatingActive ? (
        <ModalPortal>
          <FormAddRating />
        </ModalPortal>
      ) : null}
    </>
  );
}
