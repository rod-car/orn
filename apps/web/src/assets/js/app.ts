/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use strict";

/* ===== Enable Bootstrap Popover (on element  ====== */
const popoverTriggerList = document.querySelectorAll(
  '[data-bs-toggle="popover"]'
);
/*const popoverList = [...popoverTriggerList].map(
  (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
);*/

/* ==== Enable Bootstrap Alert ====== */
//var alertList = document.querySelectorAll('.alert')
//alertList.forEach(function (alert) {
//  new bootstrap.Alert(alert)
//});

document.addEventListener("DOMContentLoaded", () => {
  // const alertList = document.querySelectorAll(".alert");
  // const alerts = [...alertList].map((element) => new bootstrap.Alert(element));

  const sidePanelToggler = document.getElementById("sidepanel-toggler");
  const sidePanel = document.getElementById("app-sidepanel");
  const sidePanelDrop = document.getElementById("sidepanel-drop");
  const sidePanelClose = document.getElementById("sidepanel-close");

  window.addEventListener("load", function () {
    responsiveSidePanel();
  });

  window.addEventListener("resize", function () {
    responsiveSidePanel();
  });

  function responsiveSidePanel() {
    const w = window.innerWidth;
    if (w >= 1200) {
      sidePanel?.classList.remove("sidepanel-hidden");
      sidePanel?.classList.add("sidepanel-visible");
    } else {
      sidePanel?.classList.remove("sidepanel-visible");
      sidePanel?.classList.add("sidepanel-hidden");
    }
  }

  sidePanelToggler?.addEventListener("click", () => {
    if (sidePanel?.classList.contains("sidepanel-visible")) {
      console.log("visible");
      sidePanel?.classList.remove("sidepanel-visible");
      sidePanel?.classList.add("sidepanel-hidden");
    } else {
      console.log("hidden");
      sidePanel?.classList.remove("sidepanel-hidden");
      sidePanel?.classList.add("sidepanel-visible");
    }
  });

  sidePanelClose?.addEventListener("click", (e) => {
    e.preventDefault();
    sidePanelToggler?.click();
  });

  sidePanelDrop?.addEventListener("click", (e) => {
    sidePanelToggler?.click();
  });

  /* ====== Mobile search ======= */
  const searchMobileTrigger = document.querySelector(".search-mobile-trigger");
  const searchBox = document.querySelector(".app-search-box");

  searchMobileTrigger?.addEventListener("click", () => {
    searchBox?.classList.toggle("is-visible");

    const searchMobileTriggerIcon = document.querySelector(
      ".search-mobile-trigger-icon"
    );

    if (searchMobileTriggerIcon?.classList.contains("fa-magnifying-glass")) {
      searchMobileTriggerIcon?.classList.remove("fa-magnifying-glass");
      searchMobileTriggerIcon?.classList.add("fa-xmark");
    } else {
      searchMobileTriggerIcon?.classList.remove("fa-xmark");
      searchMobileTriggerIcon?.classList.add("fa-magnifying-glass");
    }
  });
});
