var _cfg = {
	//wishapisvc: "http://wishapi.cloudfoundry.com"
	wishapisvc: "http://localhost:3000"
};

var _px = {
	wishlist : function(params) {
		$.ajax({
			type: "GET",
			url: _cfg.wishapisvc + "/wish/list/" + params.pg,
			dataType: "json"
		})
		.done(function(data) {
			params.done(data);
		})
		.fail(function(err) {
			params.fail();
		});
	}
};