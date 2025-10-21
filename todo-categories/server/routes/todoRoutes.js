import express from "express";
import jwt from "jsonwebtoken";
import Todo from "../models/Todo.js";

const router = express.Router();

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

router.get("/", auth, async (req, res) => {
  const todos = await Todo.find({ userId: req.user.userId });
  res.json(todos);
});

router.post("/", auth, async (req, res) => {
  const todo = await Todo.create({ ...req.body, userId: req.user.userId });
  res.status(201).json(todo);
});

router.put("/:id", auth, async (req, res) => {
  const updated = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    req.body,
    { new: true }
  );
  res.json(updated);
});

router.delete("/:id", auth, async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
  res.json({ message: "Deleted" });
});

export default router;
