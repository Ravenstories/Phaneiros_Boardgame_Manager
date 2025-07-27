# Phaneiros Boardgame Manager

This project contains a small Node.js/Express backend and static frontend for tracking boardgame sessions.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root and add the following required variable:
   ```
   JWT_SECRET=yourSecret
   ```
   The server will throw an error at startup if `JWT_SECRET` is missing.
   You may also supply `SUPABASE_URL` and `SUPABASE_KEY` when using Supabase features.
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Run tests:
   ```bash
   npm test