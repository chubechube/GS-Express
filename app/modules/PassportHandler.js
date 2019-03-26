const passport 				= require('passport');
const passportJWT 			= require("passport-jwt");
const JwtStrategy 			= require('passport-jwt').Strategy;
const ExtractJwt			= require('passport-jwt').ExtractJwt; 


class PassportHandler{
constructor(dbUserHandler){
	this.dbUserHandler = dbUserHandler;
	console.log("creating the JWT Strategy");
	var opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = process.env.JWTSECRET;

	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		
		var userPromise = dbUserHandler.findUserByName(jwt_payload.id);
		

		userPromise.then(function(foundUser,err){

			if (err) {
				console.log("err -> "+err);
				return done(err, false);
			}
			if (foundUser) {
				console.log("user ok");
				return done(null, foundUser);
			} else {
				console.log("user not ok");
				return done(null, false);
				// or you could create a new account
			}
		
	})
	}));


	
        this.passport = passport;

}

setSerialization(){
        passport.serializeUser(function(user, done) {
        done(null, user[0].id);
        });

        passport.deserializeUser(function(user, done) {
        done(null, user);
        });
    }   
}

module.exports = PassportHandler;