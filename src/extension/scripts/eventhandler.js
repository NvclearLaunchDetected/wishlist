var url_parser = new URLParser();

function setDefault(tabId){
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
}

//tabs handler
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if(!url_parser.isValid(tab.url)) {
		setDefault(tabId);
		return;
	}

	setAddMode(tabId);
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