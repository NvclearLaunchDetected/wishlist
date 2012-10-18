google = new OAuth2('google', {
	client_id: '939394320283.apps.googleusercontent.com',
	client_secret: 'SyozXTsqDKp9eUtfFFulc-uf',
	api_scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
});

google.apikey = "AIzaSyCSYUw0GPsd8dnWcWV-xa34PRDJFfaIq-Q";

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

Auth.prototype.required = function(cb,force_approve){
	console.log('auth required')
		
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

	google.authorize(function(reNew){
		if(!reNew) {
			cb();
			return;
		}

		console.log('reNew is ' + reNew)
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
	}, force_approve);
}
