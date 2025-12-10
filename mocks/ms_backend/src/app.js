import express from "express";
import helmet from "helmet";
import healixExpress from "@dwtechs/healix-express";
import { listen } from '@dwtechs/servpico-express';
import { log } from "@dwtechs/winstan";
import { mockItems } from "./data/items.js";

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());

// Health check
app.use("/health", healixExpress);

// GET /items - Get all items
app.get("/items", (req, res) => {
  log.info(`${SERVICE_NAME}: GET /items - Returning ${mockItems.length} items`);
  res.json({
    success: true,
    data: mockItems,
    count: mockItems.length
  });
});

// GET /items/:id - Get item by ID
app.get("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = mockItems.find((i) => i.id === id);

  if (!item) {
    log.warn(`${SERVICE_NAME}: GET /items/${id} - Item not found`);
    return res.status(404).json({
      success: false,
      error: "Item not found"
    });
  }

  log.info(`${SERVICE_NAME}: GET /items/${id} - Item found: ${item.name}`);
  res.json({
    success: true,
    data: item
  });
});

// POST /items - Create new item
app.post("/items", (req, res) => {
  const newItem = {
    id: mockItems.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockItems.push(newItem);
  log.info(`${SERVICE_NAME}: POST /items - Created item: ${newItem.name}`);

  res.status(201).json({
    success: true,
    data: newItem
  });
});

// PUT /items/:id - Update item
app.put("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockItems.findIndex((i) => i.id === id);

  if (index === -1) {
    log.warn(`${SERVICE_NAME}: PUT /items/${id} - Item not found`);
    return res.status(404).json({
      success: false,
      error: "Item not found"
    });
  }

  mockItems[index] = {
    ...mockItems[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString()
  };

  log.info(`${SERVICE_NAME}: PUT /items/${id} - Item updated: ${mockItems[index].name}`);
  res.json({
    success: true,
    data: mockItems[index]
  });
});

// DELETE /items/:id - Delete item
app.delete("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockItems.findIndex((i) => i.id === id);

  if (index === -1) {
    log.warn(`${SERVICE_NAME}: DELETE /items/${id} - Item not found`);
    return res.status(404).json({
      success: false,
      error: "Item not found"
    });
  }

  const deletedItem = mockItems.splice(index, 1)[0];
  log.info(`${SERVICE_NAME}: DELETE /items/${id} - Item deleted: ${deletedItem.name}`);

  res.json({
    success: true,
    data: deletedItem
  });
});

// PATCH /items/:id - Partial update
app.patch("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockItems.findIndex((i) => i.id === id);

  if (index === -1) {
    log.warn(`${SERVICE_NAME}: PATCH /items/${id} - Item not found`);
    return res.status(404).json({
      success: false,
      error: "Item not found"
    });
  }

  mockItems[index] = {
    ...mockItems[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString()
  };

  log.info(`${SERVICE_NAME}: PATCH /items/${id} - Item patched: ${mockItems[index].name}`);
  res.json({
    success: true,
    data: mockItems[index]
  });
});

// Start server
listen(app);
