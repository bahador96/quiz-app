const buttons = document.querySelectorAll("button");

const selectHandler = () => {
  const level = event.target.innerText.toLowerCase();
  localStorage.setItem("level", level);
  window.location.assign("/");
};

buttons.forEach((button) => {
  button.addEventListener("click", selectHandler);
});
