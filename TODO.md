# What is left on rost.fyi

Written 28 October 2026, from the files rather than from memory. Every
count in here was taken by reading the pages.

The site is **eleven pages and all of them resolve**. Nothing here is
broken. What follows is what stands between it and being finished.

---

## The one thing that unblocks the most

### 1. The legal entity name and registered address

Eight gaps across three documents are the same gap:

| Document | Says |
| -------- | ---- |
| `/privacy` | `INSERT FULL LEGAL ENTITY NAME`, `COUNTRY / JURISDICTION`, `ADDRESS` ×2 |
| `/terms` | `FULL LEGAL ENTITY NAME`, `LEGAL ENTITY` ×2, `REGISTERED ADDRESS` |
| `/child-safety` | `INSERT LEGAL ENTITY NAME, IF REQUIRED` |

Until there is a company, these cannot be filled and the two documents
that carry them cannot be published. **Both block store submission.**

If you tell me the entity, the jurisdiction and the address, all eight
go in one pass.

---

## Blocked on a value only you can fetch

### 2. Deep links

Both files are 404 and both must ship with a matching app change, or
neither does anything:

```
/.well-known/assetlinks.json              needs the app signing key SHA-256
/.well-known/apple-app-site-association   needs the Apple Team ID
```

- The Android fingerprint is the **app signing key**, not the upload
  key. Play Console → Setup → App integrity. The upload key produces a
  file that looks right and verifies nothing.
- `apple-app-site-association` has **no `.json` extension** and must be
  served as `Content-Type: application/json` with no redirect.
- `app.json` in the mobile repo has neither `associatedDomains` nor
  `intentFilters` yet. A site file without the app config does nothing;
  app config without the site file makes Android show a "which app?"
  chooser instead of verifying silently.

This is the largest growth lever in the product. Sharing a voice note
today shares a sentence and no link at all.

### 3. Store links

The footer and the home page have nowhere to send anybody. Once there
is a listing on either store, the links go in.

---

## Copy only you can write

### 4. The founder story

`/about` → **Who is behind it** is the one remaining hold on that page.
It is usually the most read part of an about page and the part search
engines have the least trouble ranking.

Everything else on `/about` is now filled, including the contact
addresses.

---

## Decisions, not work

### 5. "Get paid" against what the terms say

`/create` and `/about` now say creators get paid. `/terms` §Create
currently says the opposite:

> RÖST does not guarantee that any creator will be discovered, hired or
> paid. Unless and until an integrated paid marketplace launches, RÖST
> does not process creator payments or act as an employer or agent.

Both can be true at once — RÖST taking no fee is not the same as
creators not being paid — but the terms line carries a `VERIFY` hold
and whoever reviews it needs to know which story the marketing pages
tell. Worth settling the two together rather than separately.

### 6. The six tags on `/create` do not exist in the app

The profile card shows **Commercial, Narration, Characters, Podcasts,
UGC, Explainer**. The app has one topic list, `src/lib/topics.ts`, and
Create uses it: Storytelling, Comedy, Music, Poetry, Life, Culture,
Learning, Advice, Calm, Sport, History, Planet, Freestyle.

So the website is advertising categories the product does not have.
Either the app grows a set of voice-work categories, or the page uses
the list that exists. Same class of problem as the Discover topic
chips, which were fixed by using real ones.

### 7. The tagline is two different lines

The title, the footer and the README say **"Less scrolling. More
listening."** The home headline says **"More talking."** Both are good.
Having both is the problem.

### 8. `/admin` is linked from the footer of every public page

That was deliberate, and the page is behind two gates. Worth one more
look before launch: it tells anybody reading the footer that there is a
desk and where it is. Removing the link costs nothing — you would still
reach it by typing the path.

---

## Build work, nothing blocking it

### 9. No `robots.txt` and no `sitemap.xml`

`/about` was written for search engines and there is nothing telling
them what to crawl. The four `noindex` pages (`/privacy`, `/terms`,
`/child-safety`, `/admin`) should stay out of the sitemap; the other
seven belong in it.

---

## Carried over from the app side

### 10. Public playback at `/r/<code>`

A shared link should play one voice note and offer the app. Nothing in
the database is readable by an anonymous visitor today, and the audio
sits in a private bucket, both deliberately. Needs either an RPC
granted to `anon` or an Edge Function minting short-lived signed URLs.
The Edge Function is probably right, because the signed URL has to be
minted somewhere privileged anyway.

**Connect must never be reachable from the web.** A feed on the web is
a second product to keep in step and it sidesteps every age-assurance
control the app has.

### 11. The storage purge sweep has never run against a real queue

Deployed and scheduled weekly, Sunday 04:17 UTC. Deleting an account
from `/delete` leaves the audio in the bucket until it runs. Worth one
real deletion and then:

```sql
select count(*) from public.pending_storage_purges where purged_at is null;
```

### 12. Play Console Data safety form

It has to point at `https://rost.fyi/delete`. The page existing is not
the whole requirement.

### 13. A Gmail filter on the `To:` address

So mail to `safety@rost.fyi` labels itself rather than landing in the
same place as everything else.

---

## Done, so it does not get re-litigated

- Eleven pages, all resolving, all linked from one shared footer.
- `/discover`, `/connect` and `/create` built on one structure: the fold
  lands within 4px on all three and the claim cards peek over it by the
  same amount. **That is a thing to preserve.**
- The waitlist writes to the database. An anonymous caller can add an
  address and learn nothing, which was proven from inside the database
  rather than from the form saying thank you.
- Policy dates are in step: the four documents say 27 October 2026 and
  `src/lib/policies.ts` records `2026-10-27`. **If a document changes,
  both change.**
- `contact@rost.fyi` and `safety@rost.fyi` both receive and send.
- `/delete` is reachable without signing in and says what is kept,
  including that reports survive the account, which is deliberate in the
  schema rather than an oversight.
- Share previews: one 1200×630 card at `/assets/share.jpg`, on all ten
  public pages with absolute `og:url`, width, height and alt. The home
  page had no `canonical` at all and now has one. `/admin` is left
  without share tags on purpose.
