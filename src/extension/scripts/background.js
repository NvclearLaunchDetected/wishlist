var google = new OAuth2('google', {
  client_id: '939394320283.apps.googleusercontent.com',
  client_secret: 'SyozXTsqDKp9eUtfFFulc-uf',
  api_scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
});


chrome.browserAction.onClicked.addListener(function(tab){
  if(!google.getAccessToken()){
    google.authorize(function(){
      //api 완성되면 여기서 등록 call 날려야지~~    
      chrome.tabs.create({
        url: 'dummy.html'
      });
    })
  }
})