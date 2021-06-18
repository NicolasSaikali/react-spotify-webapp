import React from "react";

export default function Loader(props) {
  return (
    <div className={`lds-ring ${props.white && "white"}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
