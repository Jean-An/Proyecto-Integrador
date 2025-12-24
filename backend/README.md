# CyberManager Backend

This is the REST API for CyberManager, built with Node.js, Express, TypeScript, Sequelize, and SQLite.

## Project Structure
- `src/config`: Database configuration.
- `src/controllers`: Request handlers.
- `src/models`: Sequelize model definitions.
- `src/routes`: API route definitions.
- `src/middleware`: Custom middleware (Auth, Error handling).

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   (This requires updating `package.json` to include the dev script)

3. **Build and Run**:
   ```bash
   npm run build
   npm start
   ```

## Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Resources
- `GET/POST /api/products`
- `GET/POST /api/categories`
- `GET/POST /api/clients`
- `GET/POST /api/providers`
- `GET/POST /api/transporters`
- `GET/POST /api/employees`
- `GET/POST /api/guides` (Includes Details, Entry/Exit info)
- `GET/POST /api/entry-guides`
- `GET/POST /api/exit-guides`
- `GET/POST /api/guide-details`

## Database
The SQLite database file will be created at `backend/database.sqlite` upon first run.
