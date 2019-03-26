const EventEmitter 		  = require('events');
const MessageDefinition   = require('./config/messageDefinitions');


var assert                = require('assert');


class Spider extends EventEmitter{


	constructor(){
			
			super();
			this.availableMessages       = MessageDefinition;
            this.availableModules        = {};
            this.availableFunctions      = {};
            this.allGreen                = false;

		}

		

	getMessages(){
			return this.messages;
        }


    addModule(moduleName,moduleObject){
        
        assert.equal(typeof(moduleObject),'object','Module $s is not a valid object');
        assert.equal(typeof(moduleName),'string','Module Name is not a String');

        this.availableModules[moduleName] = moduleObject;

    };
    
    getModule(moduleName){
     
        assert.equal(typeof(moduleName),'string','Module Name is not a String');

        return this.availableModules[moduleName];

    };

    addFunction(functionName,functionObject){
        
        assert.equal(typeof(functionObject),'function','Function $s is not a valid object',functionObject);
        assert.equal(typeof(functionName),'string','Function Name is not a String');

        this.availableFunctions[functionName] = functionObject;

    };
    
    getFunction(functionName){
     
        assert.equal(typeof(functionName),'string','Module Name is not a String');

        return this.availableFunctions[functionName];

    };
    

	
}

//export the class
module.exports = Spider;