//install시에 google oauth 인증
chrome.runtime.onInstalled.addListener(function(){
	console.log('oninstalled');
	var auth = new Auth();
	auth.authorize(function(userdata){
	 	console.log(JSON.stringify(userdata));
	});
})

chrome.runtime.onSuspend.addListener(function(){
	auth.required(function(){
		chrome.storage.local.clear();
	})
})