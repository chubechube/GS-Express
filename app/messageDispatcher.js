/*jshint esversion: 6 */
const EventEmitter 		  = require('events');
const MessageDefinition   = require('./config/messageDefinitions');




class MessageDispatcher extends EventEmitter{


		constructor(){
			
			super();
			this.messages = MessageDefinition;
		};

		

		getMessages(){
			return this.messages;
		}
	
}

//export the class
module.exports = MessageDispatcher;