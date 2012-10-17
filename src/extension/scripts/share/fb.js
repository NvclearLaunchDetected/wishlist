facebook = new OAuth2('facebook', {
	client_id: '157448664399881',
	client_secret: 'c3da176a6dee104093dab985adf61436',
	api_scope: 'https://graph.facebook.com'
});

function FBAuth() {
	var _self = {};

	_self.required = function(cb) {
		console.log('FBAuth required')
		if(facebook.getAccessToken() && !facebook.isAccessTokenExpired()){
			console.log('FBAuth has valid token.');
			cb();
		}
	}

	return _self;
}