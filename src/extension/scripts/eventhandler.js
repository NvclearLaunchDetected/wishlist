var url_parser = new URLParser();

function setDefaultMode(tabId){
	chrome.browserAction.setBadgeText({text:'', tabId: tabId});
	//set wish list as a default popup
	chrome.browserAction.setPopup({
		tabId: tabId,
		popup: 'wvpopup.html'
	});
}

function setAddMode(tabId){
	chrome.browserAction.setBadgeText({text:'+', tabId: tabId});
	chrome.browserAction.setPopup({
		tabId: tabId,
		popup: 'awpopup.html'
	});

	popNotification('iWish* 추가', '이 상품을 iWish* 목록에 추가할 수 있습니다.');
}

function popNotification(title, body){
	Settings.required(function(settings){
		if(settings.notUseNoti) return;

		var notification = webkitNotifications.createNotification(
		  'img/myfav_i19.png',  // icon url - can be relative
		  title,  // notification title
		  body  // notification body text
		);
		
		// Then show the notification.
		notification.show();
		notification.onclose = function(){
			console.log('closing! notification');
		}

		setTimeout(function(){
		 	notification.close();
		}, settings.closeNotiSec * 1000)
	})
}

function isExist(market_code, itemno, cb){
	$.ajax({
		type: 'GET',
		url: 'http://iwish.cloudfoundry.com/wishlist?market=' + market_code + '&market_item_id=' + itemno,
		headers: {
			'GX-AUTH': auth.getGX()
		}
	}).done(cb).error(function(error){
		cb({err:{msg: 'unknown error!'}});
	})
}

chrome.extension.onMessage.addListener(function(info, sender, cb){
	if ('getProductInfo' == info.msg){
		chrome.tabs.executeScript(null, {code: 'getProductInfo()'}, function(res){
		 	cb(res[0]);
		})

		return true;
	}

	if ('popNotification' == info.msg){
		popNotification(info.title, info.body);
		cb();
	}

	if ('isExist' == info.msg){
		isExist(info.market_code, info.itemno, function(res){
			if(!res) {
				cb({err:{msg: 'unknown error'}});
				return;
			}

			if(res.err){
				cb(res);
				return;
			}

			if(res.items && res.items.length){
				cb({exist: true});
				return;
			}

			cb({exist: false});
		});

		return true;
	}

	if ('setDefaultMode' == info.msg){
		var tabId = info.tabId || sender.tab.id;

		setDefaultMode(tabId);
		cb({msg: 'set browserAction as default mode'});
	}

	if ('setAddMode' == info.msg){
		var tabId = info.tabId || sender.tab.id;

		setAddMode(tabId);
		cb({msg: 'set browserAction as add mode'});	
	}

	if ('getListPopupHtml' == info.msg) {
		cb({html: $('#wvpopup').html()});
	}

	if ('forceReloadList' == info.msg) {
		$.ajax({
			type: 'GET',
			url: 'http://iwish.cloudfoundry.com/wishlist',
			headers: {
			'GX-AUTH': auth.getGX()
			}
		})
		.done(function(res) {
			console.log(">> DATA : " + JSON.stringify(res));

			if (res.err) return;

			chrome.storage.local.set({ "wish": res }, function() {
				cb(res);
			})
		})
		.error(function(error) {
			console.log(">> ERROR : " + JSON.stringify(error));
			cb({err:{msg: 'unknown error!'}});
		});

		return true;
	}
});