const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

function load() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, doneCb) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({
            googleId: profile.id,
          });

          if (user) {
            doneCb(null, user);
          } else {
            user = User.create(newUser);
            doneCb(null, user);
          }
        } catch (ex) {
          console.error(ex);
        }
      }
    )
  );

  passport.serializeUser((user, doneCb) => {
    doneCb(null, user.id);
  });

  passport.deserializeUser((id, doneCb) => {
    User.findById(id, (err, user) => doneCb(err, user));
  });
}

module.exports = load;
