function priceFormat(n) {
	var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
	n += '';                          // 숫자를 문자열로 변환

	while (reg.test(n))
		n = n.replace(reg, '$1' + ',' + '$2');
	return n;
}

var auth = new Auth();
var _mx = {
	pv: {},
	init: function() {
		_mx.pv.gx = auth.getGX();
	},
	load: function(cb) {
		console.log('calling on load')
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
			url: 'http://iwish.cloudfoundry.com/wishlist/' + tid,
			headers: {
				'GX-AUTH': _mx.pv.gx
			}
		})
		.done(function(res) {
			_mx.load(function() {
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
		var rowTemplate = $('#rowTemplate');

		for (var i = 0; i < d.items.length; i++) {
			var o = d.items[i];
			var row = rowTemplate.clone();

			row.attr('id', 'line_'+o._id);
			row.find('.market').attr('src', Markets.getLogoUrl(o.market));
			row.find('.image').attr('src', o.imageurl);
			row.find('.action-detail').attr('tid', o._id).attr('data-content', o.comments).text(o.title).attr('vip', o.url);
			row.find('.price').text(priceFormat(o.price)); 
			row.find('.action-pcs').attr('idx', i);
			row.find('.action-remove').attr('tid', o._id);
			$("#wvlist").append(row);
		}

		$(".action-remove").click(function(e) {
			_cx.remove($(e.currentTarget).attr("tid"));
		});

		$(".action-detail").click(function(e) {
			var eo = $(e.currentTarget);
			var vipUrl = eo.attr('vip');
			chrome.tabs.create({url: vipUrl});
		});

		$(".action-pcs").click(function(e) {
			var eo = $(e.currentTarget);
			var o = _mx.pv.data.items[eo.attr("idx")]

			var searchKeyword = _cx.pickSearchKeyword(o);
			chrome.tabs.create({ url: "http://finding.about.co.kr/Search/Search.aspx?istop=y&Keyword=" + encodeURI(searchKeyword.replace(/\[|\]/g,' '))});
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
		chrome.extension.sendMessage(null, {msg: 'popNotification', title: 'iWish* 삭제', body: "선택하신 상품이 목록에서 삭제되었습니다."})
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
				chrome.storage.local.remove('wish', function(){
					//remove wishlist cache.
					_ux.removeOne(tid);	
				});
			}
		});
	},
	catalog: function(item) {
		_mx.loadCatalog(item.mkt, item.no, function(data) {
			_ux.renderCatalog(item.eid, data);
		})
	},
	pickSearchKeyword: function(item) {
		if(item.model) return item.model;
		if(item.keywords) return item.keywords;
		//if(item.) return item.brand; 브랜드 검색은 별 의미가 없음.
		return item.title;
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