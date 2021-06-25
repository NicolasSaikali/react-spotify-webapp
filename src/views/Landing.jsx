import React, { useEffect } from "react";
import { globalStateContext, dispatchStateContext } from "../Context";
import Home from "./../Components/home";
import Login from "../Components/Login";
import Requests from "../requests";
import { CONFIG } from "./../config";
export default function Landing(props) {
  const [ctx, setctx] = [
    React.useContext(globalStateContext),
    React.useContext(dispatchStateContext),
  ];

  useEffect(() => {
    getTokens();
  }, []);

  const logout = () => {
    window.location.href = CONFIG.APP_URL;
    localStorage.removeItem("auth");
    setctx({});
  };

  const getTokens = () => {
    let previousContext = ctx;
    let tokenObject = {};
    let cookieAuth =
      localStorage.getItem("auth") !== null
        ? JSON.parse(localStorage.getItem("auth"))
        : null;
    let parameters = window.location.href.split("#")[1];
    if (
      cookieAuth !== null &&
      cookieAuth.previous_date > cookieAuth.expires_in
    ) {
      console.log(cookieAuth);
      console.log("test");
      return;
    }
    if (cookieAuth !== null) {
      for (let i in cookieAuth) {
        previousContext[i] = cookieAuth[i];
      }
    } else {
      localStorage.removeItem("auth");
      if (parameters === undefined) return;
      if (parameters.length === 1) return; //it was not a redirection from
      //I used this method below to be able to edit context values dynamically
      cookieAuth = {};

      parameters.split("&").forEach((p) => {
        let key = p.split("=")[0],
          value = p.split("=")[1];
        cookieAuth[key] = value;
        previousContext[key] = value;
      });
      cookieAuth["expires_in"] = "10";
      cookieAuth["expires_in"] -= -Math.round(new Date().getTime() / 1000);
      previousContext["expires_in"] = parseInt(cookieAuth["expires_in"]);
    }
    localStorage.setItem("auth", JSON.stringify(cookieAuth));
    setctx(previousContext);
  };

  return (
    <div className="landing-page">
      <div className="header py-3">
        <div className="container-fluid">
          <div className="row nav justify-content-between">
            <div className="col-6">
              <div className="logo">
                <img src={`${process.env.PUBLIC_URL}/assets/logo.png`} alt="" />
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex h-100 align-items-center justify-content-end">
                <div>
                  {ctx.access_token !== undefined ? (
                    <div className="account-settings-wrapper position-relative">
                      <i className="fa fa-user hover-pointer fs-3"></i>
                      <div className="account-settings-popup px-3">
                        <div className="py-2 px-3">
                          <button
                            className="btn-aspect btn-2"
                            onClick={() => {
                              logout();
                            }}
                          >
                            <div className="d-flex justify-content-around align-items-center border-1">
                              Logout
                              <div className="h-100 px-2"></div>
                              <div className="fa fa-sign-out"></div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="box">
          {ctx.access_token !== undefined ? <Home /> : <Login />}
        </div>
      </div>
    </div>
  );
}
