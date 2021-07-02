import React, { useState, useEffect, useContext } from "react";
import { globalStateContext, dispatchStateContext } from "./../Context";
import AlbumGrid from "./albums/grid";
import Requests from "../requests";
import Loader from "./Loader";
import { scrollTo } from "../lib";
import ErrorPrompt from "./error";
export default function AlbumsComponent(props) {
  const [ctx, setctx] = [
    React.useContext(globalStateContext),
    React.useContext(dispatchStateContext),
  ];
  const [albums, setAlbums] = useState([]);
  const [nextAlbums, setNextAlbums] = useState(null);
  const [error, setError] = useState(null);
  const [currentArtistLoading, setCurrentArtistLoading] = useState(
    ctx.currentArtistLoading
  );
  const getNextAlbums = () => {
    Requests.NextPage(ctx.access_token, nextAlbums).then((response) => {
      setNextAlbums(response.next);
      let tmp = albums.concat(response.items);
      setAlbums(tmp);
    });
  };
  useEffect(() => {
    if (ctx.currentArtist === null) return;
    getAlbums();
  }, [ctx.currentArtist]);

  useEffect(() => {
    let albums = document.querySelector("#albums");
    albums.addEventListener("scroll", (e) => {
      let info = document.querySelector(".al-artist-info");
      if (info === null) return;
      if (info.getBoundingClientRect().y <= albums.scrollTop) {
        info.classList.add("active");
      } else {
        info.classList.remove("active");
      }
    });
  }, []);

  const getAlbums = () => {
    let tmp;
    if (ctx.currentArtist === null) return;
    setCurrentArtistLoading(true);
    Requests.ArtistAlbums(ctx.access_token, ctx.currentArtist.id).then(
      (response) => {
        setCurrentArtistLoading(false);
        if (response.error !== undefined) {
          setAlbums([]);
          setctx({ ...ctx, currentArtist: null });
          setError(response.error);
          return;
        }
        if (!response || !response.items) return;
        setNextAlbums(response.next);
        setAlbums(response.items);
        console.log(albums);
      }
    );
  };

  return (
    <div
      id="albums"
      className={`equal-height-col col-lg-8 bg-light-grey  position-relative position-lg-absolute current-albums  mh-100  overflow-auto right-0 `}
    >
      {currentArtistLoading ? (
        <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
          <Loader />
        </div>
      ) : error !== null ? (
        <ErrorPrompt data={error} light={false} />
      ) : ctx.currentArtist === null ? (
        <div></div>
      ) : (
        <React.Fragment>
          <div className="px-2 al-artist-info">
            <div className=" d-flex justify-content-between align-items-center">
              <h1 className="bold text-bold d-inline-block">
                {ctx.currentArtist.name}
              </h1>
              <div className="px-2"></div>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <button className="text-uppercase bold button btn-2 py-1 w-auto btn-aspect d-inline-block ml-2">
                  Follow
                </button>
                <div className="py-1"></div>
                <button
                  onClick={() => {
                    scrollTo("artists");
                  }}
                  className="d-block btn-default goto-section position-relative right-0 border-0 d-lg-none artists bg-black text-light"
                >
                  Artists <div className="fa fa-arrow-up"></div>
                </button>
              </div>
            </div>
          </div>
          <div className="section-padding px-2">
            <div className="row justify-content-center">
              {albums.length === 0 ? (
                <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
                  <div className="text-dark fs-3 text-bold bold text-uppercase oswald">
                    no albums found
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  {albums.map((album, i) => (
                    <AlbumGrid album={album} key={`albums_${i}`} />
                  ))}
                </React.Fragment>
              )}
            </div>
            <div className="row justify-content-center">
              <div className="col-md-4">
                {nextAlbums !== null ? (
                  <button
                    className="btn-aspect text-light w-100 btn-3"
                    onClick={() => {
                      getNextAlbums();
                    }}
                  >
                    <div className="text-uppercase">Load more</div>
                  </button>
                ) : (
                  <h4 className="text-dark text-center w-100">
                    No More Albums Found
                  </h4>
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
