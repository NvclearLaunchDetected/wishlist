var url_parser = new URLParser();
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
				$('#addToWishlist').button('reset');
				$('#alertdiv').errorAlert(res.err.msg);
			}
			else{
				$('#addToWishlist').button('complete');
				$('#alertdiv').successAlert('Added!');
			}
		})
	})
});

function addToWishlist(data, cb){
	var auth = new Auth();

	auth.getGX(function(gx){
		$.ajax({
			type: 'POST',
			url: 'http://wishapi-auth.cloudfoundry.com/wishlist',
			data: data,
				contentType: 'application/x-www-form-urlencoded',
			headers: {
				'GX-AUTH': gx
			}
		}).done(cb).error(function(error){
			cb({err:{msg: 'unknown error!'}});
		})
	});
}

