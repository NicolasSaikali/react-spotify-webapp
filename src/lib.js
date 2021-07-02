export const scrollTo = (id) => {
  document.querySelector(".main-container").scrollTo({
    top:
      document.getElementById(id).getBoundingClientRect().y +
      window.pageYOffset,
    behavior: "smooth",
  });
};
