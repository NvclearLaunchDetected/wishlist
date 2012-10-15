google = new OAuth2('google', {
	client_id: '939394320283.apps.googleusercontent.com',
	client_secret: 'SyozXTsqDKp9eUtfFFulc-uf',
	api_scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
});	

function Auth(){
	console.log('init auth');
}

Auth.prototype.clear = function(){
	google.clearAccessToken()
	google.clear('email');
	google.clear('name');
}

Auth.prototype.getAuthInfo = function(){
	return google.get();
}

Auth.prototype.getGX = function(){
	var authInfo = this.getAuthInfo();
	return 'ga=' + authInfo.email + '&token=' + authInfo.accessToken;
}

Auth.prototype.required = function(cb){
	console.log('auth required')
	if(google.getAccessToken() && !google.isAccessTokenExpired()){
		console.log('has valid token.');
		cb();
		return;
	}
	
	function getGoogleUserinfo(token, cb) {
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
	
	function addAuthorizedUser(token, info, cb) {
		console.log('set new auth token.')
		$.ajax({
			type: 'post',
			url: 'http://iwish.cloudfoundry.com/user/auth',
			data: {
				token: token,
				name: info.name,
				email: info.email,
				siteName: 'google'
			}
		})
		.done(cb);
	}

	function saveUserInfo(u, cb){
		google.set('email', u.email);
		google.set('name', u.name);
		cb({token: google.getAccessToken(), email: google.get('email'), name: google.get('name')});
	}

	google.authorize(function(){
	 	if(!google.getAccessToken()){
	 		console.error("couldn't get the access token.");
	 		cb({err: {msg: "couldn't get the access token."}});
	 		return;
	 	}

	 	var accessToken = google.getAccessToken();
 		getGoogleUserinfo(accessToken, function(info){
			if(!info){
				console.error("couldn't get the user info.");
				cb({err: {msg: "couldn't get the user info."}});
				return;
			}

			addAuthorizedUser(accessToken, info, function(res){
				if(res.err){
					console.error(res);
					cb(res);
					return;
				}

				//완죤 다 성공.
				saveUserInfo(info, cb);
			})
		});
	});
}
