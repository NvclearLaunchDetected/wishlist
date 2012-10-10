var mongoose = require('mongoose'),
    schema = require('./schema'),
    err_code = require('./err_code');

var db = mongoose.createConnection('localhost', 'wish');

var User = db.model('User', schema.user);

exports.authorization = function(req, res){
	var info = req.body;
	
	console.log(info);

	if(info.email == '' ||  info.email == undefined
		|| info.name == '' || info.name == undefined
		|| info.token == '' || info.token == undefined
		|| info.siteName == '' || info.siteName == undefined){
		
		res.json({
			err : {
				code : err_code.CAN_NOT_FIND_USER,
				msg : err.message
			}
		});
		return;
	}

	var userFindCallback = function(err, user){
		if(err){
			console.log(err);
			res.json({
				err : {
					code : err_code.CAN_NOT_FIND_USER,
					msg : err.message
				}
			});
		}
		else {
			if (user){
				user.name = info.name;
				user.siteName = info.siteName;
				user.token = info.token;
				user.reg_date = Date.now();
			}else{
				user  = new User({
					name : info.name,
					email : info.email,
					siteName : info.siteName,
					token : info.token,
					reg_date : Date.now()
				});
			}

			var userSaveCallback = function(err){
				if(err){
					console.log(err);
					res.json({
						err : {
							code : err_code.CAN_NOT_SAVE_USER,
							msg : err.message
						}
					});
				}
				else{
					res.json({});
				}
			};

			user.save(userSaveCallback);
		}
	};

	User.findOne({ email: info.email }, userFindCallback);
};