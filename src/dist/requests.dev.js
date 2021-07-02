"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _config = require("./config");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Requests =
/*#__PURE__*/
function () {
  function Requests() {
    _classCallCheck(this, Requests);
  }

  _createClass(Requests, null, [{
    key: "Authenticate",
    value: function Authenticate() {
      fetch(" \"https://accounts.spotify.com/authorize\" +\n            \"?response_type=code\" +\n            \"&client_id=\" +\n            ".concat(_config.CONFIG.DEV_AUTH.CLIENT_ID)).then(function (response) {});
    }
  }, {
    key: "AuthenticateUser",
    value: function AuthenticateUser() {
      localStorage.removeItem("auth");
      window.location.href = "https://accounts.spotify.com/authorize?client_id=".concat(_config.CONFIG.DEV_AUTH.CLIENT_ID, "&redirect_uri=").concat(_config.CONFIG.APP_URL, "&response_type=token");
    }
  }, {
    key: "ArtistSearch",
    value: function ArtistSearch(token, query) {
      var response;
      return regeneratorRuntime.async(function ArtistSearch$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              response = fetch("".concat(_config.CONFIG.API_ENDPOINTS.SEARCH, "?type=artist&q=").concat(query), {
                headers: {
                  "Content-Type": "application/json" // Authorization: `Bearer ${token}`,

                }
              }).then(function (response) {
                return response.json();
              }).then(function (data) {
                return data;
              })["catch"](function (error) {
                console.log(error);
              });
              return _context.abrupt("return", response);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "NextPage",
    value: function NextPage(token, url) {
      var response;
      return regeneratorRuntime.async(function NextPage$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              response = fetch(url, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer ".concat(token)
                }
              }).then(function (response) {
                return response.json();
              }).then(function (data) {
                return data;
              })["catch"](function (error) {
                console.log(error);
              });
              return _context2.abrupt("return", response);

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "ArtistAlbums",
    value: function ArtistAlbums(token, artistID) {
      var response;
      return regeneratorRuntime.async(function ArtistAlbums$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              response = fetch("".concat(_config.CONFIG.API_ENDPOINTS.ARTISTS, "/").concat(artistID, "/albums"), {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer ".concat(token)
                }
              }).then(function (response) {
                return response.json();
              }).then(function (data) {
                return data;
              })["catch"](function (error) {
                console.log(error);
              });
              return _context3.abrupt("return", response);

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }]);

  return Requests;
}();

exports["default"] = Requests;