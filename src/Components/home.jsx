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
  const searchArtists = (query) => {
    setArtistsLoading(true);
    if (query === "") {
      setArtists([]);
      setArtistsLoading(false);
      return;
    }
    Requests.ArtistSearch(ctx.access_token, query).then((response) => {
      setArtistsLoading(false);
      if (response.artists === undefined) return;
      setArtists(response.artists.items);
    });
  };
  const getAlbums = () => {
    setCurrentArtistLoading(true);
    Requests.ArtistAlbums(ctx.access_token, currentArtist.id).then(
      (response) => {
        setCurrentArtistLoading(false);
        setAlbums(response.items);
        console.log(albums);
      }
    );
  };
  useEffect(() => {
    if (currentArtist === null) return;
    getAlbums();
  }, [currentArtist]);
  return (
    <div className="h-100">
      <div className="container-fluid">
        <div
          className={`row main-container overflow-hidden position-fixed w-100 ${
            sidebarHidden && "justify-content-start"
          }`}
        >
          <div
            className={`equal-height-col col-lg-4 bg-black h-100 sidebar position-relative ${
              sidebarHidden && "sidebar-hidden"
            }`}
          >
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
                  searchArtists(e.target.value);
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
            className={`equal-height-col col-lg-8 bg-light-grey h-100 position-relative position-lg-absolute current-albums h-fill-available mh-100 overflow-auto  right-0 ${
              sidebarHidden &&
              "albums-fullscreen position-absolute w-100 top-0 right-0"
            }`}
          >
            <div
              className="position-fixed sidebar-toggle d-none d-lg-flex"
              onClick={() => {
                setSidebarHidden(!sidebarHidden);
              }}
            >
              <i
                className={`fa fs-5 ${
                  sidebarHidden ? "fa-arrow-right" : "fa-arrow-left"
                }`}
              ></i>
            </div>
            {currentArtistLoading ? (
              <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
                <Loader />
              </div>
            ) : currentArtist === null ? (
              <div></div>
            ) : (
              <div className="section-padding px-2">
                <div className="row justify-content-center">
                  {albums.map((album, i) => (
                    <AlbumGrid album={album} key={`albums_${i}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
