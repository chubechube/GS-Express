const ConfigurationHolder       = require('dotenv').config();
const Spider                    = require('./Spider');
const ExpressCustomServer       = require('./modules/ExpressCustomServer') ;
const DatabaseUsersHandler      = require('./modules/UserHandler');
const session                   = require('express-session');





//Spider Creation 
    console.log("Creating Spider");
    var spider              = new Spider();
    spider.addFunction('session',session);

    spider.on(spider.availableMessages.DBHANDLER_CONNECTION_FAILED,function (err){
        console.log("CONNECTION WITH DB FAILED",err);
         spider.allGreen = false;
    });




  spider.on(spider.availableMessages.DBHANDLER_USER_CONNECTION_OK,function(){
        console.log("Connection to MONGO Users DB OK");
        console.log("ALL Modules Initiated - Starting GSwim Web Server Server");



        if(!spider.getModule('expressCustomServer')){ 
        
        var expressCustomServer = new ExpressCustomServer(spider);
        spider.addModule('expressCustomServer',expressCustomServer);

    
        expressCustomServer.createServer();
        spider.allGreen = true;
        }
    });



   
    //DBUSER Connetion Server Creation 
    console.log("Connecting to the USER DB");
    
    var dbUsersHandler = new DatabaseUsersHandler(spider);
    spider.addModule('dbUsersHandler',dbUsersHandler);
    dbUsersHandler.connectDB();


