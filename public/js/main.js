document.querySelectorAll(".flash").forEach((flash) => {
  window.setTimeout(() => {
    flash.style.opacity = "0";
    flash.style.transition = "opacity 250ms ease";
  }, 3500);
});

document.querySelectorAll("[data-confirm]").forEach((button) => {
  button.addEventListener("click", (event) => {
    if (!window.confirm(button.dataset.confirm)) {
      event.preventDefault();
    }
  });
});
