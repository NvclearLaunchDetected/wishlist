
var google = google || new OAuth2('google', {
	client_id: '939394320283.apps.googleusercontent.com',
	client_secret: 'SyozXTsqDKp9eUtfFFulc-uf',
	api_scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
});

var auth = auth || {
	getGX: function() {
		return 'ga=' + google.userinfo.email + '&token=' + google.getAccessToken();
	},
	getGoogleUserinfo: function(token, cb) {
		$.ajax({
			type: 'get',
			url: 'https://www.googleapis.com/oauth2/v1/userinfo',
			headers: {
				'Authorization': 'OAuth ' + token
			}
		})
		.done(cb);
	},
	authUser: function(token, info, cb) {
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
	},
	required: function(cb) {
	  //access token이 유효하지 않음.
		if(!google.getAccessToken() || google.isAccessTokenExpired()){
			google.authorize(function(){
				//구글 계정 정보 얻기
				if(!google.getAccessToken()) {
					//access 허용하지 않음. 혹은 인증 에러.
					return;
				}

				auth.getGoogleUserinfo(google.getAccessToken(), function(info){
					if(!info){
						//구글 계정 정보 얻기 실패. 어떻게 처리하지?
						return;
					}

					google.userinfo = info;

					auth.authUser(google.getAccessToken(), info, function(res){
						if(res.err){
							//wishlist 계정 인증 실패. 어쩌지?
							return;
						}

						if(!res.data){
							//얘도 계정 인증 실패. 어쩌지?
							return;
						}

						cb();
					})
				})
			});
		} else {
			//access token이 유효함
			if(!google.userinfo) {
				auth.getGoogleUserinfo(google.getAccessToken(), function(info){
					if(!info){
						//구글 계정 정보 얻기 실패. 어떻게 처리하지?
						return;
					}

					google.userinfo = info;

					cb();
				});
			} else {
				cb();
			}
		}
	}
};