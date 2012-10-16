var config = require('config'),
	err_code = require('../err_code'),
	mailer = require('./gmail');


function Exporter(shareType){
	if(shareType.toLowerCase() != 'gmail') return {
		err: {
			code: err_code.SHARE_TYPE_NOT_SUPPORTED,
			msg: 'share type not supported'
		}
	}

	this.appOptions = config.appOptions;
}


Exporter.prototype.shareIt = function(oauth2, user, item, message, cb){
	//refactor this later
	//now we have only one share point (gmail)
    var gmail = new mailer.Gmail(config.appOptions);
    var authOptions = {
      user: oauth2.ga,
      accessToken: oauth2.token,
      refreshToken: oauth2.refreshToken,
    }

    var transport = gmail.connect(authOptions);
    if(!message || !message.to){
      console.log(message);
      cb({
        err: {
          code: err_code.SHARE_GMAIL_RECEIVER_REQUIRED,
          msg: 'receiver required.'
        }
      });

      return;
    }

    message.subject = message.subject || gmail.generateSubject(user, item);
    if(!message.text && !message.html) message.html = gmail.generateBody(user, item);

    transport.sendMail(message, function(error){
      if(error){
        cb({
          err: {
            code: err_code.SHARE_GMAIL_FAILED,
            msg: error.data
          }
        });

        return;
      }

      cb({ result: 'Message sent successfully.'});
    })
}


exports.Exporter = Exporter;


