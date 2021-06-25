import React, { useEffect, useState } from "react";
import { globalStateContext, dispatchStateContext } from "../Context";
import { CONFIG } from "./../config";
import Requests from "../requests";
import Loader from "./Loader";
import ArtistGrid from "./artists/grid";
import AlbumGrid from "./albums/grid";
import ExpireComponent from "./expire_component";
export default function Home(props) {
  const [ctx, setctx] = [
    React.useContext(globalStateContext),
    React.useContext(dispatchStateContext),
  ];

  const [expired, setExpired] = useState(false);
  const [timeOut, setTimeOut] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState([]);
  const [artistsLoading, setArtistsLoading] = useState(false);
  const [currentArtist, setCurrentArtist] = useState(null);
  const [currentArtistLoading, setCurrentArtistLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [nextArtists, setNextArtists] = useState(null);
  const [nextAlbums, setNextAlbums] = useState(null);
  const [search, setSearch] = useState(false);

  const logout = () => {
    window.location.href = CONFIG.APP_URL;
    localStorage.removeItem("auth");
    setctx({});
  };

  const searchArtists = () => {
    if (searchQuery === "" || !search) {
      return;
    }
    setArtistsLoading(true);
    Requests.ArtistSearch(ctx.access_token, searchQuery).then((response) => {
      setArtistsLoading(false);
      if (!response || !response.artists) return;
      setNextArtists(response.artists.next);
      setArtists(response.artists?.items);
    });
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

  useEffect(() => {
    setSearch(false);
    setTimeout(() => {
      setSearch(true);
      searchArtists();
    }, 1000);
  }, [searchQuery]);
  const getAlbums = () => {
    setCurrentArtistLoading(true);
    Requests.ArtistAlbums(ctx.access_token, currentArtist.id).then(
      (response) => {
        setCurrentArtistLoading(false);
        if (!response || !response.items) return;
        setNextAlbums(response.next);
        setAlbums(response.items);
      }
    );
  };
  const scrollTo = (id) => {
    document.querySelector(".main-container").scrollTo({
      top:
        document.getElementById(id).getBoundingClientRect().y +
        window.pageYOffset,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    if (currentArtist === null) return;
    getAlbums();
  }, [currentArtist]);

  const getNextArtists = () => {
    Requests.NextPage(ctx.access_token, nextArtists).then((response) => {
      setNextArtists(response.artists.next);
      let tmp = artists.concat(response.artists.items);
      setArtists(tmp);
    });
  };

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
          <div
            id="artists"
            className={`equal-height-col col-lg-4 bg-black h-100 sidebar position-relative`}
          >
            <button
              onClick={() => {
                scrollTo("albums");
              }}
              className="d-block btn-default  border-0 d-lg-none goto-section albums bg-light text-dark"
            >
              Albums <div className="fa fa-arrow-down"></div>
            </button>
            <div className="search-wrapper position-relative">
              <input
                spellCheck={false}
                type="text"
                className="text-field search bg-transparent text-medium br-20"
                placeholder="Search for an artist..."
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
              <div className="position-absolute search-icon">
                <div className="fa fa-search text-light fs-2"></div>
              </div>
            </div>
            <hr className="text-light" />
            <div className="search-results h-fill-available mh-100 overflow-auto position-relative">
              {artistsLoading ? (
                <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
                  <Loader white={true} />
                </div>
              ) : artists.length === 0 && searchQuery.length > 0 ? (
                <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center no-results">
                  <div className="position-absolute music-icon">
                    <i className="fa fa-user-times text-light"></i>
                  </div>
                  <div className="d-flex w-100 justify-content-lg-center text-light align-items-center">
                    <h3 className="text-light text-center fs-1 w-100">
                      No <br></br> Results
                    </h3>
                  </div>
                </div>
              ) : artists.length > 0 ? (
                <div>
                  <div className="w-100 text-center py-1 text-medium text-light">
                    Displaying {artists.length} results
                  </div>
                  {artists.map((artist, i) => (
                    <ArtistGrid
                      key={`artists_${i}`}
                      artist={artist}
                      active={
                        currentArtist !== null
                          ? currentArtist.id === artist.id
                          : false
                      }
                      setActive={setCurrentArtist}
                    />
                  ))}
                  {nextArtists !== null ? (
                    <button
                      className="loadmore-artists btn-aspect text-uppercase"
                      onClick={() => {
                        getNextArtists();
                      }}
                    >
                      Load more
                    </button>
                  ) : (
                    <h4 className="text-light">No more artists found</h4>
                  )}
                </div>
              ) : (
                <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center artists-here">
                  <div className="position-absolute music-icon">
                    <i className="fa fa-music text-light"></i>
                  </div>
                  <div className="d-flex w-100 justify-content-lg-center text-light align-items-center">
                    <h3 className="text-light text-center fs-1 w-100">
                      Artists <br></br> Here
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            id="albums"
            className={`equal-height-col col-lg-8 bg-light-grey  position-relative position-lg-absolute current-albums  mh-100  overflow-auto right-0 `}
          >
            <button
              onClick={() => {
                scrollTo("artists");
              }}
              className="d-block btn-default  border-0 d-lg-none goto-section artists bg-black text-light"
            >
              Artists <div className="fa fa-arrow-up"></div>
            </button>
            {currentArtistLoading ? (
              <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
                <Loader />
              </div>
            ) : currentArtist === null ? (
              <div></div>
            ) : (
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
                      <h4 className="text-dark">No More Albums found</h4>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ExpireComponent expired={expired} callBack={logout} />
    </div>
  );
}
