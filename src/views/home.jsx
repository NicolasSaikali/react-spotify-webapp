import React, { useEffect, useState } from "react";
import { globalStateContext, dispatchStateContext } from "../Context";
import { CONFIG } from "./../config";
import Requests from "../requests";
import Loader from "./../Components/Loader";
import ArtistsComponents from "../Components/artists_component";
import ArtistGrid from "./../Components/artists/grid";
import AlbumGrid from "./../Components/albums/grid";
import AlbumsComponent from "../Components/albums_component";
import ExpireComponent from "./../Components/expire_component";
export default function Home(props) {
  const [ctx, setctx] = [
    React.useContext(globalStateContext),
    React.useContext(dispatchStateContext),
  ];

  const [expired, setExpired] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [nextAlbums, setNextAlbums] = useState(null);
  const logout = () => {
    window.location.href = CONFIG.APP_URL;
    localStorage.removeItem("auth");
    setctx({});
  };
  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("auth"));
    let deltaTime = JSON.parse(localStorage.getItem("auth")).expires_in;
    let previousDate = data.previous_date;
    previousDate = Math.round(new Date().getTime() / 1000);

    if (previousDate > deltaTime) {
      setExpired(true);
    }

    data["previous_date"] = previousDate;
    localStorage.setItem("auth", JSON.stringify(data));
  });

  const getNextAlbums = () => {
    Requests.NextPage(ctx.access_token, nextAlbums).then((response) => {
      setNextAlbums(response.next);
      let tmp = albums.concat(response.items);
      setAlbums(tmp);
    });
  };

  return (
    <div className="h-100">
      <div className="container-fluid">
        <div
          className={`row main-container overflow-scroll overflow-lg-hidden position-fixed w-100 `}
        >
          <ArtistsComponents />
          <AlbumsComponent />
        </div>
      </div>
      <ExpireComponent expired={expired} callBack={logout} />
    </div>
  );
}
