import React, { useState } from "react";
import {
  setFormRatingActive,
  selectSelectedRestaurantId,
  selectSelectedRestaurantName,
  addRating,
} from "../redux/restaurantListSlice";
import { useSelector, useDispatch } from "react-redux";

export function FormAddRating() {
  const dispatch = useDispatch();
  const selectedRestaurantId = useSelector(selectSelectedRestaurantId);
  const selectedRestaurantName = useSelector(selectSelectedRestaurantName);

  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const closeModal = () => {
    dispatch(setFormRatingActive(false));
  };

  return (
    <>
      <div className="modal is-active">
        <div className="modal-background" onClick={closeModal}></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{selectedRestaurantName}</p>
            <button
              className="delete"
              aria-label="close"
              onClick={closeModal}
            ></button>
          </header>
          <section className="modal-card-body">
            <input
              className="input"
              type="text"
              placeholder="Mon nom"
              style={{ marginBottom: "5px" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <div className="select" style={{ marginBottom: "5px" }}>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
              >
                <option value={""}>Ma note</option>
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <textarea
              className="textarea"
              placeholder="Mon commentaire"
              style={{ marginBottom: "5px" }}
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-white"
              onClick={() => {
                dispatch(
                  addRating({
                    id: selectedRestaurantId,
                    stars: rating,
                    author: name,
                    comment: comment,
                  })
                );
                setName("");
                setRating("");
                setComment("");
                closeModal();
              }}
            >
              Envoyer
            </button>
            <button className="button is-white" onClick={closeModal}>
              Annuler
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}
