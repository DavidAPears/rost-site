/* The voice note on the home page, which is a real one.
 *
 * The clip at /voice.m4a drives the ribbon through an AnalyserNode, so the
 * band swells to the actual envelope of a real recording rather than to a
 * pattern. That is the same rule the app keeps everywhere: a waveform is a
 * measured recording, never decoration.
 *
 * The backdrop behind all of this is a video, so the only thing this file
 * animates is the player's own band.
 */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var el = function (id) { return document.getElementById(id); };

  /* ---------- the backdrop ---------- */
  /* A video rather than a second drawn ribbon: the GPU decodes it, which
     costs far less than the canvas it replaced. Somebody who has asked
     their machine to stop moving things gets the poster frame instead,
     and it stops while the tab is in the background. */
  var backdrop = document.getElementById('backdrop');
  if (backdrop) {
    if (reduce) {
      backdrop.removeAttribute('autoplay');
      backdrop.pause();
    } else {
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
          var p = backdrop.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          backdrop.pause();
        }
      });
    }
  }

  /* ---------- the player ---------- */
  var canvas = el('ribbon');
  if (!canvas || !window.makeRibbon) return;

  var wave = window.makeRibbon(canvas, { quiet: 14, guides: false });
  var sized = wave.size();
  if (sized) wave.draw();

  var audio = new Audio('/voice.m4a');
  audio.preload = 'metadata';
  audio.crossOrigin = 'anonymous';

  var actx = null, analyser = null, buf = null, frame = 0, last = null;

  /* Phone recordings sit well below full scale. Measured across the whole
     of this clip in 50ms windows: peak 0.216, p95 0.085, median 0.018. At
     a gain of 3.2 the band rested through most of the speech. Remeasure if
     the clip changes. */
  var GAIN = 9.5;
  var GATE = 0.1;

  function clock(s) {
    if (!isFinite(s)) s = 0;
    var m = Math.floor(s / 60);
    var r = Math.floor(s % 60);
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  function paintTime() {
    var d = isFinite(audio.duration) ? audio.duration : 18;
    el('total').textContent = clock(d);
    el('time').textContent = clock(audio.currentTime) + ' / ' + clock(d);
    el('fill').style.width = (d ? (audio.currentTime / d) * 100 : 0).toFixed(2) + '%';
  }

  audio.addEventListener('loadedmetadata', paintTime);
  audio.addEventListener('timeupdate', paintTime);
  paintTime();

  function level() {
    if (!analyser || audio.paused) return 0;
    analyser.getByteTimeDomainData(buf);
    var sum = 0;
    for (var i = 0; i < buf.length; i++) { var v = (buf[i] - 128) / 128; sum += v * v; }
    var rms = Math.sqrt(sum / buf.length) * GAIN;
    return rms < GATE ? 0 : Math.min(1, rms);
  }

  function tick(now) {
    frame = requestAnimationFrame(tick);
    var elapsed = last === null ? 0.033 : Math.min(0.1, (now - last) / 1000);
    last = now;
    wave.advance(elapsed, level());
    wave.draw();
  }

  function run(on) {
    if (on && !frame && !reduce) { last = null; frame = requestAnimationFrame(tick); }
    if (!on && frame) { cancelAnimationFrame(frame); frame = 0; }
  }

  /* Idling costs frames for a band nobody is listening to, so it only
     moves while something is playing or while the page is being looked at
     with the player in view. */
  var onScreen = true, visible = true;
  function decide() { run(onScreen && visible); }

  if (window.IntersectionObserver) {
    new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; decide(); },
      { threshold: 0 }).observe(canvas);
  }
  document.addEventListener('visibilitychange', function () {
    visible = document.visibilityState === 'visible'; decide();
  });
  decide();

  function setPlaying(on) {
    el('play-glyph').innerHTML = on
      ? '<rect x="1" y="1" width="10" height="10"/>'
      : '<polygon points="1,0 12,6 1,12"/>';
    el('play').setAttribute('aria-label', on ? 'Pause' : 'Play');
  }

  function toggle() {
    if (!audio.paused) { audio.pause(); return; }
    if (!actx) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        actx = new Ctx();
        analyser = actx.createAnalyser();
        analyser.fftSize = 1024;
        buf = new Uint8Array(analyser.fftSize);
        actx.createMediaElementSource(audio).connect(analyser);
        analyser.connect(actx.destination);
      }
    }
    if (actx) actx.resume();
    audio.play().catch(function () {});
  }

  el('play').addEventListener('click', toggle);

  audio.addEventListener('play', function () { setPlaying(true); decide(); });
  ['pause', 'ended'].forEach(function (e) {
    audio.addEventListener(e, function () { setPlaying(false); paintTime(); });
  });

  el('bar').addEventListener('click', function (e) {
    var box = e.currentTarget.getBoundingClientRect();
    var d = isFinite(audio.duration) ? audio.duration : 0;
    if (d) audio.currentTime = Math.max(0, Math.min(d, ((e.clientX - box.left) / box.width) * d));
    paintTime();
  });

  var rt = 0;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (wave.size()) wave.draw(); }, 150);
  });
})();
