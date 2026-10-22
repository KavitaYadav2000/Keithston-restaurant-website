// Mark JS as available so reveal styles only apply when this script runs.
document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Mobile navigation ---------- */
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("navLinks");

function setMenu(open) {
  nav.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
}

toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("open")) {
    setMenu(false);
    toggle.focus();
  }
});

/* ---------- Header: solid on scroll, hides on scroll down ---------- */
const header = document.getElementById("siteHeader");
const heroImg = document.getElementById("heroImg");
const hero = document.getElementById("home");
let lastY = window.scrollY;
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 40);

  const goingDown = y > lastY && y > 400;
  header.classList.toggle("hidden", goingDown && !nav.classList.contains("open"));
  lastY = y;

  // Gentle parallax on the hero photo
  if (!reduceMotion && y < hero.offsetHeight) {
    heroImg.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
  }
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  },
  { passive: true },
);
onScroll();

/* ---------- Scroll reveals ---------- */
const revealTargets = [
  ".about-lead",
  ".pillars li",
  ".vision-copy h2",
  ".vm > div",
  ".menu-head > *",
  ".dish",
  ".quality-copy > *",
  ".rules li",
  ".experience-head > *",
  ".experience-cols article",
  ".quote blockquote",
  ".quote figcaption",
  ".community h2",
  ".community .rows li",
  ".growth h2",
  ".growth-text",
  ".growth .rows li",
  ".contact h2",
  ".contact-text",
  ".form > *",
];

revealTargets.forEach((selector) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add("reveal");
    // Stagger siblings that share a parent
    el.style.setProperty("--i", String(Math.min(i, 5)));
  });
});

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
);

document.querySelectorAll(".reveal, .wipe").forEach((el) => io.observe(el));

/* ---------- Active nav link ---------- */
const navLinks = document.querySelectorAll(".nav-links a:not(.nav-cta)");
const sections = document.querySelectorAll("section[id]");

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`));
    });
  },
  { rootMargin: "-40% 0px -55% 0px" },
);
sections.forEach((s) => activeObserver.observe(s));

/* ---------- Menu: photo follows the cursor ---------- */
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const list = document.getElementById("menuList");
const preview = document.getElementById("menuPreview");
const previewImg = preview.querySelector("img");

if (canHover && list) {
  // Warm the cache so the photo appears instantly on first hover
  list.querySelectorAll(".dish").forEach((d) => {
    const img = new Image();
    img.src = d.dataset.img;
  });

  let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

  const loop = () => {
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    preview.style.transform = `translate3d(${cx + 28}px, ${cy - preview.offsetHeight / 2}px, 0)`;
    raf = requestAnimationFrame(loop);
  };

  const show = (dish, x, y) => {
    if (previewImg.getAttribute("src") !== dish.dataset.img) previewImg.src = dish.dataset.img;
    if (!preview.classList.contains("on")) {
      cx = tx = x;
      cy = ty = y;
    }
    preview.classList.add("on");
    if (!raf) raf = requestAnimationFrame(loop);
  };

  const hide = () => {
    preview.classList.remove("on");
    cancelAnimationFrame(raf);
    raf = null;
  };

  list.querySelectorAll(".dish").forEach((dish) => {
    dish.addEventListener("mouseenter", (e) => show(dish, e.clientX, e.clientY));
    dish.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });
    dish.addEventListener("mouseleave", hide);
    // Keyboard users get the photo too
    dish.addEventListener("focus", () => {
      const r = dish.getBoundingClientRect();
      show(dish, r.right - 340, r.top + r.height / 2);
    });
    dish.addEventListener("blur", hide);
  });
}

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Reservation form ---------- */
const form = document.getElementById("reservationForm");
const status = document.getElementById("formStatus");
const dateInput = document.getElementById("date");

// No bookings in the past
dateInput.min = new Date().toISOString().split("T")[0];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.elements.name;
  const email = form.elements.email;
  let ok = true;

  [name, email].forEach((field) => {
    const valid = field.value.trim() !== "" && field.checkValidity();
    field.classList.toggle("invalid", !valid);
    if (!valid && ok) {
      field.focus();
      ok = false;
    }
  });

  status.classList.toggle("error", !ok);
  if (!ok) {
    status.textContent = "Please add your name and a valid email so we can confirm your table.";
    return;
  }

  status.textContent = "Thank you! Your request has been received. We will confirm by email.";
  form.reset();
});
