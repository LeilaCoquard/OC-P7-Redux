import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "googleMap",
  initialState: {
    mapReady: false,
    bounds: {},
  },
  reducers: {
    setMapReady: (state, action) => {
      state.mapReady = action.payload;
    },
    setBounds: (state, action) => {
      state.bounds = action.payload;
    },
  },
});

export const { setMapReady } = slice.actions;
export const { setBounds } = slice.actions;

export const selectMap = (state) =>
  state.googleMap.mapReady ? window.map : null;

export const selectGoogle = (state) =>
  state.googleMap.mapReady ? window.google : null;

export const selectBounds = (state) => state.googleMap.bounds;

export default slice.reducer;
