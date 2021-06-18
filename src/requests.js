import { CONFIG } from "./config";
export default class Requests {
  static Authenticate() {
    fetch(` "https://accounts.spotify.com/authorize" +
            "?response_type=code" +
            "&client_id=" +
            ${CONFIG.DEV_AUTH.CLIENT_ID}`).then((response) => {});
  }
  static AuthenticateUser() {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${CONFIG.DEV_AUTH.CLIENT_ID}&redirect_uri=http://localhost:3001&response_type=token`;
  }
  static async ArtistSearch(token, query) {
    const response = fetch(
      `${CONFIG.API_ENDPOINTS.SEARCH}?type=artist&q=${query}&token=${token}&`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  }
  static async ArtistAlbums(token, artistID) {
    const response = fetch(
      `${CONFIG.API_ENDPOINTS.ARTISTS}/${artistID}/albums`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
    return response;
  }
}
