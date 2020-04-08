import React from "react";
import "./Header.css";

export class Header extends React.Component {
  render() {
    return (
      <div className="Header">
        <img src="LogoResto.png" className="App-logo" alt="logo" />
        <h3>Site d'avis de restaurants</h3>
      </div>
    );
  }
}
