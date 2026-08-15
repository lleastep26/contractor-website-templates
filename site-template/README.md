# Universal Contractor Site Template — Token Reference

This is a static, 6-page HTML/CSS/JS template. It's not meant to be opened
and used as-is — it has placeholder tokens in it that the future
**Template Assembly** node (a Code node in n8n) will replace with real
data from the four AI agents before the site gets deployed.

Design concept: an "estimate ticket" motif (dashed tear lines, mono
ticket tags, corner-notch cards) since it's grounded in how contractors
already think — job tickets, estimates, work orders. Brand color is
injected per-contractor, so it's the one thing every site will look
different by.

## Files

```
index.html          Home
services.html        Services
gallery.html          Gallery (placeholder tiles — see note below)
service-areas.html   Service Areas
blog.html            Blog / SEO articles
contact.html         Contact
css/style.css        Shared design system (all pages link to this)
js/main.js           Nav toggle, chat widget, form handling (no backend wired yet)
```

## Simple tokens (`{{token_name}}`)

Replace directly with a value, or with an empty string if the value is null
(the copy is written to read naturally even when a field's missing).

| Token | Source agent | Field |
|---|---|---|
| `{{business_name}}` | Intake | business_name |
| `{{trade}}` | Intake | trade |
| `{{phone_display}}` | Intake | phone_display |
| `{{phone_tel}}` | Intake | phone_tel |
| `{{email}}` | Intake | email |
| `{{city}}` | Intake | city |
| `{{years_in_business}}` | Intake | years_in_business |
| `{{license_number}}` | Intake | license_number |
| `{{business_description}}` | Intake | business_description |
| `{{primary_color_hex}}` | Intake | primary_color_hex (used in CSS only) |
| `{{accent_color_hex}}` | Intake | accent_color_hex (used in CSS only) |
| `{{headline}}`, `{{subheadline}}`, `{{about_text}}`, `{{cta_headline}}`, `{{cta_subtext}}`, `{{quote_button_text}}`, `{{chat_widget_greeting}}` | Content Generation | same field names |
| `{{services_headline}}`, `{{services_subheadline}}` | Services Content | same field names |
| `{{service_areas_headline}}`, `{{service_areas_subheadline}}` | Service Areas | same field names |

## Loop blocks (`<!-- LOOP:name --> ... <!-- ENDLOOP:name -->`)

Everything between the markers is one repeatable "row" template. For each
item in the array, render a copy of that block with its tokens filled in,
then join them and replace the whole `LOOP...ENDLOOP` region with the
result.

| Loop name | Source | Array field | Tokens inside the block |
|---|---|---|---|
| `service_area_cities` | Intake | service_area_cities (plain string array) | `{{item}}` |
| `testimonials` | Content Generation | testimonials | `{{text}}`, `{{name}}` |
| `services_preview` | Services Content | **first 3 items** of `services` | `{{service_number}}`, `{{title}}`, `{{description}}` |
| `services` | Services Content | services (full list) | `{{service_number}}`, `{{title}}`, `{{description}}` |
| `areas` | Service Areas | areas | `{{city}}`, `{{blurb}}` |
| `blog_posts` | Blog SEO | blog_posts | `{{title}}`, `{{slug}}`, `{{meta_description}}`, `{{target_keyword}}`, `{{body}}` |

Notes for the Assembly node:
- `service_area_cities` is a **plain array of strings**, so its loop uses
  the generic `{{item}}` token instead of a named field.
- `services_preview` on the homepage isn't its own agent output — slice
  the first 3 entries of the Services Content Agent's `services` array
  before rendering it into `index.html`.
- `service_number` isn't produced by any agent — generate it yourself
  while looping (e.g. `SVC-01`, `SVC-02`, ...) and add it to each item
  before rendering.

## Conditional blocks (`<!-- IF:field --> ... <!-- ENDIF:field -->`)

Used for `years_in_business` and `license_number`, since both are
allowed to be null and shouldn't show placeholder-ish empty text if so.
If the field is null/empty, strip the entire block including the
markers. If it has a value, keep the block and fill its tokens normally.

## Known follow-ups (not built into this version)

- **Brand button text color** (`--brand-ink` in `style.css`) is hardcoded
  to white. A nicer version computes the luminance of `primary_color_hex`
  and sets it to black or white so light brand colors stay legible —
  worth adding when we build Template Assembly.
- **Gallery page** uses placeholder tiles, not real photos, since a
  brand-new contractor won't have any yet. Revisit once there's a way
  to collect real job photos.
- **Blog page** currently renders all articles as expandable sections on
  one page. Since each already has its own `slug` and `meta_description`,
  a stronger version generates one standalone HTML file per article
  (e.g. `blog/{{slug}}.html`) for better individual-page SEO.
- **Contact page map** is a placeholder div — no address/geocoding is
  collected yet, so there's nothing real to embed.
