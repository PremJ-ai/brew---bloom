import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const app = express();
const PORT = process.env.PORT || 4000;
const PYTHON_URL = process.env.PYTHON_URL || "http://localhost:8000";
const DATA_FILE = path.resolve("data/reservations.json");

app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

const menu = {
  coffee: [
    ["House Cappuccino", "Double espresso, silky milk, cocoa dust", "₹180"],
    ["Honey Cinnamon Latte", "Espresso, steamed milk, local honey", "₹220"],
    ["Cold Brew", "18-hour steep, smooth & chocolatey", "₹190"],
    ["Orange Americano", "Espresso, sparkling orange, ice", "₹210"]
  ],
  breakfast: [
    ["Avocado Sourdough", "Smashed avocado, lemon, chili, seeds", "₹320"],
    ["Berry Granola Bowl", "Greek yogurt, berries, toasted granola", "₹280"],
    ["Butter Croissant", "Classic laminated pastry, baked fresh", "₹150"],
    ["Mushroom Toast", "Garlic mushrooms, ricotta, herbs", "₹290"]
  ],
  lunch: [
    ["Roasted Veg Sandwich", "Focaccia, roast vegetables, pesto", "₹340"],
    ["Pesto Pasta", "Basil pesto, parmesan, cherry tomatoes", "₹390"],
    ["Green Goddess Salad", "Leaves, avocado, seeds, herb dressing", "₹320"],
    ["Tomato Melt", "Sourdough, aged cheddar, tomato jam", "₹280"]
  ],
  sweet: [
    ["Cinnamon Roll", "Brown sugar, cinnamon, vanilla glaze", "₹170"],
    ["Basque Cheesecake", "Creamy center, caramelized top", "₹260"],
    ["Dark Chocolate Tart", "70% cocoa, sea salt, cream", "₹240"],
    ["Lemon Loaf", "Bright lemon, butter, sugar glaze", "₹160"]
  ]
};

async function readReservations() {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, "[]", "utf8");
    return [];
  }
}

async function writeReservations(items) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
}

app.get("/health", (_req, res) => {
  res.json({ service: "node-api", status: "ok", python_service: PYTHON_URL });
});

app.get("/api/menu", (_req, res) => {
  res.json(menu);
});

app.post("/api/reservations", async (req, res) => {
  const { name, guests, date, time, notes = "" } = req.body ?? {};
  if (!name || !guests || !date || !time) {
    return res.status(400).json({ message: "Name, guests, date and time are required." });
  }

  const reservation = {
    id: randomUUID().slice(0, 8),
    name: String(name).trim(),
    guests: String(guests),
    date: String(date),
    time: String(time),
    notes: String(notes).trim(),
    createdAt: new Date().toISOString()
  };

  const items = await readReservations();
  items.push(reservation);
  await writeReservations(items);
  return res.status(201).json(reservation);
});

app.get("/api/reservations", async (_req, res) => {
  res.json(await readReservations());
});

app.get("/api/insights", async (_req, res) => {
  const reservations = await readReservations();
  try {
    const response = await fetch(`${PYTHON_URL}/insights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservations })
    });
    if (!response.ok) throw new Error(`Python service returned ${response.status}`);
    return res.json(await response.json());
  } catch (error) {
    return res.status(503).json({ message: "Analytics service unavailable", detail: error.message });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error" });
});

app.listen(PORT, () => {
  console.log(`Brew & Bloom Node API running at http://localhost:${PORT}`);
});
