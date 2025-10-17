# Blogging App (Client)

This is the client-side React application for a blogging platform built with Vite, React and Tailwind CSS.

## Quick start

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build (after build completes):

```bash
npm run preview
```

## Project structure (important files)

- `index.html` — entry HTML. The Google Font (Rubik) is loaded here via `<link>` preconnect & stylesheet.
- `src/main.jsx` — React entry file.
- `src/index.css` — global CSS (Tailwind import and global font-family).
- `src/components/layout/Navbar.jsx` — top navigation; it uses `NavLink` to show active links.
- `src/pages/Home.jsx` — Homepage and hero. The hero uses a blob-clipped image and decorative bubbles.
- `public/` — static assets that are served at the root (place `Woman.jpeg` here to use the local hero image).


## Fonts

The project currently loads the `Rubik` font via Google Fonts in `index.html`. To switch fonts:

- Get the font embed link from https://fonts.google.com
- Replace the `<link href="...">` in `index.html`
- Update `font-family` in `src/index.css` if necessary.

## Active navigation

`Navbar.jsx` uses `NavLink` from `react-router-dom` and applies `text-primary font-semibold` to the active route. Customize the active styles there.

## Troubleshooting

- If local images don't appear, ensure they are in the `public/` directory and referenced with `/filename.ext`.
- If Tailwind utilities aren't working, verify Tailwind is configured and postcss is set up (check `tailwind.config.js` and `postcss.config.js` if present).

## Next improvements (ideas)

- Add image preload and font preloading for better LCP.
- Extract the blob SVG into a reusable component.
- Add tests for critical UI components.

If you want, I can also add instructions for running lint/format or include scripts for Docker deployment.
