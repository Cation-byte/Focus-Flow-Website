/* ============================================================
   Focus Flow landing page — interactions
   ============================================================ */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll reveal ---------- */
  var revealables = document.querySelectorAll(".reveal, .map-card");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Consistency matrix ---------- */
  // Deterministic pattern so the grid looks organic but never changes between loads.
  function levelFor(i) {
    var x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
    var r = x - Math.floor(x);
    if (r > 0.78) return "l3";
    if (r > 0.55) return "l2";
    if (r > 0.3) return "l1";
    return "";
  }

  function buildMatrix(el, cells) {
    if (!el) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < cells; i++) {
      var cell = document.createElement("i");
      cell.className = levelFor(i);
      cell.style.setProperty("--i", i);
      frag.appendChild(cell);
    }
    el.appendChild(frag);
  }

  buildMatrix(document.getElementById("mock-matrix"), 30);
  buildMatrix(document.getElementById("track-matrix"), 45);

  if ("IntersectionObserver" in window) {
    var mio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            mio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    document.querySelectorAll(".matrix").forEach(function (m) { mio.observe(m); });
  } else {
    document.querySelectorAll(".matrix").forEach(function (m) { m.classList.add("is-in"); });
  }

  /* ---------- Weekly pace bars ---------- */
  var paceHost = document.getElementById("pace-bars");
  var paceHeights = [38, 62, 24, 85, 70, 46, 92];
  if (paceHost) {
    paceHeights.forEach(function (h) {
      var bar = document.createElement("i");
      if (h >= 80) bar.className = "hot";
      bar.setAttribute("data-h", h);
      paceHost.appendChild(bar);
    });
    var grow = function () {
      Array.prototype.forEach.call(paceHost.children, function (bar) {
        bar.style.height = bar.getAttribute("data-h") + "%";
      });
    };
    if (reduced || !("IntersectionObserver" in window)) {
      grow();
    } else {
      var pio = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) { grow(); pio.unobserve(entry.target); }
          });
        },
        { threshold: 0.3 }
      );
      pio.observe(paceHost);
    }
  }

  /* ---------- Live clock in the app mock ---------- */
  var clockEl = document.getElementById("mock-clock");
  var dateEl = document.getElementById("mock-date");
  function tickClock() {
    var now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    }
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
    }
  }
  tickClock();
  setInterval(tickClock, 15000);

  /* ---------- Demo focus timers ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function makeTimer(ids, startSeconds) {
    var timeEl = document.getElementById(ids.time);
    var playEl = document.getElementById(ids.play);
    var resetEl = document.getElementById(ids.reset);
    var sessionsEl = document.getElementById(ids.sessions);
    if (!timeEl || !playEl) return null;

    var remaining = startSeconds;
    var running = true;
    var handle = null;
    var sessions = sessionsEl ? parseInt(sessionsEl.textContent, 10) || 0 : 0;

    function render() {
      var m = Math.floor(remaining / 60);
      var s = remaining % 60;
      timeEl.textContent = pad(m) + ":" + pad(s);
    }

    function setIcon(name) {
      var use = playEl.querySelector("use");
      if (use) use.setAttribute("href", name === "play" ? "#i-play" : "#i-pause");
    }

    function stop() {
      running = false;
      setIcon("play");
      if (handle) { clearInterval(handle); handle = null; }
    }

    function start() {
      if (remaining <= 0) remaining = startSeconds;
      running = true;
      setIcon("pause");
      handle = setInterval(function () {
        remaining -= 1;
        if (remaining <= 0) {
          remaining = 0;
          render();
          sessions += 1;
          if (sessionsEl) sessionsEl.textContent = sessions;
          stop();
          return;
        }
        render();
      }, 1000);
    }

    playEl.addEventListener("click", function () {
      if (running) { stop(); } else { start(); }
    });

    if (resetEl) {
      resetEl.addEventListener("click", function () {
        stop();
        remaining = startSeconds;
        render();
      });
    }

    render();
    if (!reduced) { start(); } else { stop(); }
    return { stop: stop };
  }

  makeTimer({ time: "mock-timer", play: "mock-play", reset: "mock-reset", sessions: "mock-sessions" }, 24 * 60 + 58);
  makeTimer({ time: "demo-timer", play: "demo-play", reset: "demo-reset", sessions: "demo-sessions" }, 24 * 60 + 58);

  /* ---------- Flashcard flip ---------- */
  var flip = document.getElementById("flip");
  if (flip) {
    var toggle = function () { flip.classList.toggle("is-flipped"); };
    flip.addEventListener("click", toggle);
    flip.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  }
})();
