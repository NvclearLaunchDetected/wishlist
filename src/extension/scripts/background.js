var google = new OAuth2('google', {
  client_id: '939394320283.apps.googleusercontent.com',
  client_secret: 'SyozXTsqDKp9eUtfFFulc-uf',
  api_scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
});

var url_parser = new URLParser();

//browser action
chrome.browserAction.onClicked.addListener(function(tab){
  if(!google.getAccessToken()){
    google.authorize(function(){
      //api 완성되면 여기서 등록 call 날려야지~~    
    })
  }
})

//tabs handler
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  //현재 tab의 loading된 url이 변경 되면 패턴 조회
  if(!url_parser.isProduct(changeInfo.url)) {
    chrome.browserAction.setBadgeText({text:'', tabId: tabId});
    return;
  }

  //선택된 tabId로 한정됨. 다른 tab은 자동으로 badge 변경
  chrome.browserAction.setBadgeText({text:'+', tabId: tabId});
})