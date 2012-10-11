var auth = new Auth();
var _mx = {
	pv: {},
	init: function() {
		_mx.pv.gx = auth.getGX();
	},
	load: function(cb) {
		chrome.storage.local.get("wish", function(items) {
			if (items && items.wish && 0 < items.wish.items.length) {
				console.log("data loaded from local storage");
				cb(items.wish);
			} else {
				_mx.loadEx(function(res) {
					console.log("data loaded from remote svc");
					cb(res);
				});
			}
		});
	},
	loadEx: function(cb) {
		$.ajax({
			type: 'GET',
			url: 'http://wishapi-auth.cloudfoundry.com/wishlist',
			headers: {
			'GX-AUTH': _mx.pv.gx
			}
		})
		.done(function(res) {
			console.log(">> DATA : " + JSON.stringify(res));

			if (undefined === res.err && res.t && 0 < res.t) {
				chrome.storage.local.set({ "wish": res }, function() {
					cb(res);
				})
			}
		})
		.error(function(error) {
			console.log(">> ERROR : " + JSON.stringify(error));
			cb({err:{msg: 'unknown error!'}});
		});
	},
	removeOne: function(tid, cb) {
		$.ajax({
			type: 'DELETE',
			url: 'http://wishapi-auth.cloudfoundry.com/wishlist/' + tid,
			headers: {
				'GX-AUTH': _mx.pv.gx
			}
		})
		.done(function(res) {
			_mx.loadEx(function() {
				cb({});
			});
		})
		.error(function(error) {
			console.log(">> ERROR : " + JSON.stringify(error));
			cb({err:{msg: 'unknown error!'}});
		});
	},
	loadCatalog: function(mkt, no, cb) {
		$.ajax({
			type: 'GET',
			url: "http://devprism.about.co.kr/catalog.aspx?mall=" + mkt + "&no=" + no,
		})
		.done(function(res) {
			console.log(">> DATA : " + JSON.stringify(res));
			cb(res);
		})
		.error(function(error) {
			console.log(">> ERROR : " + JSON.stringify(error));
			cb({err:{msg: 'unknown error!'}});
		});
	}
};

var _ux = {
	render: function(d) {
		console.log(JSON.stringify(d));

		$("#wvlist").html('');

		var html = "";
		for (var i = 0; i < d.items.length; i++) {
			var o = d.items[i];

			var h = "<tr id='line_" + o._id + "'>"
			+ "<td>" + o.market + "</td>"
			//+ "<td><span class='label label-info'><i class='icon-picture icon-white'></i></span></td>"
			+ "<td width='60'><img src='" + o.imageurl + "' width='60' height='60'></td>"
			+ "<td><div class='action-detail' tid='" + o._id + "' data-title='설명' data-content='Hello, World'>" + o.title + "</div></td>"
			+ "<td>" + o.price + "</td>"
			+ "<td><i tid='" + o._id + "' class='icon-trash action-remove'></i></td></tr>";

			html += h;
		}

		$("#wvlist").append(html);

		$(".action-remove").click(function(e) {
			_cx.remove($(e.currentTarget).attr("tid"));
		});

		$(".action-detail").click(function(e) {
			$(e.target).popover("toggle");

			_cx.catalog({ eid: eo.attr("id"), mkt: eo.attr("mkt"), no: eo.attr("mid") });
		});

		$(".action-detail").hover(function(e) {
			$(e.currentTarget).popover("show");
		},
		function(e) {
			$(e.currentTarget).popover("hide");
		})
	},
	removeOne: function(line) {
		$("#line_" + line).remove();
	},
			+ "</div>");
	}
};

var _cx = {
	remove: function(tid) {
		console.log("try to delete :" + tid);
		_mx.removeOne(tid, function(res) {
			if (res.err) {
				console.log("failed : try to delete item (" + tid + ")");
			} else {
				console.log("item has been deleted (" + tid + ")");
				_ux.removeOne(tid);
			}
		});
	},
	catalog: function(item) {
		_mx.loadCatalog(item.mkt, item.no, function(data) {
			_ux.renderCatalog(item.eid, data);
		})
	}
};

$(document).ready(function() {
	auth.required(function(){
		_mx.init();
		_mx.load(function(res) {
			if (res.err) return;
			_ux.render(res);
		});
	});
});