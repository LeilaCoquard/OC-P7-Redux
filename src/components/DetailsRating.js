import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import { transformArray } from "../utils";
import { setFormRatingActive } from "../redux/restaurantListSlice";
import styles from "./DetailsRating.module.css";

export function DetailsRating({ ratings, active }) {
  const dispatch = useDispatch();

  return (
    <>
      <hr className={active ? styles.hrfadein : styles.hrfadeout} />
      <div className={`${styles.details} ${active ? styles.active : ""}`}>
        <button
          className={`button is-light ${styles.btnReview}`}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setFormRatingActive(true));
          }}
        >
          Rédiger un avis
        </button>
        {ratings.map((rating, i) => {
          let starsArray = transformArray(rating.stars);
          let stars = starsArray.map((star) => (
            <i key={star} className="fas fa-star fa-xs"></i>
          ));
          return (
            <Fragment key={i}>
              <div className={styles.stars}>
                {stars} - {rating.author}
              </div>
              <div className={styles.comment}>
                <p>{rating.comment}</p>
              </div>
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
