# pranali

Front end for **Pranali Space** — a South Asian platform for exploring different ways of
living, learning and relating to our world. It brings together community, indigenous
knowledge, ecology, climate justice, spirituality, food, culture, learning and retreats
in one space.

Built to feel less like an organisation's website and more like a contemporary South
Asian community, learning and cultural space.

## Status

Front end only. **No backend yet** — the backend will be chosen once the design is
settled. Plain HTML, CSS and JavaScript; no build step and no framework.

## Running it

```bash
python devserver.py 5173
```

Then open <http://localhost:5173>.

`devserver.py` is a plain static server that exists for one reason: it sends
`Cache-Control: no-store`. The stock `python -m http.server` sends no cache headers at
all, so browsers cache JS and CSS heuristically and keep serving stale files after an
edit — which looks exactly like "my change didn't work". With this, a plain refresh is
always enough.

Opening `index.html` directly from the file system will not work properly — the pages
fetch their CSS, JS and mask images as separate requests, which `file://` restricts.
Use the server.

## Layout

```
index.html        home — the five elements, the scroll stage, threads, gatherings, journal
courses.html      course library, category filters, membership pricing, bursary
course.html       a single course (?id=…), free in full or members-only behind a paywall

css/styles.css    tokens, shared chrome, the element stage
css/pages.css     courses, membership, member voices, photo marquee

js/data.js        all content: courses, categories, plans, testimonials
js/auth.js        DEMO membership only — see the warning below
js/site.js        nav, anchor scrolling, header membership badge
js/main.js        home page: the five elements and the scroll animation
js/courses.js     course library, filtering, the pretend join flow
js/course.js      a single course page
js/social.js      member testimonials and the scrolling photo strip

images/1–5.png    the five element marks (Air, Fire, Space, Water, Earth)
images/stock/     photographs — Unsplash licence, plus Pranali's own garden
```

### The five elements

Left to right, matching what each mark depicts: **Air · Fire · Space · Water · Earth**,
with Space (the spiral) in the centre and selected by default. Choosing one re-tints the
page, swaps the hero copy, and filters the cards below to that strand.

The marks are rendered as CSS masks rather than `<img>`, so they take the element's
colour and stay crisp while the scroll animation scales them. Swapping the PNGs for SVGs
later is a one-line change in `iconSrc()` in `js/main.js`.

## ⚠️ There is no real authentication

`js/auth.js` fakes the *shape* of a membership so the interface can be designed and
clicked through. A "member" is an object in `localStorage`; anyone who opens devtools can
award themselves any tier. Nothing is charged and no account exists.

Deliberately, there is **no password field and no card field anywhere** in this
prototype. A static page collecting either would look exactly like the real thing and has
nowhere safe to put it. When a real backend arrives, sign-in and payment move there and
`js/auth.js` is deleted rather than extended.

## Membership model (as designed)

| Tier | Price | Access |
| --- | --- | --- |
| Two Threads | $9/month, billed annually at $96 | Any 2 course categories, community access, one live session per season |
| Whole Weave | $19/month, billed annually at $190 | All five categories, monthly live sessions, downloadable resources, full community access |

One course — *Reading a Field* — is **always free and public**, with no login or payment,
so visitors can judge the platform before subscribing. A reduced-rate/bursary option is
handled by request to a person, not by an automated form.

## Palette

| Role | Tone | Hex | Where it is used |
| --- | --- | --- | --- |
| Primary base | Tree Green | `#0F5E36` | Headings and primary focal elements — the free-course flag, the featured plan, membership status |
| Primary accent | Crimson Red | `#DC143C` | Interactive states and calls to action — buttons, hovers, active filters, focus rings |
| Secondary accent | Burgundy Brown | `#763939` | Structural borders, metadata, eyebrow labels and subheadings |
| Background | Warm off-white | `#FAF7F2` | The canvas, with `#F3EDE3` for raised panels |

Components refer to role tokens (`--heading`, `--interactive`, `--structure`) rather
than to colours directly, so the palette can move in one place.

Two notes on the implementation:

- `--crimson-ink` (`#C8102E`) exists because brand crimson reads 4.29:1 on the warm
  panel tone, just under the 4.5 needed for body-size text. Links and small labels use
  the deeper tone; fills and buttons keep the brand crimson.
- The five elements still tint their own surfaces — the travelling mark, the stage
  wash, the rail — but no longer repaint the site chrome. Earth is the brand green and
  Space the brand burgundy; Air and Fire are deepened from their original tones so a
  selected element's label stays legible.

## Credits

Photographs in `images/stock/` are Unsplash licence, except `courses_pranali.jpg` and
`home_page_thumbnai.jpg`, which are Pranali Space's own garden in Kathmandu.

## Hosting

The site is fully static — HTML, CSS, JS and images, nothing server-side. It can be
served by GitHub Pages (or any static host) straight from the repository root, with no
build step and without `devserver.py`, which is a local development convenience only.

To publish on GitHub Pages: **Settings → Pages → Source: Deploy from a branch →
`main` / `/ (root)`**.

All asset paths are relative, so the site works from a project sub-path such as
`https://<user>.github.io/pranali/` as well as from a custom domain. The empty
`.nojekyll` file stops GitHub from running the pages through Jekyll.
