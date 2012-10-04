var mongoose = require('mongoose');

exports.schema = mongoose.Schema({ 
	name : String,     							    // 사용자명
	email : String,    							    // 이메일
	siteName : { type: String, default: "google" }, // 인증 사이트(default : google)
	token : String,    							    // 인증 토큰
	reg_date : { type: Date, default: Date.now }     // 생성일
});