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

// @desc        Show all tasks
// @route       GET /tasks/add
router.get("/tasks", ensureAuth, async (req, res) => {
  try {
    // Fetch all public tasks
    const tasks = await Task.find({
      status: "public",
    })
      .populate("user")
      .sort({
        createdAt: "desc",
      })
      .lean();

    const user = req.user.toObject();

    // Response
    res.render("tasks/index", {
      tasks: tasks,
      loggedUser: user,
    });
  } catch (ex) {
    // Handle exceptions
    console.error(ex);
    return res.render("error/503", {
      message: `Reason: ${ex.message}`,
    });
  }
});

module.exports = router;
