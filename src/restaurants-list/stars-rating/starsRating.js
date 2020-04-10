import React from "react";
import { getAverage } from "../restaurantListSlice";
import { transformArray } from "../../utils";

export function StarsRating({ ratings, googleRating }) {
  const average =
    ((googleRating ? googleRating : getAverage(ratings)) * 2).toFixed(0) / 2;
  const halfstar = average !== Math.round(getAverage(ratings));
  const starsFullArray = transformArray(Math.trunc(average));

  const nbStarsEmpty = 5 - Math.trunc(average) - halfstar;
  const starsEmptyArray = transformArray(nbStarsEmpty);

  return (
    <div>
      {starsFullArray.map(s => (
        <i key={s} className="fas fa-star"></i>
      ))}
      {halfstar ? <i className="fas fa-star-half-alt"></i> : null}
      {starsEmptyArray.map(s => (
        <i key={s} className="far fa-star"></i>
      ))}
    </div>
  );
}
