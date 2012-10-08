var google = new OAuth2('google', {
  client_id: '939394320283.apps.googleusercontent.com',
  client_secret: 'SyozXTsqDKp9eUtfFFulc-uf',
  api_scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
});

var url_parser = new URLParser();

//browser action
chrome.browserAction.onClicked.addListener(function(tab){
  //기본 browser action 버튼은 무기능?
  //혹은 사용 안내 페이지?
  //그저 인증 수행할 뿐...

  /*if(!google.getAccessToken()){
    google.authorize(function(){
      //api 완성되면 여기서 등록 call 날려야지~~    
    })
  }*/

  chrome.browserAction.getBadgeText({ tabId: tab.id }, function(badge){
    if(badge == '+'){
      chrome.tabs.executeScript(null, {
        code: 'inject()'
      });
    }
  })
})

//tabs handler
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  //현재 tab의 loading된 url이 변경 되면 패턴 조회
  if(!url_parser.isProduct(tab.url)) {
    chrome.browserAction.setBadgeText({text:'', tabId: tabId});
    //set wish list as a default popup
     // chrome.browserAction.setPopup({
     //   tabId: tab.tabId,
     //   popup: ''
     // });
    return;
  }

  //선택된 tabId로 한정됨. 다른 tab은 자동으로 badge 변경
  chrome.browserAction.setBadgeText({text:'+', tabId: tabId});
   chrome.browserAction.setPopup({
     tabId: tab.tabId,
     popup: ''
   });
})

chrome.extension.onMessage.addListener(function(info, sender, cb){
  if('getPopupHtml' == info.msg){
    cb({html: $('#wishlist_popup').html()});
  }

  if('addToWishlist' == info.msg){
    var data = {
      market: 'gmarket',
      title: info.arg.wishlist_popup_title,
      price: info.arg.wishlist_popup_price,
      comments: info.arg.wishlist_popup_comments,
      imageurl: info.arg.wishlist_popup_imagelist_selected,
      url: 'test'
    };

    // $.ajax({
    //   type: 'POST',
    //   url: 'http://wishapi-auth.cloudfoundry.com/wishlist/'
    //   data: data,
    //   headers: {
    //     'GX-AUTH': 
    //   }
    // }).done(function(res){
    //   //{ err : {code : int, msg : string}, data : { ... } } 

    // })
  }
});