//api 완성되면 곧 사라질 script 파일...
function printUserInfo(userinfo){
	$('#userInfo').html(userinfo);
}

var background = chrome.extension.getBackgroundPage();
printUserInfo(background.google.getAccessToken());


