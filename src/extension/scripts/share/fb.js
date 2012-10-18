facebook = new OAuth2('facebook', {
	client_id: '157448664399881',
	client_secret: 'c3da176a6dee104093dab985adf61436',
	api_scope: 'publish_stream'
});

function FBAuth() {
	var _self = {};

	_self.required = function(cb) {
		console.log('FBAuth required');

		facebook.authorize(function(){
			cb();
		});
	};

	_self.publish = function(postData, cb) {
		$.ajax({
			type: 'POST',
			url: 'https://graph.facebook.com/me/feed?access_token=' + facebook.getAccessToken(),
			data: postData,
			contentType: 'application/x-www-form-urlencoded',
			dataType: "json"
		})
		.done(function(res) {
			cb(res);
		})
		.fail(function(error) {
			console.log(">> ERROR : " + JSON.stringify(error));
			cb({err:{msg: 'unknown error!'}});
		});
	};

	return _self;
}