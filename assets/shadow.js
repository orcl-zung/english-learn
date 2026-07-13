/* =========================================================================
   shadow.js — "listen & shadow" pronunciation widgets (Web Speech API).
   HONEST LIMITATION: system TTS reads word-by-word and does NOT reliably
   produce linking / elision. It's a word-level reference only. For genuine
   linked speech, each short phrase also gets a "↗ real speech" link to
   YouGlish (real UK speakers). Recommend installing a neural voice (Serena /
   Arthur, en-GB) for much better offline synthesis.

   Enhances (reads data-phrase):
     <div class="shadow" data-phrase="pick it up" data-rate="0.92" data-slow="0.6"> … </div>
     <span class="speakable" data-phrase="look at it"></span>
   Exposes EL.speak(text, rate) and EL.shadow.{init, setAccent}.
   ========================================================================= */
(function () {
  "use strict";

  var ACCENT = "en-GB"; // British English (see NOTES.md)

  // Preference order among same-accent voices: neural/premium first, Daniel last.
  var PREMIUM = /(serena|arthur|aaron|kate|google uk|natural|siri|neural)/i;

  function pickVoice(voices) {
    if (!voices || !voices.length) return null;
    var exact = voices.filter(function (v) { return v.lang === ACCENT || v.lang === ACCENT.replace("-", "_"); });
    if (exact.length) {
      var premium = exact.filter(function (v) { return PREMIUM.test(v.name); });
      if (premium.length) return premium[0];
      return exact[0];          // fall back to first installed en-GB voice (e.g. Daniel)
    }
    var any = voices.filter(function (v) { return /^en/i.test(v.lang); });
    return any[0] || voices[0];
  }

  function loadVoices(cb) {
    var v = window.speechSynthesis.getVoices();
    if (v && v.length) { cb(v); return; }
    window.speechSynthesis.onvoiceschanged = function () { cb(window.speechSynthesis.getVoices()); };
  }

  function speak(text, rate) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = ACCENT;
    u.rate = rate;
    if (shadow._voice) u.voice = shadow._voice;
    window.speechSynthesis.speak(u);
  }

  function youglishUrl(phrase) {
    var slug = String(phrase).trim().replace(/\s+/g, "_");
    return "https://youglish.com/pronounce/" + encodeURIComponent(slug) + "/english/uk";
  }

  function makeButton(label, cls, fn) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    if (cls) b.className = cls;
    b.addEventListener("click", fn);
    return b;
  }

  // "↗ real speech" — only useful for short phrases (YouGlish can't search paragraphs)
  function maybeRealSpeech(phrase, into) {
    var words = String(phrase).trim().split(/\s+/);
    if (words.length === 0 || words.length > 6) return;
    var a = document.createElement("a");
    a.className = "real-speech";
    a.href = youglishUrl(phrase);
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "↗ real speech";
    a.title = "Hear real UK speakers say this on YouGlish (needs internet)";
    into.appendChild(a);
  }

  function noteUnsupported(into) {
    var s = document.createElement("span");
    s.className = "sub"; s.style.margin = "0";
    s.textContent = "(audio unsupported here)";
    into.appendChild(s);
  }

  function buildShadow(el) {
    var phrase = el.getAttribute("data-phrase") || "";
    var rate = parseFloat(el.getAttribute("data-rate")) || 0.92;
    var slow = parseFloat(el.getAttribute("data-slow")) || 0.6;
    var controls = el.querySelector(".controls");
    if (!controls) { controls = document.createElement("div"); controls.className = "controls"; el.appendChild(controls); }
    controls.innerHTML = "";
    if (!("speechSynthesis" in window)) { noteUnsupported(controls); return; }
    controls.appendChild(makeButton("▶ Play (TTS)", "play", function () { speak(phrase, rate); }));
    controls.appendChild(makeButton("🐢 Slow", "", function () { speak(phrase, slow); }));
    maybeRealSpeech(phrase, controls);
  }

  function buildSpeakable(el) {
    var phrase = el.getAttribute("data-phrase") || "";
    var rate = parseFloat(el.getAttribute("data-rate")) || 0.9;
    var slow = parseFloat(el.getAttribute("data-slow")) || 0.6;
    el.innerHTML = "";
    if (!("speechSynthesis" in window)) { noteUnsupported(el); return; }
    el.appendChild(makeButton("▸ TTS", "play", function () { speak(phrase, rate); }));
    el.appendChild(makeButton("slow", "", function () { speak(phrase, slow); }));
    maybeRealSpeech(phrase, el);
  }

  // One honest disclaimer per page, before the first audio widget.
  function injectNote(root) {
    if (root.querySelector(".tts-note")) return;
    var first = root.querySelector(".shadow, .speakable");
    if (!first) return;
    var n = document.createElement("p");
    n.className = "tts-note";
    n.innerHTML = "🔊 <strong>Play 是系统合成语音（TTS）</strong>——能查单词发音，但<span class=\"zh\">不会真连读</span>。" +
      "听真人怎么连读，点每条旁边的 <strong>↗ real speech</strong>（YouGlish，需联网）。" +
      "<span class=\"zh\">想离线也连读：装个高级嗓音 Serena / Arthur（系统设置 → 辅助功能 → 朗读内容 → 声音）。</span>";
    first.parentNode.insertBefore(n, first);
  }

  var shadow = {
    _voice: null,
    speak: speak,
    init: function (root) {
      root = root || document;
      injectNote(root);
      root.querySelectorAll(".shadow").forEach(buildShadow);
      root.querySelectorAll(".speakable").forEach(buildSpeakable);
    },
    setAccent: function (lang) { ACCENT = lang; loadVoices(function (v) { shadow._voice = pickVoice(v); }); }
  };

  function ready() {
    loadVoices(function (voices) { shadow._voice = pickVoice(voices); shadow.init(document); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();

  window.EL = window.EL || {};
  window.EL.shadow = shadow;
  window.EL.speak = speak;
})();
