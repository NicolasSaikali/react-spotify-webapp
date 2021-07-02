"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scrollTo = void 0;

var scrollTo = function scrollTo(id) {
  document.querySelector(".main-container").scrollTo({
    top: document.getElementById(id).getBoundingClientRect().y + window.pageYOffset,
    behavior: "smooth"
  });
};

exports.scrollTo = scrollTo;