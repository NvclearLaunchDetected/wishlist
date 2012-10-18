var auth = new Auth();

//install시에 google oauth 인증
chrome.runtime.onInstalled.addListener(function(){
	console.log('oninstalled');
	auth.clear();
	auth.required(function(){
	 	console.log(auth.getAuthInfo());
	}, true);
})

chrome.runtime.onSuspend.addListener(function(){
	//chrome.storage.local.clear();
	//auth.clear();
})