const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportJWT = require("passport-jwt");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "account",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, account, password, cb) => {
      User.findOne({ where: { account } }).then((user) => {
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password).then((res) => {
          if (!res) return done(null, false);
          return cb(null, user);
        });
      });
    }
  )
);

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JWTStrategy(jwtOptions, (jwtPayload, done) => {
    User.findByPk(jwtPayload.id)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then((user) => {
    user = user.toJSON();
    return cb(null, user);
  });
});
module.exports = passport;
