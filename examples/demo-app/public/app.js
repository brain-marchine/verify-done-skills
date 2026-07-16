const btn = document.getElementById("equip");
const status = document.getElementById("status");

btn?.addEventListener("click", () => {
  status.textContent = "Equipped (demo)";
});
