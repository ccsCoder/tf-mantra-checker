document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("start-chanting");
  button.addEventListener("click", () => {
    button.classList.add("invisible");

    const imgClassList = document.querySelector(".listening").classList;
    imgClassList.remove("invisible");
    imgClassList.add("visible");
  });
});
