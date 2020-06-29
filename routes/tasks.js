const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middlewares/auth");

// models
const User = require("../models/User");
const Task = require("../models/Task");

// @desc    Show Add Task Page
// @route   GET /dashboard
router.get("/add", ensureAuth, async (req, res) => {
  res.render("tasks/add");
});

// @desc    Show Add Task Page
// @route   GET /dashboard
router.post("/add", ensureAuth, async (req, res) => {
  try {
    // Get form data
    const formData = _.pick(req.body, [
      "title",
      "status",
      "description",
      "complete",
    ]);

    console.log("Is Completed: ", formData.complete);

    const newTask = {
      title: formData.title,
      status: formData.status,
      description: formData.description,
      isCompleted: formData.complete ? true : false,
      user: req.user.id,
    };

    const task = await Task.create(newTask);

    res.redirect("/dashboard");
  } catch (ex) {
    console.error(ex);
    return res.render("error/error500", {
      message: `Reason: ${ex.message}`,
    });
  }
});

module.exports = router;
