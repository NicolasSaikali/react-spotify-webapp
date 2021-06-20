import React, { useEffect } from "react";
import StarRatings from "react-star-ratings";
function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
}

export default function ArtistGrid(props) {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    setData(props.artist);
  });
  if (data !== null)
    return (
      <div
        className={`artist-grid mb-3 ${props.active && "active"}`}
        onClick={() => {
          props.setActive(props.artist);
        }}
      >
        <div className="d-flex justify-content-start px-2 align-items-center">
          <div className="artist-image">
            {props.artist.images !== undefined && (
              <img
                src={
                  props.artist.images.length > 1
                    ? props.artist.images[0].url
                    : props.artist.images.url
                }
                alt=""
              />
            )}
          </div>
          <div className="artist-info">
            <div className="d-flex flex-column justify-content-between">
              <div className="artist-name">{props.artist.name}</div>
              <div className="artist-followers">
                {kFormatter(props.artist.followers.total)} Followers
              </div>
            </div>
            <div className="artist-rating">
              <StarRatings
                rating={props.artist.popularity / 20}
                starRatedColor="gold"
                starDimension="25px"
                startSpacing="0"
                numberOfStars={5}
                name="rating"
              />
            </div>
          </div>
        </div>
      </div>
    );
  else return <div className="w-100 py-5"></div>;
}
