"use strict";

const body = document.body;

const menuButton = document.querySelector(".menu-button");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealElements = document.querySelectorAll("[data-reveal]");

function openMenu() {
  if (!menuButton || !navMenu) {
    return;
  }

  navMenu.classList.add("is-open");

  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute("aria-label", "Close navigation");

  body.classList.add("menu-open");
}

function closeMenu() {
  if (!menuButton || !navMenu) {
    return;
  }

  navMenu.classList.remove("is-open");

  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");

  body.classList.remove("menu-open");
}

function toggleMenu() {
  const isOpen =
    menuButton?.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    closeMenu();
    return;
  }

  openMenu();
}

function initializeNavigation() {
  if (!menuButton || !navMenu) {
    return;
  }

  menuButton.addEventListener("click", toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Node)) {
      return;
    }

    const isOpen =
      menuButton.getAttribute("aria-expanded") === "true";

    if (!isOpen) {
      return;
    }

    const clickedMenu = navMenu.contains(target);
    const clickedButton = menuButton.contains(target);

    if (!clickedMenu && !clickedButton) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) {
      closeMenu();
    }
  });
}

function initializeRevealAnimation() {
  if (!revealElements.length) {
    return;
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }

  requestAnimationFrame(() => {
    revealElements.forEach((element) => {
      const delay = Number(element.dataset.delay || 0);

      window.setTimeout(() => {
        element.classList.add("is-visible");
      }, delay);
    });
  });
}

initializeNavigation();
initializeRevealAnimation();