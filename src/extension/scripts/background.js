var userinfo = {};

var url_parser = new URLParser();

//browser action
// chrome.browserAction.onClicked.addListener(function(tab){
	auth.required(function() {
		chrome.browserAction.getBadgeText({ tabId: tab.id }, function(badge){
			if(badge == '+'){
				chrome.tabs.executeScript(null, {
					code: 'inject(' + tab.id + ')'
				});
			}
		});
	});
// });

//tabs handler
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	//ÑÏû¨ tabloadingurlÎ≥ÄÍ≤òÎ©¥ ®ÌÑ¥ Ï°∞Ìöå
	if(!url_parser.isProduct(tab.url)) {
		chrome.browserAction.setBadgeText({text:'', tabId: tabId});
		//set wish list as a default popup
		chrome.browserAction.setPopup({
			tabId: tab.tabId,
			popup: 'wvpopup.html'
		});
		return;
	}

	//†ÌÉùtabIdÎ°úÏ†ï §Î•∏ tabÄ êÎèôºÎ°ú badge Î≥ÄÍ≤
	chrome.browserAction.setBadgeText({text:'+', tabId: tabId});
	 chrome.browserAction.setPopup({
		 tabId: tab.tabId,
		 popup: ''
	 });
})

chrome.tabs.onActivated.addListener(function(activeInfo){
  chrome.browserAction.getBadgeText({
    tabId: activeInfo.tabId
  }, function(badge){
    if(badge == '+'){
      chrome.browserAction.setPopup({
       tabId: activeInfo.tabId,
       popup: ''
     });
    }
    else{
      chrome.browserAction.setPopup({
        tabId: activeInfo.tabId,
        popup: 'wvpopup.html'
      });
    }
  })
})

chrome.extension.onMessage.addListener(function(info, sender, cb){
	if ('getListPopupHtml' == info.msg) {
		cb({html: $('#wvpopup').html()});
	}

	if('getPopupHtml' == info.msg){
		cb({html: $('#wishlist_popup').html()});
	}

	if('addToWishlist' == info.msg){
		var data = {
			market: url_parser.getMarket(info.arg.url)[0],
			title: info.arg.wishlist_popup_title,
			price: info.arg.wishlist_popup_price,
			comments: info.arg.wishlist_popup_comments,
			imageurl: info.arg.wishlist_popup_imagelist_selected,
			url: info.arg.url
		};

		$.ajax({
			 type: 'POST',
			 url: 'http://wishapi-auth.cloudfoundry.com/wishlist',
			 data: data,
       contentType: 'application/x-www-form-urlencoded',
			 headers: {
				 'GX-AUTH': auth.getGX()
			 }
		 }).done(cb).error(function(error){
			cb({err:{msg: 'unknown error!'}});
		 })


		//listener must return true if you want to send a response after the listener returns
		return true;
	}
});