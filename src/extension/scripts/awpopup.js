var url_parser = new URLParser();
var scrapInfo = {};
var selectedImageIndex = 0;

function setDefaultMode(){
	console.log('on popup')
	chrome.tabs.getSelected(function(tab){
		console.log(tab);
		chrome.extension.sendMessage(null, {msg: 'setDefaultMode', tabId: tab.id}, function(res){
			console.log(res.msg);
		});
	})
}

function popNotification(msg){
	var notification = webkitNotifications.createNotification(
	  'img/myfav_i19.png',  // icon url - can be relative
	  '관심상품 추가',  // notification title
	  msg  // notification body text
	);
	
	// Then show the notification.
	notification.show();
	notification.onclose = function(){
		console.log('closing! notification');
	}

	setTimeout(function(){
	 	notification.close();
	}, 2000)
}

$(document).ready(function(){
	chrome.extension.sendMessage(null, {msg: 'getProductInfo'}, function(info){
		if(!info) return;
		console.log(info);

		scrapInfo = info;
		if(scrapInfo.title) $('#inputTitle').val(scrapInfo.title);
		if(scrapInfo.price) $('#inputPrice').val(scrapInfo.price);
		if(scrapInfo.imageList && scrapInfo.imageList.length) {
			$('#selectedImage').attr('src', scrapInfo.imageList[selectedImageIndex].src);
			$('#inputImage').val(scrapInfo.imageList[selectedImageIndex].src);
			$('#selectedImageNum').text(selectedImageIndex+1 + ' / ' + scrapInfo.imageList.length);
		}
	});

	$('#prevImage').click(function(){
		if(selectedImageIndex > 0) selectedImageIndex--;

		if(scrapInfo.imageList && scrapInfo.imageList.length) {
			$('#selectedImage').attr('src', scrapInfo.imageList[selectedImageIndex].src);
			$('#inputImage').val(scrapInfo.imageList[selectedImageIndex].src);
			$('#selectedImageNum').text(selectedImageIndex+1 + ' / ' + scrapInfo.imageList.length);
		}

	})

	$('#nextImage').click(function(){
		if(selectedImageIndex < scrapInfo.imageList.length) selectedImageIndex++;

		if(scrapInfo.imageList && scrapInfo.imageList.length) {
			$('#selectedImage').attr('src', scrapInfo.imageList[selectedImageIndex].src);
			$('#inputImage').val(scrapInfo.imageList[selectedImageIndex].src);
			$('#selectedImageNum').text(selectedImageIndex+1 + ' / ' + scrapInfo.imageList.length);
		}
	});

	$('#addToWishlist').click(function(){
		if($(this).val() == 'Close') {
			window.close();
			return;
		}

		var that = this;
		var form_data = $('form').serializeJSON();
		form_data.market = scrapInfo.market;
		form_data.market_item_id = scrapInfo.market_item_id;
		form_data.url = scrapInfo.url;
		console.log('scarpinfo: ')
		console.log(scrapInfo);
		$('#addToWishlist').button('loading');
		addToWishlist(form_data, function(res){
			if(res.err){
				$('#addToWishlist').button('reset');
				popNotification(res.err.msg);
			}
			else{
				$('#addToWishlist').button('complete');
				setDefaultMode();
				popNotification('[' + Markets.getMarket(form_data.market) +'] ' + form_data.market_item_id + ' 이(가) 관심상품으로 추가되었습니다.')
				window.close();
			}
		})
	})
});

function addToWishlist(data, cb){
	var auth = new Auth();
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
}

