var auth = chrome.extension.getBackgroundPage().auth;
var _mx = {
	pv: {},
	init: function() {
		_mx.pv.gx = auth.getGX();
	},
	load: function(cb) {
		chrome.storage.local.get("wish", function(items) {
			if (items && items.wish) {
				console.log("data loaded from local storage");
				console.log(JSON.stringify(items));
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
	}
};

var _ux = {
	render: function(d) {
		$("#wvlist").html('');
		console.log("try to render");

		var html = "";
		for (var i = 0; i < d.items.length; i++) {
			var o = d.items[i];

			var h = "<tr id='line_" + o._id + "'>"
			+ "<td>" + o.market + "</td>"
			//+ "<td><span class='label label-info'><i class='icon-picture icon-white'></i></span></td>"
			+ "<td width='60'><img src='" + o.imageurl + "' width='60' height='60'></td>"
			//+ "<td><div class='action-detail' id='item_" + o._id + "' data-placement='top' data-title='설명' data-content='<img src=\"" + o.imageurl + "\" width=60 height=60>'>" + o.title + "</div></td>"
			+ "<td><div class='action-detail' id='item_" + o._id + "'>" + o.title + "</div></td>"
			+ "<td>" + o.price + "</td>"
			+ "<td><span class='label label-important action-remove' tid='" + o._id + "'><i class='icon-trash icon-white'></i></span></td></tr>";

			html += h;
		}

		$("#wvlist").append(html);

		$(".action-remove").click(function(e) {
			_cx.remove($(e.currentTarget).attr("tid"));
		});

		$(".action-detail").click(function(e) {
			//$("#" + e.target.id).popover("toggle");
		});
	},
	removeOne: function(line) {
		$("#line_" + line).remove();
		$("#notibar").append("<div class='alert alert-info'>"
  		+ "<a class='close' data-dismiss='alert'>×</a>"
  		+ "삭제되었습니다."
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
	}
};

$(document).ready(function() {
	console.log(">> DEBUG : document.ready");
	
	auth.required(function() {
		_mx.init();

		_mx.load(function(res) {
			if (res.err) return;

			_ux.render(res);
		});
	});
});