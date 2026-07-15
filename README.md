# Flow — Income & Expense Tracker

A dark, real-time income/expense tracker built as an installable PWA. Watch your net income tick up (or down) live, track recurring income/expenses, log one-off transactions, and set a monthly budget.

## Install on your iPhone

1. Open the deployed site URL in **Safari** on your iPhone (Chrome can't create a full-screen home-screen app on iOS — this is an Apple platform restriction, not a Chrome limitation).
2. Tap the **Share** icon, then **Add to Home Screen**.
3. Launch it from the new home screen icon — from then on it opens full-screen, no browser UI, and works offline.

All data is stored locally on-device (localStorage) — nothing is sent to a server.

## Features

- **Live ticking counter** — a hero number that counts up (or down) in real time based on your net recurring income/expense rate, plus any one-off transactions.
- **Recurring items** — add income or expenses on a per-second, hourly, daily, weekly, monthly, or yearly cadence.
- **One-off transactions** — quickly log ad-hoc income or expenses.
- **Period selector** — view second / hour / day / week / month / year. Day and larger periods support a **So far** (since the start of that period, e.g. since midnight) vs **Total** (trailing window, e.g. last 24 hours) toggle.
- **Budget** — set a monthly spending limit and track a live progress bar against month-to-date expenses.
- Amounts are formatted in AUD.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (tsc + vite build), outputs to dist/
npm run preview  # preview the production build
```

Built with React, TypeScript, Vite, Tailwind CSS, and `vite-plugin-pwa`.

App icons are generated from `scripts/gen_icons.py` (requires Pillow: `pip install Pillow`) into `public/icons/`.
