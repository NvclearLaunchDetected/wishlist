var nodemailer = require('nodemailer');
function Gmail(appOptions){
	this.clientId = appOptions.clientId;
	this.clientSecret = appOptions.clientSecret;
}

Gmail.prototype.connect = function(authOptions){
	var transportOptions = {
		service: 'Gmail',
		auth: {
			XOAuth2:{
				user: authOptions.user,
				clientId: this.clientId,
				clientSecret: this.clientSecret,
				refreshToken: authOptions.refreshToken,
				accessToken: authOptions.accessToken,
				timeout: authOptions.timeout
			}
		}
	}
	return nodemailer.createTransport('SMTP', transportOptions);
}

Gmail.prototype.generateBody = function(user, item){
	return 'I want to share ' + item.title + ' with you.';
}

Gmail.prototype.generateSubject = function(user, item){
	return user.name + ' sent this message';
}

exports.Gmail = Gmail;