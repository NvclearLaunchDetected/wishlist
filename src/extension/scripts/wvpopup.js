var auth = new Auth();




function priceFormat(n) {
	var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
	n += '';                          // 숫자를 문자열로 변환

	while (reg.test(n))
		n = n.replace(reg, '$1' + ',' + '$2');
	return n;
}

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
			chrome.storage.local.remove('wish', function() {
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
			url: "aaa?mall=" + mkt + "&no=" + no,
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
			row.find('.action-share-twitter').attr('idx', i);
			row.find('.action-share').attr('idx', i);

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


		$(".action-share").click(function(e) {
			$("#u-share-submit").attr("idx", $(e.currentTarget).attr("idx"));
			$("#u-share-modal").modal("show");
		});

		$("#u-share-submit").click(function(e) {
			var o = _mx.pv.data.items[$(e.currentTarget).attr("idx")];
			var a = $("#u-sns-select > button.active");

			switch (a.attr("i")) {
				case "0" :
					console.log("share with Facebook");
					_cx.shareWithFacebook($("#u-sns-text").val(), o, function(oid) {
						chrome.extension.sendMessage(null, {msg: 'popNotification', title: 'iWish* Facebook에 글쓰기', body: "선택하신 상품이 Facebook을 통해 공유되었습니다."})
					});
					break;
				case "1" :
					console.log("share with Twitter");
					// open url
					//https://twitter.com/intent/tweet?original_referer=&source=tweetbutton&text=iWish(https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fiwish%2Flilemgdkaeokndjakhipmfajhfkgkmad%3Futm_source%3Dchrome-ntp-icon)%EC%97%90%EC%84%9C%20%EA%B4%80%EC%8B%AC%EC%83%81%ED%92%88%EC%9C%BC%EB%A1%9C%20%EB%93%B1%EB%A1%9D%ED%95%9C%20%EC%83%81%ED%92%88%EC%9E%85%EB%8B%88%EB%8B%A4.&url=http%3A%2F%2Fmall.shinsegae.com%2Fitem%2Fitem.do%3Fmethod%3DviewItemDetail%26item_id%3D16888553%26ckwhere%3Dshoppingcom%26clickNo%3D173535%26clickDate%3D20121017%26cpcType%3D1%26ref%3Dabout_open
					break;
				case "2" :
					console.log("share with eMail");
					break;
			}
		});

		$('.action-share-twitter').click(function(e) {
			var eo = $(e.currentTarget);
			var o = _mx.pv.data.items[eo.attr("idx")];

			shortenUrl(o.url, google.apikey, function(res) {
				console.log(JSON.stringify(res));

				if (!res.err) {
					var twitterUrl = 'https://twitter.com/share?text=' +
						encodeURIComponent('* iWish - http://goo.gl/pjjIC * (' + Markets.getName(o.market) + ') ' + o.title + ' -> ') +
						'&url=' + res.id;

					window.open(twitterUrl,"","width=640, height=480");
				}
			});
		})

		$(".action-pcs").click(function(e) {
			var eo = $(e.currentTarget);
			var o = _mx.pv.data.items[eo.attr("idx")]

			var landingUrl = "";

			if (o.catalog_id) {
				landingUrl = "http://pcp.about.co.kr/ProductInfo.aspx?Tab=tab2&catalogIDs=" + o.catalog_id;
			} else {
				var searchKeyword = _cx.pickSearchKeyword(o);

				landingUrl = "http://finding.about.co.kr/Search/Search.aspx?istop=y&Keyword="
					+ encodeURI(searchKeyword.replace(/\[|\]/g,' '));
			}
			
			chrome.tabs.create({ url: landingUrl});
		});

		$(".action-detail").hover(function(e) {
			$(e.currentTarget).popover("show");
		},
		function(e) {
			$(e.currentTarget).popover("hide");
		})

		!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=chrome.extension.getURL('scripts/share/twitter.js');fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
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
	share: {},
	init: function() {
		$("#u-refresh").click(function() {
			chrome.extension.sendMessage(null, {msg: 'forceReloadList'}, function(res) {
				_ux.render(res);
			});
		});
	},
	remove: function(tid) {
		console.log("try to delete :" + tid);
		_mx.removeOne(tid, function(res) {
			if (res.err) {
				console.log("failed : try to delete item (" + tid + ")");
			} else {
				console.log("item has been deleted (" + tid + ")");
				chrome.storage.local.remove('wish', function(){
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

		return item.title;
	},
	shareWithFacebook: function(msg, o, cb) {
		var fb = _cx.share.fb || (_cx.share.fb = new FBAuth());

		fb.required(function() {
			var post = {
				picture: o.imageurl,
				link: o.url,
				name: o.title,
				caption: "iWish* 나만의 쇼핑 기술",
				description: o.comments,
				message: msg,
				icon: Markets.getLogoUrl(o.market)
			};

			fb.publish(post, function(result) {
				console.log(result);
				cb(((result.err) ? "" : result.id));
			});
		});
	}
};

$(document).ready(function() {
	_cx.init();
	_mx.init();
	_mx.load(function(res) {
		if (res.err) return;
		_mx.pv.data = res;
		_ux.render(res);
	});
});