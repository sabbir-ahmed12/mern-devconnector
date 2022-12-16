const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

module.exports = (passport) =>
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      const user = await User.findOne({ email: jwt_payload.email }).exec();

      if (!user) {
        return done(null, false);
      }
      // console.log(user);
      return done(null, user);
    })
  );
