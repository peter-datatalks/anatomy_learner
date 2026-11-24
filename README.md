# Anatomia 360°

A trilingual (Hungarian · Swedish · Latin) anatomy study app for physiotherapy students, aligned with
the Karolinska Institutet Fysioterapeutprogrammet (1FY26). It installs on a phone and works offline.

Status: Phase 0 (Foundation) is done, and Phase 1 has started: the upper limb has 4 modules (shoulder girdle, arm and elbow, forearm and wrist, hand). All content is an unreviewed draft. Start reviewing with [docs/review-notes.md](docs/review-notes.md).

## Run it

Python 3 is all you need (Pillow only if you regenerate the icons).

```bash
python3 tools/build.py --serve
```

Then open http://localhost:8000. The build checks the content first and refuses to build if anything is wrong.

| Command | What it does |
|---|---|
| `python3 tools/build.py` | Check content and build the app into `dist/` |
| `python3 tools/build.py --check` | Check content only |
| `python3 tools/build.py --serve` | Build and serve `dist/` on port 8000 |
| `python3 -m unittest discover tests` | Test the content checks |
| `python3 tools/merge_drafts.py build/drafts/x.json` | Merge a drafted module (module, structures, questions, terms) into `content/` |
| `python3 tools/make_icons.py` | Redraw the app icons |

## Project layout

```
app/                 the web app (copied into dist/ by the build)
  index.html
  css/app.css
  js/app.js          all views; loads content.json at start
  sw.js              service worker (offline cache, versioned per build)
  manifest.webmanifest, icons/
content/             the learning content — the source of truth
  terms.json         trilingual dictionary
  structures.json    muscles, joints and nerves (datasheets)
  cranial-nerves.json
  modules.json       modules: body region, order, lessons, grouped datasheets
  questions.json     quiz questions with explanations
  ki-programme.json  KI 1FY26 courses, credits and topics
  taxonomy.json      dictionary categories, quiz topics, body regions
tools/build.py       content checks + build
tests/               tests for the content checks
prototype/           the v0.3 single-page prototype, kept for reference
docs/roadmap.html    the 13-month roadmap
```

## Content rules

The build fails unless all of these hold:

- Every learning text is a `{"hu": "…", "sv": "…"}` pair with **both** languages filled in.
- Names of structures, terms and cranial nerves have `la`, `hu` and `sv`.
- Ids are unique; every question link and module structure points at a record that exists.
- Every wrong answer of a multiple-choice question explains why it is wrong, in both languages.
- Every record has `review.status`: `draft`, `in-review` or `reviewed`. A `reviewed` record must name
  the reviewer (`review.by`) and the date (`review.date`). The app shows a "Vázlat · Utkast" badge on
  anything not yet reviewed.
- Every module has a body region, an order, a quiz topic with the same id, and (if it groups its datasheets) groups that list exactly its structures.
- KI semesters add up to 30 hp each and 180 hp in total.

Modules without a custom page get one automatically at `#modul-<id>`. Record ids are namespaced: `t.` terms, `m.` muscles, `art.` joints, `n.` nerves, `cn.` cranial nerves.

## Moving progress between devices

Progress lives in the browser. Until account-based sync exists, use **Statistics → Save to file** on one
device and **Load from file** on the other. Loading merges the two histories and never deletes anything.

## Publishing

`dist/` is a plain static site. Any static host works (GitHub Pages, Netlify, Cloudflare Pages).
The service worker only runs over HTTPS or on `localhost`.

## Known limits (Phase 0)

- Progress sync between devices is manual (file export/import). Account-based sync needs a backend
  (for example Supabase) and is the next infrastructure step.
- The AI tutor from the claude.ai prototype is not available in this version (roadmap Phase 7).
- `app/js/app.js` still uses the prototype's in-memory data shapes; `hydrate()` maps the content model
  onto them. New views should read `BUNDLE` directly.
- Swedish texts were machine-translated by Claude and need review by a Swedish-speaking physiotherapist.
