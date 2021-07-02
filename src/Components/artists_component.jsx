import React, { useState, useEffect, useContext } from "react";
import { globalStateContext, dispatchStateContext } from "../Context";
import Requests from "../requests";
import Loader from "./Loader";
import ArtistGrid from "./artists/grid";
import { scrollTo } from "../lib";
import ErrorPrompt from "./error";
export default function ArtistsComponents(props) {
  const [ctx, setctx] = [
    React.useContext(globalStateContext),
    React.useContext(dispatchStateContext),
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState([]);
  const [artistsLoading, setArtistsLoading] = useState(false);
  const [currentArtist, setCurrentArtist] = useState(null);
  const [nextArtists, setNextArtists] = useState(null);
  const [search, setSearch] = useState(false);
  const [error, setError] = useState(null);
  const getNextArtists = () => {
    Requests.NextPage(ctx.access_token, nextArtists).then((response) => {
      setNextArtists(response.artists.next);
      let tmp = artists.concat(response.artists.items);
      setArtists(tmp);
    });
  };

  useEffect(() => {
    // let data = localStorage.getItem("artists");
    // if (data) {
    //   setArtists(JSON.parse(data).artists);
    //   setNextArtists(JSON.parse(data).next);
    //   localStorage.removeItem("artists");
    // }
  }, []);

  useEffect(() => {
    setSearch(false);
    setTimeout(() => {
      setSearch(true);
      searchArtists();
    }, 1000);
  }, [searchQuery]);

  const searchArtists = () => {
    if (searchQuery === "" || !search) {
      return;
    }
    setArtistsLoading(true);
    Requests.ArtistSearch(ctx.access_token, searchQuery).then((response) => {
      setArtistsLoading(false);
      if (response.error !== undefined) {
        setArtists([]);
        setctx({ ...ctx, currentArtist: null });
        setError(response.error);
        return;
      }
      if (!response || !response.artists) return;

      setNextArtists(response.artists.next);
      setArtists(response.artists?.items);
      localStorage.setItem(
        "artists",
        JSON.stringify({
          artists: response.artists?.items,
          next: response.artists?.next,
        })
      );
    });
  };

  return (
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
        ) : error !== null ? (
          <ErrorPrompt data={error} light={true} />
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
              <h4 className="text-light text-center">No more artists found</h4>
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
  );
}
