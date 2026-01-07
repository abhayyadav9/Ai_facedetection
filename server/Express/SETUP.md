# Express Server Setup & Installation Guide

## Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation Steps

1. **Navigate to the Express server directory:**
   ```sh
   cd server/Express
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```
   This will install `express` and `mongoose` as listed in `package.json`.

3. **Start the server:**
   ```sh
   node index.js
   ```
   The server will start on port 3000 (or the port set in the `PORT` environment variable).

4. **Test the server:**
   Open your browser and go to [http://localhost:3000](http://localhost:3000). You should see:
   > Express server is running!

## Project Structure
- `index.js`: Main entry point for the Express server.
- `package.json`: Lists dependencies and scripts.

---

**Troubleshooting:**
- If you get a 'command not found' error, ensure Node.js and npm are installed and available in your PATH.
- If the port is already in use, set a different port by running:
  ```sh
  set PORT=4000 && node index.js
  ```
  (On Windows PowerShell)

---

For further development, add your routes and logic in `index.js` or split into separate files as needed.
