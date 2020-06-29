const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middlewares/auth");

// models
const User = require("../models/User");
const Task = require("../models/Task");

// @desc    Login/Landing Page
// @route   GET /
router.get("/", ensureGuest, async (req, res) => {
  res.render("login", {
    layout: "auth",
  });
});

// @desc    Dashboard Page
// @route   GET /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    }).lean();

    const taskCount = tasks.length;

    res.render("dashboard", {
      name: req.user.displayName,
      tasks: tasks,
      taskCount: taskCount,
    });
  } catch (ex) {
    console.error(ex);
    return res.render("error/error500", {
      message: `Reason: ${ex.message}`,
    });
  }
});

module.exports = router;
