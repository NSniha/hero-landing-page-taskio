"use strict";

const body = document.body;
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const navMenu = document.querySelector(".nav-menu");

const navLinks = document.querySelectorAll(".nav-menu a");
const revealElements = document.querySelectorAll("[data-reveal]");

const mobileBreakpoint = 900;

let lastFocusedElement = null;

/* ===================================
   Drawer
=================================== */

function isDrawerOpen() {
  return navMenu?.classList.contains("is-open") ?? false;
}

function openDrawer() {
  if (!menuButton || !navMenu || !header) {
    return;
  }

  lastFocusedElement = document.activeElement;

  body.classList.add("menu-open");
  header.classList.add("drawer-active");
  navMenu.classList.add("is-open");

  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute("aria-label", "Close navigation");

  navMenu.setAttribute("aria-hidden", "false");

  const firstFocusableElement =
    navMenu.querySelector("a, button");

  window.setTimeout(() => {
    firstFocusableElement?.focus();
  }, 350);
}

function closeDrawer({
  restoreFocus = true
} = {}) {
  if (!menuButton || !navMenu || !header) {
    return;
  }

  body.classList.remove("menu-open");
  header.classList.remove("drawer-active");
  navMenu.classList.remove("is-open");

  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");

  navMenu.setAttribute("aria-hidden", "true");

  if (
    restoreFocus &&
    lastFocusedElement instanceof HTMLElement
  ) {
    lastFocusedElement.focus();
  }
}

function toggleDrawer() {
  if (isDrawerOpen()) {
    closeDrawer();
    return;
  }

  openDrawer();
}

/* ===================================
   Focus Trap
=================================== */

function trapDrawerFocus(event) {
  if (
    event.key !== "Tab" ||
    !isDrawerOpen() ||
    !navMenu
  ) {
    return;
  }

  const focusableElements = [
    ...navMenu.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ].filter((element) => {
    return element.offsetParent !== null;
  });

  if (!focusableElements.length) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement =
    focusableElements[focusableElements.length - 1];

  if (
    event.shiftKey &&
    document.activeElement === firstElement
  ) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (
    !event.shiftKey &&
    document.activeElement === lastElement
  ) {
    event.preventDefault();
    firstElement.focus();
  }
}

/* ===================================
   Navigation Events
=================================== */

function initializeDrawer() {
  if (!menuButton || !navMenu) {
    return;
  }

  navMenu.setAttribute("aria-hidden", "true");

  menuButton.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
      toggleDrawer();
    }
  );

  navMenu.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
    }
  );

  navLinks.forEach((link) => {
    link.addEventListener(
      "click",
      () => {
        closeDrawer({
          restoreFocus: false
        });
      }
    );
  });

  document.addEventListener(
    "click",
    () => {
      if (isDrawerOpen()) {
        closeDrawer();
      }
    }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        isDrawerOpen()
      ) {
        closeDrawer();
        return;
      }

      trapDrawerFocus(event);
    }
  );

  window.addEventListener(
    "resize",
    () => {
      if (
        window.innerWidth > mobileBreakpoint &&
        isDrawerOpen()
      ) {
        closeDrawer({
          restoreFocus: false
        });
      }
    }
  );
}

/* ===================================
   Reveal Animation
=================================== */

function initializeRevealAnimation() {
  if (!revealElements.length) {
    return;
  }

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (prefersReducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }

  requestAnimationFrame(() => {
    revealElements.forEach((element) => {
      const delay =
        Number(element.dataset.delay) || 0;

      window.setTimeout(() => {
        element.classList.add("is-visible");
      }, delay);
    });
  });
}

/* ===================================
   Initialize
=================================== */

initializeDrawer();
initializeRevealAnimation();