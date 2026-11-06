# site-template-v2

Code-built SiteWyre site templates (no AI design pass). Design baked in from the test-roofing-co-2 build.

- `layout.html`: shared head, header (dropdown nav), footer, chat widget, sticky call bar.
- `home.html`, `service.html`, `area.html`, `gallery.html`, `blog.html`, `contact.html`: page bodies.
- `partials-*.html`: contact lead form, review panel (homepage).
- `css/style.css`: stylesheet; brand colors and fonts are filled into the CSS variables from the form.

Tokens: `{{name}}` is escaped text, `{{{name}}}` is HTML built by the SiteWyre "Render Site" step.
