var google = new OAuth2('google', {
  client_id: '939394320283.apps.googleusercontent.com',
  client_secret: 'SyozXTsqDKp9eUtfFFulc-uf',
  api_scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
});

var url_parser = new URLParser();

function getGoogleUserinfo(token, cb){
  $.ajax({
    type: 'get',
    url: 'https://www.googleapis.com/oauth2/v1/userinfo',
    headers: {
      'Authorization': 'OAuth ' + token
    }
  }).done(cb);
}

function authUser(token, info, cb){
  $.ajax({
    type: 'post',
    url: 'http://wishapi-auth.cloudfoundry.com/user/auth',
    data: {
      token: token,
      name: info.name,
      email: info.email,
      siteName: 'google'
    }
  }).done(cb);
}

//browser action
chrome.browserAction.onClicked.addListener(function(tab){
  //access token이 유효하지 않음.
  if(!google.getAccessToken() || google.isAccessTokenExpired()){
    google.authorize(function(){
      //구글 계정 정보 얻기
      getGoogleUserinfo(google.getAccessToken(), function(info){
        if(!info){
          //구글 계정 정보 얻기 실패. 어떻게 처리하지?
          return;
        }

        authUser(google.getAccessToken(), info, function(res){
          if(res.err){
            //wishlist 계정 인증 실패. 어쩌지?
            return;
          }

          if(!res.data){
            //얘도 계정 인증 실패. 어쩌지?
            return;
          }

          //계정인증 성공. wishlist action 수행
          chrome.browserAction.getBadgeText({ tabId: tab.id }, function(badge){
            if(badge == '+'){
              chrome.tabs.executeScript(null, {
                code: 'inject()'
              });
            }
          })
        })
      })
    });
  }
  else{
    //access token이 유효함
    chrome.browserAction.getBadgeText({ tabId: tab.id }, function(badge){
      if(badge == '+'){
        chrome.tabs.executeScript(null, {
          code: 'inject()'
        });
      }
    });
  }
});



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