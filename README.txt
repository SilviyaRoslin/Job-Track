JOBTRACK — QUICK START (Windows + VS Code)
==========================================
A MERN job application tracker with secure sign-up/login, MongoDB storage, application CRUD, status filters, interview dates, notes, and analytics.

BEFORE YOU START
1. Install Node.js LTS (Node 20 or newer recommended).
2. Install MongoDB Community Server and make sure the MongoDB service is running. MongoDB Compass is optional; it can show the database.
3. Extract this ZIP anywhere, then open the extracted JobTrack folder in VS Code.

ONE-TIME SETUP
A) In VS Code, open Terminal > New Terminal. Run:
   cd server
   Copy-Item .env.example .env
   notepad .env
   In .env, replace JWT_SECRET with a long random private value. Save and close Notepad.
   npm install

B) Open a SECOND terminal in VS Code. Run:
   cd client
   npm install

RUN JOBTRACK (two terminals)
Terminal 1 — backend:
   cd server
   npm run dev

Terminal 2 — frontend:
   cd client
   npm run dev

Open the Local URL printed by Vite, usually http://127.0.0.1:5173

HEALTH CHECK
Open http://localhost:5000/api/health. Expected response:
   {"status":"ok","service":"JobTrack API"}

DATABASE
The app creates/uses the local MongoDB database named jobtrack. Collections are created as you register and save applications. User passwords are hashed; JWTs are used for authenticated API requests. Each account can only read/change its own applications.

TROUBLESHOOTING
- If backend says ECONNREFUSED or MongoDB server selection failed: start the MongoDB service, then rerun `npm run dev` in server.
- If port 5000 is already in use: close the other app using it, or change PORT in server/.env (then update VITE_API_URL in client/.env if you changed it).
- If PowerShell does not allow `Copy-Item`, create server/.env by manually copying server/.env.example and renaming the copy to .env.
- Keep both terminals running while using the app.
- Do not share server/.env or your JWT secret.

NOTES
- This project uses free local development components and does not require a paid API key.
- An internet connection may be needed for the first `npm install` and for the Google Fonts stylesheet; the app's core functionality does not depend on a paid external service.

EASIEST WINDOWS ROUTE
- Right-click Setup-JobTrack.ps1 and choose Run with PowerShell. It installs packages and creates the local server/.env.
- After setup completes, right-click Start-JobTrack.ps1 and choose Run with PowerShell. It opens separate backend and frontend terminals.
- If Windows blocks a script, open a VS Code terminal in the extracted JobTrack folder and run:
  powershell -ExecutionPolicy Bypass -File .\Setup-JobTrack.ps1
  then:
  powershell -ExecutionPolicy Bypass -File .\Start-JobTrack.ps1
