import React, { useState, useEffect } from "react";

export default function ErrorPrompt(props) {
  return (
    <div className="w-100 h-100 align-items-center d-flex justify-content-center">
      <div
        className={`error-prompt position-relative   ${
          props.light ? "light" : "dark"
        }`}
      >
        <div className="position-absolute p-1 w-100 h-100 top-0 d-flex justify-content-center align-items-center flex-column">
          <h4 className="text-center fs-1 text-bold text-uppercase">Error</h4>
          <div className="text-center fs-3 error-code">{props.data.status}</div>
          <div className="text-center error-message">{props.data.message}</div>
        </div>
      </div>
    </div>
  );
}
