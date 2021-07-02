import React from "react";
import Requests from "../requests";

export default function Login(props) {
  return (
    <div className="section-padding login-view">
      <div className="overlay"></div>
      <img
        src={`${process.env.PUBLIC_URL}/assets/wallpaper.jpg`}
        alt=""
        className="bg-image"
      />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 col-12">
            <div className="login-form bg-light-grey pt-2 pb-5 px-3">
              <label className="label text-dark mb-3 pt-3 d-block fs-3 text-medium text-center">
                Login
              </label>
              <input type="email" placeholder="Email" className="text-field" />
              <input
                type="password"
                placeholder="Password"
                className="text-field"
              />
              <button className="btn-aspect btn-1 mb-2">Login</button>
              <hr />
              <button
                className="btn-aspect btn-2 mt-2 position-relative"
                onClick={() => {
                  Requests.AuthenticateUser();
                }}
              >
                <div className="d-flex justify-content-around align-items-center">
                  Login with Spotify
                  <i className="fa fa-spotify text-green fs-2"></i>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
