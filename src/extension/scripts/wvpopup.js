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
				chrome.extension.sendMessage(null, {msg: 'forceReloadList'}, function(res) {
					console.log("data loaded from remote svc");
					cb(res);
				});
			}
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
			dataType: "text"
		})
		.done(function(res) {
			//console.log(">> DATA : " + JSON.stringify(res));
			console.log(">> DATA : " + res);
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
			+ "<td>" + Markets.getMarket(o.market) + "</td>"
			//+ "<td><span class='label label-info'><i class='icon-picture icon-white'></i></span></td>"
			+ "<td width='60'><img src='" + o.imageurl + "' width='60' height='60'></td>"
			+ "<td><div class='action-detail' tid='" + o._id + "' data-placement='top' data-content='" + o.comments + "'>" + o.title + "</div></td>"
			+ "<td><span>" + o.price + "</span><br><span class='label label-info action-pcs' idx='" + i + "'>가격비교</span></td>"
			+ "<td><span class='label label-warning action-remove' tid='" + o._id + "'><i class='icon-trash icon-white'></i></span></td></tr>";

			html += h;
		}

		$("#wvlist").append(html);

		$(".action-remove").click(function(e) {
			_cx.remove($(e.currentTarget).attr("tid"));
		});

		$(".action-detail").click(function(e) {
			var eo = $(e.currentTarget);
			_cx.catalog({ eid: eo.attr("tid"), mkt: eo.attr("mkt"), no: eo.attr("mid") });
		});

		$(".action-pcs").click(function(e) {
			var eo = $(e.currentTarget);
			var o = _mx.pv.data.items[eo.attr("idx")]

			_mx.loadCatalog( o.market, o.market_item_id, function(data) {
				var m = data.match(/cid:(\d*)/);

				if (m)
					chrome.tabs.create({ url: "http://pcp.about.co.kr/ProductInfo.aspx?catalogIDs=" + m[1] + "&Tab=tab2" });
			})

			//chrome.tabs.create({ url: "http://pcp.about.co.kr/ProductInfo.aspx?catalogIDs=" + eo.attr("tid")+ "&Tab=tab2" });
			
			//chrome.tabs.create({ url: "http://finding.about.co.kr/Search/Search.aspx?istop=y&Keyword=" + encodeURI(_mx.pv.data.items[eo.attr("idx")].title)});
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
	renderCatalog: function(tid, data) {
		// render ... items
		console.log("draw at " + JSON.stringify(data));
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
				_mx.pv.data = res;
				_ux.render(res);
		});
	});
});