/* =========================================================================
   shadow.js — reusable "listen & shadow" pronunciation widget.
   Auto-enhances any element marked:
       <div class="shadow" data-phrase="pick it up"
            data-ipa="/pɪ kɪ tʌp/" data-linked="pi·ki·tup"
            data-rate="0.92" data-slow="0.6"></div>
   Builds Play (normal) + Slow buttons via the Web Speech API.
   Prefers a General-American voice; degrades gracefully if unavailable.
   ========================================================================= */
(function () {
  "use strict";

  var ACCENT = "en-GB"; // British English (see NOTES.md accent decision)

  function pickVoice(voices) {
    if (!voices || !voices.length) return null;
    // exact accent match first
    var exact = voices.filter(function (v) { return v.lang === ACCENT; });
    if (exact.length) {
      // prefer a known-natural name if present
      var named = exact.filter(function (v) {
        return /natural|google|samantha|alex|karen|daniel/i.test(v.name);
      });
      if (named.length) return named[0];
      return exact[0];
    }
    // fall back to any English voice
    var any = voices.filter(function (v) { return /^en/i.test(v.lang); });
    return any[0] || voices[0];
  }

  function loadVoices(cb) {
    var v = window.speechSynthesis.getVoices();
    if (v && v.length) { cb(v); return; }
    window.speechSynthesis.onvoiceschanged = function () {
      cb(window.speechSynthesis.getVoices());
    };
  }

  function speak(text, rate) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = ACCENT;
    u.rate = rate;
    var v = shadow._voice;
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }

  function build(el) {
    var phrase = el.getAttribute("data-phrase") || "";
    var rate = parseFloat(el.getAttribute("data-rate")) || 0.92;
    var slow = parseFloat(el.getAttribute("data-slow")) || 0.6;

    var controls = el.querySelector(".controls");
    if (!controls) {
      controls = document.createElement("div");
      controls.className = "controls";
      el.appendChild(controls);
    }

    function btn(label, cls, fn) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      if (cls) b.className = cls;
      b.addEventListener("click", fn);
      return b;
    }

    controls.innerHTML = "";

    if (!("speechSynthesis" in window)) {
      var note = document.createElement("span");
      note.className = "sub";
      note.style.margin = "0";
      note.textContent = "(audio unsupported in this browser — read it aloud yourself)";
      controls.appendChild(note);
      return;
    }

    controls.appendChild(btn("▶ Play", "play", function () { speak(phrase, rate); }));
    controls.appendChild(btn("🐢 Slow", "", function () { speak(phrase, slow); }));
  }

  var shadow = {
    _voice: null,
    init: function (root) {
      root = root || document;
      var nodes = root.querySelectorAll(".shadow");
      nodes.forEach(build);
    },
    setAccent: function (lang) { ACCENT = lang; loadVoices(function (v) { shadow._voice = pickVoice(v); }); }
  };

  // init on DOM ready, after voices load
  function ready() {
    loadVoices(function (voices) {
      shadow._voice = pickVoice(voices);
      shadow.init(document);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

  window.EL = window.EL || {};
  window.EL.shadow = shadow;
})();
