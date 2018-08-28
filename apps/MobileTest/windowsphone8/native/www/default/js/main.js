﻿
/* JavaScript content from js/main.js in folder common */
function wlCommonInit(){
	/*
	 * Use of WL.Client.connect() API before any connectivity to a Worklight Server is required. 
	 * This API should be called only once, before any other WL.Client methods that communicate with the Worklight Server.
	 * Don't forget to specify and implement onSuccess and onFailure callback functions for WL.Client.connect(), e.g:
	 *    
	 *    WL.Client.connect({
	 *    		onSuccess: onConnectSuccess,
	 *    		onFailure: onConnectFailure
	 *    });
	 *     
	 */
	
	// Common initialization code goes here
	// var socket = io('localhost:3000');
	/*
	function teste() {
		socket.emit('chat message', $('#texttosend').val());
		$('#texttosend').val('');
		return false;
	};
	
	socket.on('chat message', function(msg) {
		$('#textarea').val($('#textarea').val() + '\n' + msg);
	});
	*/
}


/* JavaScript content from js/main.js in folder windowsphone8 */
// This method is invoked after loading the main HTML and successful initialization of the IBM MobileFirst Platform runtime.
function wlEnvInit(){
    wlCommonInit();
    // Environment initialization code goes here
}