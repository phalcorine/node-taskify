const setGlobals = (req, res, next) => {
  // Set the global user object
  res.locals.user = req.user || null;

  // forward control
  next();
};

module.exports = {
  setGlobals,
};
