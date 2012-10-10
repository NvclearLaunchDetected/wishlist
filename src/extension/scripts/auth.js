google = new OAuth2('google', {
	client_id: '939394320283.apps.googleusercontent.com',
	client_secret: 'SyozXTsqDKp9eUtfFFulc-uf',
	api_scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
});	

function Auth(){
	console.log('init auth');
}

Auth.prototype.getGX = function(cb){
	var authorize = this.authorize;
	chrome.storage.local.get(function(userdata){
		if(!userdata || !userdata.token || !userdata.email){
			//auth 태워야함
			authorize(function(userinfo){
				if(!uesrinfo){
					cb('unknown error');
					return;
				}

				if(userinfo.err){
					cb(userinfo.err.msg);
					return;
				}

				cb('ga=' + userinfo.email + '&token=' + userinfo.token);
			})
		}

		cb('ga=' + userdata.email + '&token=' + userdata.token);
	})
}

Auth.prototype.getGoogleUserinfo = function(token, cb) {
	console.log('calling userinfo ' +token);
	$.ajax({
		type: 'get',
		url: 'https://www.googleapis.com/oauth2/v1/userinfo',
		headers: {
			'Authorization': 'OAuth ' + token
		}
	})
	.done(cb);
}

Auth.prototype.addAuthorizedUser = function(token, info, cb) {
	$.ajax({
		type: 'post',
		url: 'http://wishapi-auth.cloudfoundry.com/user/auth',
		data: {
			token: token,
			name: info.name,
			email: info.email,
			siteName: 'google'
		}
	})
	.done(cb);
}

Auth.prototype.authorize = function(cb){
	console.log('google:' + JSON.stringify(google));
	var getGoogleUserinfo = this.getGoogleUserinfo;
	var addAuthorizedUser = this.addAuthorizedUser;

	function saveUserInfo(t, u, cb){
		chrome.storage.local.get(function(userdata){
			ud = userdata || {}
			ud.token = t;
			ud.name = u.name;
			ud.email = u.email;
			chrome.storage.local.set(ud, function(){
				cb(ud);
			})
		})
	}

	google.authorize(function(){
	 	if(!google.getAccessToken()){
	 		cb({err: {msg: "couldn't get the access token."}});
	 		return;
	 	}

	 	var accessToken = google.getAccessToken();
 		getGoogleUserinfo(accessToken, function(info){
			if(!info){
				cb({err: {msg: "couldn't get the user info."}});
				return;
			}

			addAuthorizedUser(accessToken, info, function(res){
				if(res.err){
					cb(res);
					return;
				}

				//완죤 다 성공.
				saveUserInfo(accessToken, info, cb);
			})
		});
	});
}
