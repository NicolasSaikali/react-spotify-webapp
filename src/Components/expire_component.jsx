import React, { useState, useEffect } from "react";
import { globalStateContext, dispatchStateContext } from "../Context";

export default function ExpireComponent(props) {
  return (
    <div className={`expired-popup ${props.expired && "shown"} `}>
      <div className="d-block text-light">
        It seems like your session has expired
      </div>
      <div className="d-block mt-2">
        <button
          className="btn-aspect"
          onClick={() => {
            props.callBack();
          }}
        >
          Login again
        </button>
      </div>
    </div>
  );
}
