
/* JavaScript content from js/app.js in folder common */
//address = 'http://NTB137607:3000';
//address = 'http://192.168.43.247:3000';
address = 'http://104.154.69.20:3000';
dominioEjabberd = 'saturn';

//host = 'ntb137607';
host = '45.55.164.136';
socket = '';
var connection = null;
// var id = CryptoJS.MD5(user).toString();
idDevice = '';

//WL.Device.getID({onSuccess:function(o){idDevice = o.deviceID;},onFailure:function(e){console.log(e);}});
//WL.App.setKeepAliveInBackground(true);

ScreenObj = function() {
	this.loginScreen = $('#loginScreen');
	this.contactScreen = $('#contactScreen');
	this.chatScreen = $('#chatScreen');
};

ScreenObj.prototype.showScreen = function(screenObjTmp) {
	// show or hide top header.
	if ($(screenObjTmp)[0] === $(this.loginScreen)[0]) {
		$('#top_header').hide();
	} else {
		$('#top_header').show();
	}

	this.hideScreen(loginScreen);
	this.hideScreen(contactScreen);
	this.hideScreen(chatScreen);
	$(screenObjTmp).fadeIn(300, function() {
		$(this).show();
	});
};

ScreenObj.prototype.hideScreen = function(screenObjTmp) {
	$(screenObjTmp).fadeOut(200, function() {
		$(this).hide();
	});
};

ScreenObj.prototype.hideAll = function() {
	$(this.loginScreen).hide();
	$(this.contactScreen).hide();
	$(this.chatScreen).hide();
};

Chat = function() {
	this.selectedUser = '';
};

Chat.prototype.createRoomName = function(name1, name2) {
	if (name1 > name2) {
		return name2 + name1;
	} else {
		return name1 + name2;
	}
};

Chat.prototype.joinRoom = function(selectedUser) {
	socket.emit('join', this.createRoomName(login.myUser, selectedUser),
			selectedUser, login.myUser);
	chat.selectedUser = selectedUser;
	screenObj.showScreen(screenObj.chatScreen);
	$('#topNomeContato').html('<span>Com ' + selectedUser + '</span>');
};

Chat.prototype.sendMsg = function() {
	var msg = $('#msgInput').val();
	$('#msgInput').val('');
	var data = {
		nome : login.myUser,
		sala : chat.createRoomName(login.myUser, this.selectedUser),
		contato : this.selectedUser
	};
	socket.emit('send-server', msg, data);
	
	var msgXMPP = $msg({to: this.selectedUser+'@'+host, type: 'chat'});
    msgXMPP.c('body', {}, msg);
    connection.send(msgXMPP.tree());
};

Chat.prototype.cleanHistory = function() {
	$('.list-group').empty();
};

Contact = function() {
};

Contact.prototype.addContact = function(online) {
	if (online === login.myUser) {
		return;
	} else if (!this.containsContact(online)) {
		var dateNow = new Date();

		// contact row.
		var toAppend = $("<li id='contactUser' class='media'><a class='pull-left' "
				+ " href='#'><img class='img-circle media-object' "
				+ " src='images/photo-1421986527537-888d998adb74.jpg' "
				+ " height='64' width='64'></a> "
				+ " <div class='media-body'> "
				+ "<h4 id='username' class='media-heading'>"
				+ online
				+ "</h4> "
				+ "<p>Supervisor de extratos; Frente de caixa.</p> "
				+ "<hr> "
				+ "<div id='contactRow' class='pull-right' style='margin-top: -80px'> "
				+ "<p id='msgHour' class='text-warning'>"
				+ dateNow.getHours()
				+ ":"
				+ dateNow.getMinutes()
				+ "h</p> "
				+ "</div> " + "</div></li>");
		toAppend.data('user', online);
		toAppend.click(function() {
			selectedUser = $(this).data('user');
			toAppend.find('#username').empty();
			toAppend.find('#username').append($(this).data('user'));
			toAppend.find('i .fa-comments').remove();
			toAppend.find('#msgNewNotify').remove();
			chat.joinRoom(selectedUser);
		});
		$('#contactList').append(toAppend);
	}
};

Contact.prototype.containsContact = function(contact) {
	var toReturn = false;
	$('#contactList').children().each(function(k, v) {
		if ($(v).data('user') === contact) {
			toReturn = true;
		}
	});
	return toReturn;
};

Contact.prototype.openContact = function() {
	screenObj.showScreen($(screenObj.contactScreen));
	chat.cleanHistory();
};

Contact.prototype.removeContact = function(contact) {
	$('#contactList').children().each(function(k, v) {
		if ($(v).data('user') === contact) {
			$(v).remove();
		}
	});
};

Contact.prototype.notifyNewMsg = function(contactTmp) {
	$('#contactList').children().each(function(k, v) {
		if ($(v).data('user') === contactTmp) {
			contact.addGuiNewMsg($(v));
		}
		;
	});
};

Contact.prototype.addGuiNewMsg = function(row) {
	var icon = $("<i class='fa fa-comments fa-fw fa-lg fa-spin pull-right text-warning' "
	+ "id='msgNewNotify'></i>");
	var h4 = $(row).find('#username');
	var parent = h4.parent();
	var contactRow = parent.find('#contactRow');
	contactRow.find('#msgNewNotify').remove();
	contactRow.append(icon);
};

Login = function() {
	this.myUser = '';
};

// connect to the server.
Login.prototype.join = function() {
	socket = io(address);
	var user = $('#loginTxt').val();
	startService(user);
	screenObj.showScreen($(screenObj.contactScreen));
	chat.cleanHistory();
	
	var BOSH_SERVICE = 'http://'+host+':5280/http-bind';
	connection = new Strophe.Connection(BOSH_SERVICE);
	connection.connect(user+'@'+dominioEjabberd, "123456");

	socket.on('connect', function() {
		login.myUser = user;
		socket.emit('addUser', user);
	});

	socket.on('notify-onlines', function(online) {
		contact.addContact(online);
	});

	socket.on('notify-offlines', function(userOff) {
		contact.removeContact(userOff);
	});

	socket.on('send-client', function(msg) {
		$('.list-group').append(
				$("<li class='list-group-item'>" + msg + "</li>"));
	});

	socket.on('new-message',
			function(data) {
				console.log(data.nome + ' enviou uma mensagem para vc '
						+ data.contato);
				contact.notifyNewMsg(data.nome);
			});
};

Login.prototype.disconnect = function() {
	socket.emit('closeConnection');
	// close xmpp connection.
	connection.disconnect();
	
	socket.close();
	screenObj.showScreen($(screenObj.loginScreen));
	$('#loginTxt').val('');
};

login = new Login();
contact = new Contact();
screenObj = new ScreenObj();
chat = new Chat();

startApp = function() {
	screenObj.hideAll();
	screenObj.showScreen($(screenObj.loginScreen));
}();

// load android plugin
function startService(value){
	var name = value;
	if (WL.Client.getEnvironment() == WL.Environment.PREVIEW) {
		WL.SimpleDialog.show(
				"Cordova Plugin", "Please run the sample in either a Simulator/Emulator or physical device to see the response from the Cordova plug-in.", 
				[{text: "OK", handler: function() {WL.Logger.debug("Ok button pressed");}
				}]
		);
	} else {
		if (WL.Client.getEnvironment() == WL.Environment.ANDROID){
			cordova.exec(sayHelloSuccess, sayHelloFailure, "BGServicePlugin", "startService", [name]);
		}
	}
};

function sayHelloSuccess(data){
//	WL.SimpleDialog.show(
//		"Response from plug-in", data, 
//		[{text: "OK", handler: function() {WL.Logger.debug("Ok button pressed");}
//		}]
//	);
}

function sayHelloFailure(data){
	WL.SimpleDialog.show(
		"Response from plug-in", data, 
		[{text: "OK", handler: function() {WL.Logger.debug("Ok button pressed");}
		}]
	);
}


$(document).on("pageshow", "[data-role='page'].no-loadmsg", function() {
	$('div.ui-loader').remove();
});
$(document).on("pageshow", "[data-role='page']", function() {
	$('div.ui-loader').hide();
});
// --index.html
