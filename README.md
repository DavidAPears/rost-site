<div align="center">

# rost.fyi

**People are more than pictures.**

The holding page for [RÖST](https://rost.fyi), a voice-first social platform.

</div>

---

## What this is

One static page. No framework, no build step, no dependencies: it is a
wordmark, a line, and a waveform, and anything heavier would be a liability
on something that exists to be replaced.

It will become the marketing site once there is something to market, at
which point the store links are the only part of it that really matters.

## Running it

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploying

Vercel, as a static site. No build command and no output directory: the
repository root is what gets served.

The domain is registered with Cloudflare, so DNS lives there. The record
pointing at Vercel must be **DNS-only**, the grey cloud rather than the
orange one. Proxying Cloudflare in front of Vercel stacks two CDNs and,
with the default SSL mode, produces a redirect loop.

## The brand

Taken from the app's own design tokens rather than approximated, so the two
cannot drift:

| | |
| ----------- | --------- |
| Deep teal   | `#081E1E` |
| Near black  | `#101817` |
| Acid yellow | `#E6FF4D` |
| Mint        | `#9FE3D3` |
| Ivory       | `#F7F7F1` |

The wordmark in `assets/` is the same file the app ships.

---

<div align="center">

© RÖST. All rights reserved.

</div>
