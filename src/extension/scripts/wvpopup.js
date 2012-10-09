var _px = {
	google: undefined,
	load: function(cb) {
		$.ajax({
			type: 'GET',
			url: 'http://wishapi-auth.cloudfoundry.com/wishlist',
			headers: {
				'GX-AUTH': 'ga=' + _px.google.userinfo.email + '&token=' + _px.google.getAccessToken()
			}
		})
		.done(function(data) {
			console.log(JSON.stringify(data));
			cb(data);
		})
		.error(function(error) {
			cb({err:{msg: 'unknown error!'}});
		})
	}
};

var _uv = {
	render: function(d) {
		var h = "";
		for (var i = 0; i < d.length; i++) {
			h += "<tr><td></td><td></td><td></td><td></td></tr>";
		}

		$("#wvlist").append(h);
	}
}

$(document).ready(function() {
	_px.google = chrome.extension.getBackgroundPage().google;

	console.log(JSON.stringify(_px.google));

	_px.load(function(data) {
		if (!data.err) {
			_uv.render(data);
		}
	});
});