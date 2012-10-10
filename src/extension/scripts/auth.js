google = new OAuth2('google', {
	client_id: '939394320283.apps.googleusercontent.com',
	client_secret: 'SyozXTsqDKp9eUtfFFulc-uf',
	api_scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
});	

function Auth(){
	console.log('init auth');
}

Auth.prototype.clear = function(cb){
	google.clearAccessToken()
	chrome.storage.local.remove(['token', 'email', 'name'], cb);
}

Auth.prototype.getAuthInfo = function(cb){
	var authorize = this.authorize;
	chrome.storage.local.get(function(userdata){
		if(!userdata || !userdata.token || !userdata.email){
			//auth 태워야함
			authorize(function(userinfo){
				if(!userinfo){
					cb('unknown error');
					return;
				}

				if(userinfo.err){
					cb(userinfo.err.msg);
					return;
				}

				cb(userinfo);
			})
		}

		cb(userdata);
	})
}

Auth.prototype.getGX = function(cb){
	this.getAuthInfo(function(authInfo){
		cb('ga=' + authInfo.email + '&token=' + authInfo.token);
	})
}

Auth.prototype.authorize = function(cb){
	console.log('google:' + JSON.stringify(google));
	
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

	function saveUserInfo(t, u, cb){
		var info = {
			token: t,
			email: u.email,
			name: u.name
		};

		chrome.storage.local.set(info, function(){
			cb(info);
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
