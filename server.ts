import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { Character, Letter, SystemNotification, AppData } from "./src/types.js";

// Setup __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "db.json");

// Middleware
app.use(express.json());

// Initialize db.json if not present
function initDb() {
  if (!fs.existsSync(DB_PATH)) {
    const initialData: AppData = {
      characters: [],
      letters: [],
      notifications: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
  }
}

// Helper to read db.json safely
function readDb(): AppData {
  try {
    initDb();
    const content = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(content) as AppData;
  } catch (error) {
    console.error("Error reading database:", error);
    return { characters: [], letters: [], notifications: [] };
  }
}

// Helper to write db.json safely
function writeDb(data: AppData) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

// API Routes
app.get("/api/data", (req, res) => {
  const db = readDb();
  res.json(db);
});

app.post("/api/characters", (req, res) => {
  const { name, categories, backstory, openingMessage, chatLink } = req.body;
  if (!name || !categories || !backstory || !openingMessage || !chatLink) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const db = readDb();
  const newChar: Character = {
    id: "char_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    name,
    categories: Array.isArray(categories) ? categories : [categories],
    backstory,
    openingMessage,
    chatLink,
    heartsCount: 0,
    createdAt: new Date().toISOString()
  };

  db.characters.push(newChar);

  // Auto-generate notification
  const newNotif: SystemNotification = {
    id: "notif_" + Date.now(),
    message: `Nhân vật mới "${name}" vừa được tạo! Hãy đến trò chuyện ngay nào.`,
    characterId: newChar.id,
    createdAt: new Date().toISOString()
  };
  db.notifications.unshift(newNotif);

  // Keep notifications under 50 items
  if (db.notifications.length > 50) {
    db.notifications = db.notifications.slice(0, 50);
  }

  writeDb(db);
  res.status(201).json({ character: newChar, notification: newNotif });
});

app.delete("/api/characters/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.characters.findIndex((c) => c.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Character not found" });
    return;
  }

  const deletedChar = db.characters[index];
  db.characters.splice(index, 1);
  writeDb(db);
  res.json({ success: true, message: `Deleted character: ${deletedChar.name}` });
});

app.post("/api/characters/:id/like", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const char = db.characters.find((c) => c.id === id);
  if (!char) {
    res.status(404).json({ error: "Character not found" });
    return;
  }

  char.heartsCount += 1;
  writeDb(db);
  res.json(char);
});

app.post("/api/comments", (req, res) => {
  const { author, content, theme } = req.body;
  if (!content) {
    res.status(400).json({ error: "Content is required" });
    return;
  }

  const db = readDb();
  const newLetter: Letter = {
    id: "letter_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    author: author || "Ẩn danh",
    content,
    theme: theme || "pink",
    createdAt: new Date().toISOString()
  };

  db.letters.unshift(newLetter);
  writeDb(db);
  res.status(201).json(newLetter);
});

// Setup dev server or static distribution
async function startServer() {
  initDb();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
