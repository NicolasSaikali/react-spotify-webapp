import React, { useEffect } from "react";
import { globalStateContext, dispatchStateContext } from "../Context";
import Home from "./../Components/home";
import Login from "../Components/Login";
import Requests from "../requests";
export default function Landing(props) {
  const [ctx, setctx] = [
    React.useContext(globalStateContext),
    React.useContext(dispatchStateContext),
  ];
  useEffect(() => {
    getTokens();
    Requests.Authenticate();
  }, []);

  const getTokens = () => {
    let parameters = window.location.href.split("#")[1];
    if (parameters === undefined) return;
    if (parameters.length === 1) return; //it was not a redirection from
    //I used this method below to be able to edit context values dynamically
    let previousContext = ctx;
    parameters.split("&").forEach((p) => {
      let key = p.split("=")[0],
        value = p.split("=")[1];
      previousContext[key] = value;
    });
    setctx(previousContext);
    console.log(ctx);
  };

  return (
    <div className="landing-page">
      <div className="header py-3">
        <div className="container">
          <div className="row justify-content-between">
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
                      <i className="fa fa-user hover-pointer"></i>
                      <div className="account-settings-popup px-3">
                        <div className="py-2 px-3">
                          <button className="btn-aspect btn-2">
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
      <div className="h-fill-available">
        <div className="">
          {ctx.access_token !== undefined ? <Home /> : <Login />}
        </div>
      </div>
    </div>
  );
}
