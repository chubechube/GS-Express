const express           = require('express');
const app               = express();
const path              = require('path');
const bodyParser		= require('body-parser');
const RouteRepository   = require('../routes/RouteRepository');

class ExpressCustomServer {
    
    
    constructor(spider) {

           
            this.spider              = spider;
            this.session             = this.spider.getFunction('session');              
            
            
};

    createServer(){
           

                var self = this;
                           
                    //body parsing 
                app.use(bodyParser.urlencoded({ extended: false }))
                app.use(bodyParser.json());

                
                    //Router handler cration
                self.spider.addFunction('app',app);
                self.spider.addFunction('express',express);

                var routeRepository = new RouteRepository(self.spider);
                var router          = routeRepository.router;

                    //routing
                app.use(router);



                //starting the server
                app.listen(3030);
                console.log("Server is running at 3030");
                
}



    getSpider(){
        return this.spider;

    };
};

module.exports = ExpressCustomServer;