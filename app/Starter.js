const ConfigurationHolder       = require('dotenv').config();
const Spider                    = require('./Spider');
const ExpressCustomServer       = require('./modules/ExpressCustomServer') ;
const DatabaseUsersHandler      = require('./modules/UserHandler');
const DatabaseSwimmingPool      = require('./modules/SwimmigPoolHandler');
const session                   = require('express-session');





//Spider Creation 
    console.log("Creating Spider");
    var spider              = new Spider();
    spider.addFunction('session',session);

    spider.on(spider.availableMessages.DBHANDLER_USER_CONNECTION_FAILED,function (err){
        console.log("CONNECTION WITH DB USER FAILED",err);
         spider.allGreen = false;
    });

    spider.on(spider.availableMessages.DBHANDLER_SWIMMINGPOOL_CONNECTION_FAILED,function (err){
        console.log("CONNECTION WITH DB SWIMMING POOL FAILED",err);
         spider.allGreen = false;
    });


    spider.on(spider.availableMessages.DBHANDLER_SWIMMINGPOOL_CONNECTION_OK,function(){
        console.log("Connection to MONGO Swimming Pool DB OK");
        console.log("ALL Modules Initiated - Starting GSwim Web Server Server");
        if(!spider.getModule('expressCustomServer')){ 
        
        var expressCustomServer = new ExpressCustomServer(spider);
        spider.addModule('expressCustomServer',expressCustomServer);

    
        expressCustomServer.createServer();
        spider.allGreen = true;
    }
        
    });

  spider.on(spider.availableMessages.DBHANDLER_USER_CONNECTION_OK,function(){
        console.log("Connection to MONGO Users DB OK");
        

        //DBUSER Connetion Server Creation 
        console.log("Connecting to the SwimmingPool DB");
        
        var dbSwimmingPoolHadler = new DatabaseSwimmingPool(spider);
        spider.addModule('dbSwimmingPoolHadler',dbSwimmingPoolHadler);
        dbSwimmingPoolHadler.connectDB();

       
      
    });



   
    //DBUSER Connetion Server Creation 
    console.log("Connecting to the USER DB");
    
    var dbUsersHandler = new DatabaseUsersHandler(spider);
    spider.addModule('dbUsersHandler',dbUsersHandler);
    dbUsersHandler.connectDB();


