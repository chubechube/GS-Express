
const  mongoose 		= require('mongoose');
const  bcrypt			= require('bcrypt-nodejs');





class SwimmingPoolHandler  {
	constructor(spider){


		
		this.db		   			= mongoose;
		this.spider 			= spider;
		this.self				= this;
        this.Schema 			= mongoose.Schema;
        this.connected 			= false;
		this.connection         = null;

	
	
		
		this.initializeSwimmingPool();
	}

	
    connectDB(){
        var self 	= this;
		var uri		=  'mongodb://GSwim2019!:chube@192.168.178.51:32768/SwimmingPool';
		var options = {promiseLibrary : global.Promise };
		

		   this.db.createConnection(uri,options).then(
			conn => {
				self.connection=conn
				self.connected = true
				console.log("User DB URI "+uri)
				self.spider.emit(self.spider.availableMessages.DBHANDLER_SWIMMINGPOOL_CONNECTION_OK)
				});
    
    
        
       
            }    
	
	//User utilities

	initializeSwimmingPool(){


       
		this.swimmingPoolSchema = new this.Schema({
			swimmingPoolName 		         : String,
			swimmingPoolEmail		         : String,
			swimmingPoolAddress1	         : String,
			swimmingPoolProvince	         : String,
			swimmingPoolRegion	         	 : String,
			swimmingPoolCountry		         : String,
			swimmingPoolType				 : String
		});		

	}

	
	

	createSwimmingPool(swimmingPoolName,swimmingPoolEmail,swimmingPoolAddress1,swimmingPoolProvince,swimmingPoolRegion,swimmingPoolCountry,swimmingPoolType,success,err){
		console.log("CREATION Swimming Pool"+swimmingPoolName+ "_"+swimmingPoolEmail+ "_"+swimmingPoolAddress1+ "_"+swimmingPoolProvince+ "_"+swimmingPoolRegion+ "_"+swimmingPoolCountry+ "_"+swimmingPoolType);
		var SwimmingPoolModel = this.connection.model('SwimmingPool',this.swimmingPoolSchema);

		var newSwimmingPool=new SwimmingPoolModel();
		newSwimmingPool.swimmingPoolName=swimmingPoolName;
		newSwimmingPool.swimmingPoolEmail=swimmingPoolEmail;
		newSwimmingPool.swimmingPoolAddress1=swimmingPoolAddress1;
		newSwimmingPool.swimmingPoolProvince=swimmingPoolProvince;
		newSwimmingPool.swimmingPoolRegion=swimmingPoolRegion;
		newSwimmingPool.swimmingPoolCountry=swimmingPoolCountry;
		newSwimmingPool.swimmingPoolType=swimmingPoolType;
	
		return newSwimmingPool.save();
		}
	
	findSwimmingPoolByName(swimmingPoolName){
		var SwimmingPoolModel = this.connection.model('SwimmingPool',this.swimmingPoolSchema);
		return SwimmingPoolModel.find({swimmingPoolName : swimmingPoolName}).exec();
	}
	
	findSwimmingPoolById(swimmingPoolID,success,err){
		var SwimmingPoolModel = this.connection.model('SwimmingPool',this.swimmingPoolSchema);
		return SwimmingPoolModel.find({_id : swimmingPoolID}).exec();
		}
	
	findSwimmingPoolByEmail(swimmingPoolEmail,success,err){
		var SwimmingPoolModel = this.connection.model('SwimmingPool',this.swimmingPoolSchema);
		return SwimmingPoolModel.find({swimmingPoolEmail : swimmingPoolEmail}).exec();
	}

	removeSwimmingPoolEmail(swimmingPoolEmail,success,err){
		var SwimmingPoolModel = this.connection.model('SwimmingPool',this.swimmingPoolSchema);
		var SwimmingPoolModel = this.connection.model('SwimmingPool',this.swimmingPoolSchema);
		return UserModel.findOneAndRemove({swimmingPoolEmail : swimmingPoolEmail}).exec();
	}

	getAllSwimmingPool(success,err){
		var SwimmingPoolModel = this.connection.model('SwimmingPool',this.swimmingPoolSchema);
		return SwimmingPoolModel.find(function(err,swimmingPools){
			if(err) {console.log(err); return null;}
			return swimmingPools;
		}).exec();
	}

	
	
}

module.exports = SwimmingPoolHandler;