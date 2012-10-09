
var auth = chrome.extension.getBackgroundPage().auth;
var url_parser = chrome.extension.getBackgroundPage().url_parser;
var scrapInfo = {};
var selectedImageIndex = 0;


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

		$('#addToWishlist').button('loading');
		addToWishlist(form_data, function(res){
			if(res.err){
				$(that).popover({
					animation: true,
					placement: 'top',
					title: '실패',
					content: res.err.msg
				});
				$(that).popover('show');
				$('#addToWishlist').button('reset');
			}
			else{
				$(that).popover({
					animation: true,
					placement: 'right',
					title: '성공',
					content: '성공적으로 관심상품을 추가했습니다.'
				});
				$(that).popover('show');
				$('#addToWishlist').button('complete');
			}
		})
	})
});

function addToWishlist(data, cb){
	auth.required(function(){
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
	})
}