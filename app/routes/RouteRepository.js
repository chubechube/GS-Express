//Site Route repository
const	parseurl 		= require('parseurl');
const	PassportHandler = require('../modules/PassportHandler');		
const 	flash         	= require('express-flash');
const   jwt 			= require("jsonwebtoken"); 
const 	allGreen		= false;





function setRoutes(self){
var self  = self;
//Middleware for all Routes
// Add headers
self.router.use(function (req, res, next) {

    // Website you wish to allow to connect

	res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

self.router.all("*", function (req, res, next) {
		console.log('Someone made a request! '+req.toString());
		console.log('%s %s %s', req.method, req.url, req.path);
		
				
			next();
		
	});

	// START SWIMMING POOL END POINTS
		//List of SwimmingPools or single SwimmingPool info GET
		//self.router.get('/swimmingpools',self.passportHandler.passport.authenticate('jwt', { session: false }),function(req,res){
			self.router.get('/swimmingpools',function(req,res){
			
			function showUSwimmingPool(allSwimmingPools){
				console.log(allSwimmingPools);
				res.json(allSwimmingPools);
			}
	
			if(req.query.swimmingPoolName == null){
				var promisedSwimmingPoolList = self.dbSwimmingPoolHandler.getAllSwimmingPool();
				promisedSwimmingPoolList.then(function(allUsers){
	
					showUSwimmingPool(allUsers);
					
				}).catch(function(err){
				console.log(err)})
				}else{
	
					var promisedSwimmingPoolList = self.dbSwimmingPoolHandler.findSwimmingPoolByName(req.query.swimmingPoolName);
	
					promisedSwimmingPoolList.then(function(foundSwimmingPool){
	
						showUSwimmingPool([foundSwimmingPool]);
					
				}).catch(function(err){
				console.log(err)})
				}
	
	
		});
	//Insert Swimming Pool Route POST
	self.router.post('/swinsert',function(req, res) {
	
		var promisedSwimmingPool=self.dbSwimmingPoolHandler.createSwimmingPool(req.body.swimmingPoolName,
			req.body.swimmingPoolEmail,
			req.body.swimmingPoolAddress1,
			req.body.swimmingPoolProvince,
			req.body.swimmingPoolRegion,
			req.body.swimmingPoolCountry,
			req.body.swimmingPoolType);
			promisedSwimmingPool.then(function(createdSwimmingPool){
					res.send("User created"+createdSwimmingPool);
			}
		).catch(function(err){
			console.log(err);
			return res.status(400).send({
				message: err
				});
		
		});
	})
	
	// END SWIMMING POOL END POINTS
	

// START USER END POINTS
	//Insert User Page Route POST
  	self.router.post('/insert',function(req, res) {
	
	var promisedUser=self.dbUsersHandler.createUser(req.body.userName,req.body.userEmail,req.body.userPassword);
		promisedUser.then(function(createdUSer){
				res.send("User created"+createdUSer);
		}
	).catch(function(err){
		console.log(err);
		return res.status(400).send({
			message: err
		  });
	
	});
	 
	   
  });

	//List of Users Page or single user info GET
	self.router.get('/users',self.passportHandler.passport.authenticate('jwt', { session: false }),function(req,res){
		console.log("userName =" +req.query.userName);
		function showUsers(allUsers){
			console.log(allUsers);
			res.json(allUsers);
		}

		if(req.query.userName == null){
			var promisedUsersList = self.dbUsersHandler.getAllUser();
			promisedUsersList.then(function(allUsers){

					showUsers(allUsers);
				
			}).catch(function(err){
			console.log(err)})
			}else{

				var promisedUser = self.dbUsersHandler.findUserByName(req.query.userName);

				promisedUser.then(function(foundUser){

					//showUsers([foundUser]);
					if(self.dbUsersHandler.validPassword(foundUser[0].userPassword,req.query.userPassword)){
						var payload = {
							id: foundUser[0].userName
						};
						var token = jwt.sign(payload, process.env.JWTSECRET,{
							expiresIn: 600 // in seconds
						  });
						res.json({
							token: token
						});
					}else{
						res.status(403).send({
							error: 'Incorrect password'
						  });
					}
				
			}).catch(function(err){
			console.log(err)})
			}


	});

// END USER END POINTS

// START AUTHENTICATION END POINTS
	//Login Page Route POST
	self.router.post('/login',function(req, res) {
		console.log("userName "+req.body.userName);
		console.log("userPassword "+req.body.userPassword);
		var promisedUser = self.dbUsersHandler.findUserByName(req.body.userName);

		promisedUser.then(function(foundUser){
		
			console.log("Utente Tovato -> " +foundUser[0]);

			if(foundUser.length===1&&self.dbUsersHandler.validPassword(foundUser[0].userPassword,req.body.userPassword)){
				var payload = {
					id: foundUser[0].userEmail
				};
				var token = jwt.sign(payload, process.env.JWTSECRET,{
					expiresIn: 600 // in seconds
				});
				res.json({
					
						userName: foundUser[0].userName,
						userPassword: foundUser[0].userPassword,
						userEmail: foundUser[0].userEmail,
						token: token
				});
			}else{
				res.status(403).send({
					error: 'Incorrect password'
				});
			}
		
	}).catch(function(err){
	console.log(err)})
	});
	
	// END AUTHENTICATION END POINTS
}

class RouteRepository{
constructor(spider) {

		this.spider					= spider;
		var app 					= this.spider.getFunction('app');
		this.express				= this.spider.getFunction('express');
		this.parseurl 				= parseurl;
		this.dbUsersHandler			= this.spider.getModule('dbUsersHandler');
		this.dbSwimmingPoolHandler = this.spider.getModule('dbSwimmingPoolHadler');
		this.passportHandler		= new PassportHandler(this.dbUsersHandler);
		
		//Passport configuration
			//Passoport for authentication
		app.use(this.passportHandler.passport.initialize());
		app.use(this.passportHandler.passport.session());

	
	this.router = this.express.Router();
	setRoutes(this);
	app.use(flash());
}
}
module.exports = RouteRepository;
