# Hive & Honey · Leicester

Speculative demo site for Hive & Honey, the cocktail bar and sharing-plates restaurant at 42 Silver Street, Leicester.
Front end only: static data, no backend.

Vite, React, TypeScript, Framer Motion, HashRouter.

## Run

```sh
npm install
npm run dev       # local dev server
npm run build     # typecheck + build into docs/ (what GitHub Pages serves)
```

## Demo any day and time

The "Right now" status runs on London time. Add `?at=` to show another moment:

- `?at=fri-19:30` kitchen and bar both on
- `?at=wed-15:30` between services
- `?at=sat-00:45` after midnight, so it counts as Friday night
- `?at=mon-11:00` Monday daytime
- `?at=sun-14:00` closed Sundays

## Where things live

- `src/data/menu.ts`: the menu, transcribed from the venue's own /eat and /drink pages (source text in `intake/`, not published)
- `src/data/venue.ts`: address, contact, hours, reviews
- `src/lib/time.ts`: opening-hours logic behind "Right now"
- `src/lib/booking.ts`: booking slots and the pre-filled email
- `scripts/media.mjs`: resizes photos from `public/media/` into `public/img/` (`npm run media`)
- `scripts/og.mjs`: builds `public/og.jpg`, the favicons and the footer monogram (`node scripts/og.mjs`)

## Deploy

GitHub Pages serves the `docs/` folder of this branch. Run `npm run build` and commit `docs/`.
Link-preview tags point at `https://alexwilder-dev.github.io/hive-and-honey/`, so the repository should be named `hive-and-honey`.

Site by AlexWilder-Dev
