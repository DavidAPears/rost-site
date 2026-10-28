<div align="center">

# rost.fyi

**Less scrolling. More listening.**

The website for [RÖST](https://rost.fyi), a voice-first social platform.

</div>

---

## What this is

Eleven static pages. No framework, no build step, no dependencies beyond
the Supabase client on the pages that write to it.

| Path | What it is | Indexed |
| ---- | ---------- | ------- |
| `/` | The landing page: ribbon, a real recording, three cards, the waitlist | yes |
| `/discover` | The feed you listen to | yes |
| `/connect` | Meeting people voice first | yes |
| `/create` | The page you are hired from | yes |
| `/about` | What RÖST is, written to be read by search engines | yes |
| `/delete` | Account deletion, which Play requires to be reachable without signing in | yes |
| `/privacy` | Privacy policy | no |
| `/terms` | Terms of service | no |
| `/child-safety` | CSAE policy | no |
| `/community-guidelines` | Community guidelines | yes |
| `/admin` | The desk: anonymised stats and the report queue, behind two gates | no |

The three feature pages share one structure deliberately: the backdrop is
scoped to the fold, the phone cluster is scaled rather than resized, and
the three claim cards are sized so a strip of them shows above the fold.
All three land within a few pixels of each other, which is a thing to
preserve rather than a coincidence.

**The store links are still the part that will matter most once there are
any.**

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

`assets/voice2.m4a`, played through an `AnalyserNode` by `assets/player.js`,
so the band swells to the real envelope of a real recording rather than to
a pattern.

`GAIN` and `GATE` at the top of that file compensate for how far below full
scale a phone recording sits. They were set from the envelope of the current
clip measured in 50ms windows, and **want remeasuring whenever the clip
changes** — the constant is wrong for a different recording, and the comment
above it records the measurements it came from.

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
| `assets/bg_animation.mp4` | The backdrop behind every fold, 1920 by 1080, 8s |
| `assets/bg_static.jpg` | Its poster, shown before the video decodes |
| `assets/voice2.m4a` | The clip under the ribbon |
| `assets/discover_*.jpg` | Discover: four topic cards and three portraits |
| `assets/connect_*.jpg` | Connect: three portraits, two step pictures, two avatars |
| `assets/create_*.jpg` | Create: three portraits, one profile avatar, three sample avatars, two step pictures |

Photographs are cropped per frame with `object-position`, worked out from
where the subject sits in the file rather than nudged. **Replacing one
almost always means changing its `object-position` too.**

Connect's locked faces are blurred in CSS, scaled up so the blur has image
to sample at its edges, at a share of the frame's width rather than a fixed
number of pixels. Worth knowing that **this is not what the app does**:
Connect sends a blurhash and the real pixels never reach the device, because
a blurred JPEG comes back out of one with a screenshot and a slider. These
pages are a drawing of that screen rather than the screen.

## Policy versions

The four published documents are dated **27 October 2026**, and
`src/lib/policies.ts` in the mobile repo records `2026-10-27` against each.
That version is what a user's acceptance is recorded against.

**If a published document changes, its date has to change in both places.**
A version in the app that disagrees with the live document is worse than no
record at all.

## Not done yet

See [TODO.md](TODO.md).

---

<div align="center">

© RÖST. All rights reserved.

</div>
