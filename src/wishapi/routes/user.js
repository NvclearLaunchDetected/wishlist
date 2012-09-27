var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'wish');

var schema = mongoose.Schema({ 
	name : String,     							    // 사용자명
	email : String,    							    // 이메일
	siteName : { type: String, default: "google" }, // 인증 사이트(default : google)
	token : String,    							    // 인증 토큰
	regDate : { type: Date, default: Date.now }     // 생성일
});

var User = db.model('User', schema);

exports.authorization = function(req, res){
	var info = req.body;
	
	User.findOne({ email: info.email },
		function(err, user){
			if(err){
				console.log(err);
			}
			else {
				if (user){
					user.name = info.name;
					user.siteName = info.siteName;
					user.token = info.token;
					user.regDate = Date.now();
					user.save(function(err){
						if(err){
							console.log(err);
							res.json(false);
						}
						else {
							console.log("2");
							res.json(true);
						}
					});
				}else{
					var newUser = new User({
						name : info.name,
						email : info.email,
						siteName : info.siteName,
						token : info.token,
						regDate : Date.now()
					});

					newUser.save(function(err){
						if(err){
							console.log(err);
							res.json(false);
						}
						else{
							res.json(true);
						}
					});
				}
			}
	});
};

exports.list = function(req, res){
	User.find({ email: req.params.email },
			function(err, users){
				if(err){
					console.log(err);
					res.json(false);
				}
				else {
					res.json(users);
				}
	});
};