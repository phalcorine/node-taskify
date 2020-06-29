const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/");
};

const ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  }

  return next();
};

module.exports = {
  ensureAuth,
  ensureGuest,
};
