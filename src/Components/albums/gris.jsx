import React from "react";
import StarRatings from "react-star-ratings";

export default function AlbumGrid(props) {
  return (
    <div className="col-xl-3 col-md-4 col-sm-6">
      <div className="album-grid position-relative">
        <a
          href={props.album.external_urls.spotify}
          className="album-link d-flex justify-content-center align-items-center"
        >
          <h2 className="text-light px-2 text-center">Go to Album</h2>
        </a>
        <div className="album-year d-flex justify-content-center align-items-center">
          {props.album.release_date.split("-")[0]}
        </div>
        <div className="album-image">
          <img
            loading="lazy"
            src={
              props.album.images.length > 1
                ? props.album.images[0].url
                : props.album.images.url
            }
            className="img-fluid"
            alt=""
          />
        </div>
        <div className="album-info pt-2">
          <div className="album-name">{props.album.name}</div>
          <div className="album-artists">
            Artists :
            <div className="d-inline-block">
              {props.album.artists.map((artist, i) => (
                <div className="text-secondary d-inline-block">
                  {artist.name} &nbsp;
                </div>
              ))}
            </div>
          </div>
          <div className="album-track text-secondary fs-10">
            {props.album.total_tracks} Tracks
          </div>
        </div>
      </div>
    </div>
  );
}
