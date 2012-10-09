var _px = {
	google: undefined,
	load: function(cb) {
		$.ajax({
			type: 'GET',
			url: 'http://wishapi-auth.cloudfoundry.com/wishlist',
			headers: {
				'GX-AUTH': auth.getGX()
			}
		})
		.done(function(res) {
			console.log(">> DATA : " + JSON.stringify(res));
			cb(res);
		})
		.error(function(error) {
			console.log(">> ERROR : " + JSON.stringify(error));
			cb({err:{msg: 'unknown error!'}});
		})
	}
};

var _uv = {
	render: function(d) {
		$("#wvlist").html('');

		var html = "";
		for (var i = 0; i < d.items.length; i++) {
			var o = d.items[i];

			var h = "<tr><td>" + o.market + "</td>"
			+ "<td><a href='" + o.url + "'>" + o.title + "</a></td>"
			+ "<td>" + o.price + "</td>"
			+ "<td><a href='javascript:void(0)'><i class='icon-trash'></i></a></td></tr>";

			html += h;
		}

		$("#wvlist").append(html);
	}
}

$(document).ready(function() {
	console.log(">> DEBUG : document.ready");
	
	auth.required(function() {
		_px.load(function(res) {
			if (!res.err) {
				_uv.render(res.data);
			}
		});
	});
});