/* The recording ribbon, ported from src/components/recording-wave.tsx in
 * the app. Same seven interlaced strands, the same sin(pi*u)^0.7 envelope
 * so it arrives and leaves rather than being cut off, the same hashed
 * motes, the same rise-fast fall-slow smoothing.
 *
 * Skia's BlurMask is deliberately not ported. On a GPU over a phone-sized
 * canvas that bloom is nearly free; as ctx.filter on a desktop canvas it
 * is a full surface blur per strand per frame and it melts the machine.
 * The halo here is a second unblurred pass of wider, dimmer dots.
 */
window.makeRibbon = function (canvas, opts) {
  opts = opts || {};
  var ctx = canvas.getContext('2d');
  var MAX_DPR = 1.25;
  var STRANDS = 7, GUIDES = 30, RISE = 60, DROP = 110, LOUD = 74;
  var quiet = opts.quiet != null ? opts.quiet : 16;

  var w = 0, h = 0, cols = 120, moteCount = 70, scale = 1;
  var sweep = null, guideFill = null, moteU = [], moteV = [], px = [], py = [];
  var r = { level: 0, smoothed: 0, phase: opts.phase || 0 };

  r.size = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    w = canvas.clientWidth; h = canvas.clientHeight;
    if (!w || !h) return false;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* Density is most of the character, so columns follow the width
       rather than staying at the phone's 120 across a desktop. */
    cols = Math.max(80, Math.min(190, Math.round(w / 9)));
    moteCount = Math.max(30, Math.min(110, Math.round(w / 16)));
    scale = Math.max(0.4, Math.min(2.4, h / 300));

    /* The app runs transparent, lime, mint, aqua, transparent across the
       whole band. Here the stops are pulled in so the lime lands where
       the envelope is fattest rather than in the taper. */
    sweep = ctx.createLinearGradient(0, 0, w, 0);
    sweep.addColorStop(0, 'rgba(230,255,77,0)');
    sweep.addColorStop(0.22, '#E6FF4D');
    sweep.addColorStop(0.52, '#9FE3D3');
    sweep.addColorStop(0.78, '#37DCCB');
    sweep.addColorStop(1, 'rgba(55,220,203,0)');

    var mid = h / 2;
    guideFill = ctx.createLinearGradient(0, mid - RISE * scale, 0, mid + DROP * scale);
    guideFill.addColorStop(0, 'rgba(55,220,203,0)');
    guideFill.addColorStop(0.3, '#37DCCB');
    guideFill.addColorStop(0.7, '#37DCCB');
    guideFill.addColorStop(1, 'rgba(55,220,203,0)');

    moteU.length = 0; moteV.length = 0;
    for (var m = 0; m < moteCount; m++) {
      var hash = Math.sin(m * 127.1) * 43758.5453;
      moteU.push(hash - Math.floor(hash));
      moteV.push(Math.sin(m * 311.7) * 0.5 + 0.5);
    }
    return true;
  };

  function dots(n, radius, alpha) {
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    for (var i = 0; i < n; i++) {
      ctx.moveTo(px[i] + radius, py[i]);
      ctx.arc(px[i], py[i], radius, 0, 6.283185);
    }
    ctx.fill();
  }

  r.draw = function () {
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    var mid = h / 2;
    var amplitude = (quiet + r.smoothed * LOUD) * scale;

    if (opts.guides !== false) {
      ctx.globalAlpha = 0.26; ctx.strokeStyle = guideFill; ctx.lineWidth = 0.6;
      ctx.beginPath();
      for (var i = 1; i <= GUIDES; i++) {
        var gx = (i * w) / (GUIDES + 1);
        ctx.moveTo(gx, mid - RISE * scale); ctx.lineTo(gx, mid + DROP * scale);
      }
      ctx.stroke();
    }

    ctx.fillStyle = sweep;
    for (var m = 0; m < moteCount; m++) {
      var mu = (moteU[m] + r.phase * 0.012) % 1;
      var menv = Math.pow(Math.sin(Math.PI * mu), 0.7);
      px[m] = mu * w;
      py[m] = mid + (moteV[m] - 0.5) * (150 + 90 * r.smoothed) * (0.35 + menv) * scale
                  + Math.sin(r.phase * 0.7 + m) * 4 * scale;
    }
    dots(moteCount, 1.1, 0.36);

    for (var s = 0; s < STRANDS; s++) {
      var offset = s - (STRANDS - 1) / 2;
      for (var c = 0; c < cols; c++) {
        var u = c / (cols - 1);
        var env = Math.pow(Math.sin(Math.PI * u), 0.7);
        var primary = Math.sin(u * 11 - r.phase + s * 0.18);
        var secondary = 0.3 * Math.sin(u * 21 + r.phase * 0.55 + s * 0.4);
        var third = 0.16 * Math.sin(u * 37 - r.phase * 0.33 + s);
        var fan = offset * (2.6 + 5.5 * env * (0.5 + r.smoothed)) * scale;
        px[c] = u * w;
        py[c] = mid + (primary + secondary + third) * amplitude * env + fan;
      }
      var depth = Math.abs(s - (STRANDS - 1) / 2) / ((STRANDS - 1) / 2);
      var core = 1.5 - depth * 0.55 + r.smoothed * 0.5;
      dots(cols, core * 1.6, 0.2);
      dots(cols, core * 0.66, 1);
    }
    ctx.globalAlpha = 1;
  };

  /* Rises quickly and falls slowly, so it reads as somebody speaking
     rather than a meter twitching. */
  r.advance = function (elapsed, gated) {
    var tau = gated > r.smoothed ? 0.09 : 0.28;
    r.smoothed += (gated - r.smoothed) * (1 - Math.exp(-elapsed / tau));
    r.phase += elapsed * 1.35;
  };

  return r;
};
