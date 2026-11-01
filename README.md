# Board Game Inventory

React + Vite app that reads and writes board games in a Firebase Realtime Database.

## Run it

1. `npm install`
2. `npm run dev`

## Firebase

- Database URL is in `src/firebase-config.js`
- Import `firebase-games-seed.json` at the database root (three-dot menu, Import JSON)
- Rules need read and write allowed

## Features

- GET: games load from Firebase on start
- POST: add a game (name, categories, image URL) with validation
- PATCH: change a rating and log when a game was last played and with how many people
- Custom hooks: `useHttp` and `useInput`
- NEW: search and category filter, games can have more than one category

## Netlify

- Build command `npm run build`, publish directory `dist`
- Image file names are case sensitive on Netlify
