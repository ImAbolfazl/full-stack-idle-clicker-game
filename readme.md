# Full Stack Idle Clicker Game

A full-stack idle clicker game built with **ReactJS**, **NodeJS**, and **ExpressJS**. Users can click to earn points, buy shop items to boost their click multiplier and passive income (Points Per Second), and have their game progress automatically saved and loaded using a unique UUID stored in a persistent **SQLite** database.

## Features

- Persistent game saves using UUIDs & LocalStorage
- Automatic background saving every 30 seconds & on tab close
- SQLite database using `better-sqlite3`
- Active clicking with floating point animations
- Passive Points Per Second (PPS) idle progression
- Interactive item shop with hover overlays & bulk buying (`Shift + Click` to buy 10)
- Dynamic character evolution at milestone scores (Fury, ohnePixel, s1mple, donk)
- Custom large-number formatting up to Trigintillion
- Backend server built using ExpressJS
- Clean and beginner-friendly code structure

## Libraries used

### Frontend

- React
- Axios
- Tailwind CSS
- React Toastify

### Backend

- Node.js
- Express.js
- CORS
- Better-SQLite3
- Dotenv
- Crypto (Built-in UUID generation)

## Getting started with the project!

### Clone the Repository

```bash
git clone https://github.com/ImAbolfazl/your-repo-name/
cd your-repo-name
```

### Backend Setup

```bash
cd backend
npm install
node ./src/server.js
```

The backend will run on:

```text
http://localhost:8080
```
#### You can change the port from the .env file located in the backend folder 

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Make sure to create a `.env` file in your frontend folder with your backend URL:

```env
VITE_BACKEND_URL=http://localhost:8080
```

The frontend will run on:

```text
http://localhost:5173
```
edit the cors origin in the server.js file if you changed the frontend url.

## Game Endpoints

### Create a new game save

```http
POST /game/create
```

Request Body:

```json
{
  "points": 0,
  "shopInfo": "{\"Case\":{\"level\":0},\"GOLD\":{\"level\":0},\"Gloves!\":{\"level\":0},\"Knife!\":{\"level\":0},\"Blue Gem!\":{\"level\":0}}"
}
```

### Get an existing game save

```http
GET /game/get/:id
```

### Update an existing game save

```http
POST /game/update/:id
```

Request Body:

```json
{
  "points": 1500,
  "shopInfo": "{\"Case\":{\"level\":5},\"GOLD\":{\"level\":1},\"Gloves!\":{\"level\":0},\"Knife!\":{\"level\":0},\"Blue Gem!\":{\"level\":0}}"
}
```

## Learning Goals

This project was built to practice:

- REST APIs
- Persistent data storage with SQLite
- React state & ref management (`useState`, `useEffect`, `useRef`)
- Intervals and auto-saving mechanics
- HTTP requests with Axios & Fetch (`keepalive`)
- Express routing
- Full-stack application structure

## Author

Built by Abolfazl!