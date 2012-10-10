var url_parser = new URLParser();

//tabs handler
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	//„ìž¬ tabloadingurlë³€ê²˜ë©´ ¨í„´ ì¡°íšŒ
	console.log('onUpdated')
	if(!url_parser.isValid(tab.url)) {
		chrome.browserAction.setBadgeText({text:'', tabId: tabId});
		//set wish list as a default popup
		chrome.browserAction.setPopup({
			tabId: tab.tabId,
			popup: 'wvpopup.html'
		});
		return;
	}

	// íƒtabIdë¡œì • ¤ë¥¸ tab€ ë™¼ë¡œ badge ë³€ê²
	chrome.browserAction.setBadgeText({text:'+', tabId: tabId});
	 chrome.browserAction.setPopup({
		 tabId: tab.tabId,
		 popup: 'awpopup.html'
	 });
})

chrome.tabs.onActivated.addListener(function(activeInfo){
	console.log('onActivated')
  chrome.browserAction.getBadgeText({
    tabId: activeInfo.tabId
  }, function(badge){
    if(badge == '+'){
      chrome.browserAction.setPopup({
       tabId: activeInfo.tabId,
       popup: 'awpopup.html'
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
	if ('getProductInfo' == info.msg){
		chrome.tabs.executeScript(null, {code: 'getProductInfo()'}, function(res){
		 	cb(res[0]);
		})

		return true;
	}

	if ('getListPopupHtml' == info.msg) {
		cb({html: $('#wvpopup').html()});
	}
});