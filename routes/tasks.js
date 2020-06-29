const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middlewares/auth");

// models
const User = require("../models/User");
const Task = require("../models/Task");
const { translateAliases } = require("../models/User");

// @desc    Show Single Task Page
// @route   GET /:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    // Fetch a task by ID token
    let task = await Task.findById(req.params.id).populate("user").lean();

    // Return an error response if a task was not found
    if (!task) {
      return res.render("error/show404", {
        message: `A task with the given Id token was not found...`,
      });
    }

    // Check if the task is private to the logged in user
    if (task.status == "private") {
      if (task.user._id != req.user.id) {
        return res.redirect("/dashboard", {
          message: "Can not view private task",
        });
      }
    }

    console.log("Task: ", task);

    const user = req.user;

    // Return response
    res.render("tasks/show", {
      task: task,
      user: user,
    });
  } catch (ex) {
    // Handle exceptions
    console.error(ex);
    return res.render("error/show500", {
      message: `Reason: ${ex.message}`,
    });
  }
});

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
    return res.render("error/show500", {
      message: `Reason: ${ex.message}`,
    });
  }
});

// @desc    Show Edit Task Page
// @route   GET /tasks/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    // Attempt to find task by ID
    const task = await Task.findById(req.params.id).lean();

    // Return an error response if the task was not found
    if (!task) {
      return res.render("error/show404", {
        message: `A task with the specified ID token was not found`,
      });
    }

    // Return an error response if its not the logged user's task
    if (task.user != req.user.id) {
      console.log("Task user ID: ", task.user);
      console.log("Logged user ID: ", req.user.id);
      return res.redirect("/tasks");
    }

    // Return response
    res.render("tasks/edit", {
      task: task,
    });
  } catch (ex) {
    // Handle exceptions
    console.error(ex);
    return res.render("error/show500", {
      message: `Reason: ${ex.message}`,
    });
  }
});

// @desc    Update Task
// @route   PUT /tasks/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    // Fetch task by ID token
    let task = await Task.findById(req.params.id);

    // Return error response if task was not found
    if (!task) {
      return res.render("error/show404", {
        message: `A task with the given ID token was not found`,
      });
    }

    // Redirect if the user is not the owner of the task
    if (task.user != req.user.id) {
      return res.redirect("/tasks");
    }

    // Get form data
    const formData = _.pick(req.body, [
      "title",
      "status",
      "description",
      "complete",
    ]);

    // Attempt to update the task and save
    task.set({
      title: formData.title,
      status: formData.status,
      description: formData.description,
      isCompleted: formData.complete ? true : false,
    });
    await task.save();

    res.redirect("/dashboard");
  } catch (ex) {
    console.error(ex);
    return res.render("error/show500", {
      message: `Reason: ${ex.message}`,
    });
  }
});

// @desc    Delete Task
// @route   DELETE /tasks/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    // Fetch a task by ID token
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.render("error/show404", {
        message: "A task with the given ID toekn was not found...",
      });
    }

    // Attempt to delete the task
    await task.remove();

    res.redirect("/dashboard");
  } catch (ex) {
    console.error(ex);
    return res.render("error/show500", {
      message: `Reason: ${ex.message}`,
    });
  }
});

// @desc    Show User Tasks Page
// @route   GET /tasks/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    // Fetch all tasks public tasks created by user
    const tasks = await Task.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();

    // User object
    const user = req.user;

    // Return response
    res.render("tasks/user", {
      tasks: tasks,
      user: user,
    });
  } catch (ex) {
    console.error(ex);
    return res.render("error/show500", {
      message: `Reason: ${ex.message}`,
    });
  }
});

module.exports = router;
