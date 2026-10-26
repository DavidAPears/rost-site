<div align="center">

# rost.fyi

**Less scrolling. More listening.**

The landing page for [RÖST](https://rost.fyi), a voice-first social platform.

</div>

---

## What this is

One static page. No framework, no build step, no dependencies: a wordmark,
a headline, the recording ribbon, three cards and a waitlist field. Anything
heavier would be a liability on something that exists to be replaced.

It became the landing page when the holding page stopped being enough. The
store links are still the part that will matter most once there are any.

## Running it

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Serve it rather than opening `index.html` from the filesystem. Web Audio
treats a `file://` media element as cross-origin, so the analyser behind
the ribbon reads silence and the band never moves.

## Deploying

Vercel, as a static site. No build command and no output directory: the
repository root is what gets served.

The domain is registered with Cloudflare, so DNS lives there. The record
pointing at Vercel must be **DNS-only**, the grey cloud rather than the
orange one. Proxying Cloudflare in front of Vercel stacks two CDNs and,
with the default SSL mode, produces a redirect loop.

## The ribbon

The wave behind the headline is the app's own recording ribbon, ported from
`src/components/recording-wave.tsx` in the mobile repo. Same seven interlaced
strands, same `sin(πu)^0.7` envelope so it arrives and leaves rather than
being cut off by the screen, same hashed motes, same hanging guides, same
rise-fast fall-slow smoothing.

Two things are deliberately not ported:

- **Skia's `BlurMask`.** On a GPU over a phone-sized canvas that bloom is
  nearly free. As `ctx.filter` on a full-width desktop canvas it is a
  surface blur per strand per frame, and it cooks the machine. The halo
  here is a second unblurred pass of wider, dimmer dots.
- **The colour sweep's stops.** The app runs lime to aqua across the whole
  band. Here the left of the band is masked away by CSS, so the stops are
  remapped onto what is visible: the lime lands clear of the fade rather
  than inside it.

It draws at 30fps with the backing store capped at 1.25x, and stops
completely when the hero is scrolled past or the tab is in the background.

## A voice under the ribbon

Drop a clip in the repository root named `voice.m4a`, `.mp3`, `.wav` or
`.ogg`. Each is tried in turn. The HEAR RÖST button then runs it through an
`AnalyserNode` and feeds the ribbon, so the band swells to the real envelope
of a real recording rather than to a pattern. With no clip present the
button disables itself and nothing else changes.

`VOICE_GAIN` at the top of the audio block compensates for how far below
full scale a phone recording sits. It was set from the envelope of the
current clip, measured in 50ms windows, and wants remeasuring if the clip
changes.

## The brand

Taken from the app's own design tokens rather than approximated, so the two
cannot drift:

| | | |
| ----------- | --------- | ---------------------------- |
| Ground      | `#040B0A` | `palette.teal900`            |
| Card        | `#0A1311` | near `palette.teal800`       |
| Ink         | `#101817` | `palette.ink900`, on lime    |
| Acid lime   | `#E6FF4D` | `palette.lime400`            |
| Mint        | `#9FE3D3` | `palette.mint300`            |
| Aqua        | `#37DCCB` | `palette.aqua400`            |
| Ivory       | `#F7F7F1` | `palette.ivory100`           |

Dark only, on purpose. RÖST is drawn dark and that is the version people
should meet first.

Headings are Space Grotesk, interface text is Inter, both from Google Fonts.
The wordmark in `assets/` is the same file the app ships, and at 420px wide
it is capped at native size on the page rather than upscaled.

**No em dashes or en dashes in copy**, the same rule the app enforces in
eslint. Commas, full stops, or a rewrite.

## Assets

| File | What it is |
| ---- | ---------- |
| `assets/wordmark.png` | The wordmark, 420 by 111, as the app ships it |
| `assets/icon.png` | Favicon, apple-touch-icon and the share preview |
| `assets/discover_header.png` | The app's `BACKDROP.dark` still, used along the bottom of the three cards |
| `assets/bg_wave.mp4` | The app's `BACKDROP.dark` video |
| `voice.m4a` | The clip under the ribbon, if there is one |

`bg_wave.mp4` is currently **parked**: the `<video>` in `.hero-art` and its
two matching CSS rules are commented out rather than deleted, with a note
saying they belong together. Uncommenting both brings the app's backdrop
back as the hero artwork, with the ribbon fading in over it only while a
voice plays. The video is portrait, 712 by 1536, and its bright band sits
about 29 per cent down, which is why the crop is pulled up to meet it.

## Not done yet

The footer links at `/privacy`, `/terms`, `/child-safety` and `/delete` are
the paths `src/lib/policies.ts` in the mobile repo already expects. **None
of them resolve.** Two of them block store submission.

The waitlist field validates and confirms but stores nothing until it is
wired to a list.

---

<div align="center">

© RÖST. All rights reserved.

</div>
