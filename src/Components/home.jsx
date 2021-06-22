import React, { useEffect, useState } from "react";
import { globalStateContext, dispatchStateContext } from "../Context";
import Requests from "../requests";
import Loader from "./Loader";
import ArtistGrid from "./artists/grid";
import AlbumGrid from "./albums/gris";
export default function Home(props) {
  const [ctx, setctx] = [
    React.useContext(globalStateContext),
    React.useContext(dispatchStateContext),
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState([]);
  const [artistsLoading, setArtistsLoading] = useState(false);
  const [currentArtist, setCurrentArtist] = useState(null);
  const [currentArtistLoading, setCurrentArtistLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [search, setSearch] = useState(false);
  const searchArtists = () => {
    if (searchQuery === "" || !search) {
      return;
    }
    setArtistsLoading(true);
    Requests.ArtistSearch(ctx.access_token, searchQuery).then((response) => {
      setArtistsLoading(false);
      if (!response || !response.artists) return;
      console.log("RESPNSE");
      setArtists(response.artists?.items);
    });
  };
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
        console.log("RESPONSE!");
        setCurrentArtistLoading(false);
        if (!response || !response.items) return;
        setAlbums(response.items);
        console.log(albums);
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
                autoCapitalize={false}
                autoCorrect={false}
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
            className={`equal-height-col col-lg-8 bg-light-grey h-100 position-relative position-lg-absolute current-albums h-fill-available mh-100 overflow-auto right-0 `}
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
                    albums.map((album, i) => (
                      <AlbumGrid album={album} key={`albums_${i}`} />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
