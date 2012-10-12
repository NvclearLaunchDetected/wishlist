var url_parser = new URLParser();
var scrapInfo = {};
var selectedImageIndex = 0;
var inputCache;

function setDefaultMode(){
	console.log('on popup')
	chrome.tabs.getSelected(function(tab){
		console.log(tab);
		chrome.extension.sendMessage(null, {msg: 'setDefaultMode', tabId: tab.id}, function(res){
			console.log(res.msg);
		});
	})
}

function popNotification(body){
	chrome.extension.sendMessage(null, {msg: 'popNotification', title: '관심상품 추가', body: body})
}

function priceFormat(n) {
	var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
	n += '';                          // 숫자를 문자열로 변환

	while (reg.test(n))
		n = n.replace(reg, '$1' + ',' + '$2');
	return n;
}

function saveInputCache(){
	inputCache.title = $('#inputTitle').val();
	inputCache.price = $('#inputPrice').val();
	inputCache.comments = $('#inputComments').val();
	inputCache.imgNo = selectedImageIndex;

	chrome.storage.local.set({"inputCache":inputCache}, null);
	console.log("Save inputCache");
	console.log(inputCache);
}

$(document).ready(function(){
	chrome.extension.sendMessage(null, {msg: 'getProductInfo'}, function(info){
		if(!info) return;
		//console.log(info);

		scrapInfo = info;

		chrome.storage.local.get("inputCache", function(data){
			inputCache = data.inputCache;
			console.log("Load inputCache");
			console.log(inputCache);
			if(inputCache && inputCache.url != undefined && inputCache.url != '' && inputCache.url == scrapInfo.url){
				if(inputCache.title != undefined && inputCache.title != ''){
					$('#inputTitle').val(inputCache.title);
				}else{
					if(scrapInfo.title) $('#inputTitle').val(scrapInfo.title);
				}

				if(inputCache.price != undefined && inputCache.price != ''){
					$('#inputPrice').val(inputCache.price);
				}else{
					if(scrapInfo.title) $('#inputPrice').val(priceFormat(scrapInfo.price));
				}

				if(inputCache.comments != undefined && inputCache.comments != ''){
					$('#inputComments').val(inputCache.comments);
				}

				if(inputCache.imgNo != undefined){
					selectedImageIndex = inputCache.imgNo;

					if(scrapInfo.imageList && scrapInfo.imageList.length) {
						if(scrapInfo.imageList.length <= selectedImageIndex)selectedImageIndex = 0;
						$('#selectedImage').attr('src', scrapInfo.imageList[selectedImageIndex].src);
						$('#inputImage').val(scrapInfo.imageList[selectedImageIndex].src);
						$('#selectedImageNum').text(selectedImageIndex+1 + ' / ' + scrapInfo.imageList.length);
					}
				}
			}else {
				inputCache = {};
				inputCache.url = scrapInfo.url;

				if(scrapInfo.title) $('#inputTitle').val(scrapInfo.title);
				if(scrapInfo.price) $('#inputPrice').val(priceFormat(scrapInfo.price));
			}
		});

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

	$('#inputPrice').css("imeMode","disabled").bind("keypress", function(e){
		if((e.keyCode < 8 || e.keyCode > 9)&&(e.keyCode < 48 || e.keyCode>57)){
			return false;
		}
	}).keyup(function(){
		if($(this).val()!=null && $(this).val()!=''){
			$(this).val(priceFormat($(this).val().replace(/[^0-9]/g, '')));
			chrome.storage.local.set(inputCache);
		}
	});

	$('#inputTitle').focusout(function(){
		saveInputCache();
	});

	$('#inputPrice').focusout(function(){
		saveInputCache();
	});

	$('#inputComments').focusout(function(){
		saveInputCache();
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
				popNotification('[' + Markets.getMarket(form_data.market) +'] ' + form_data.market_item_id + ' 이(가) 관심상품으로 추가되었습니다.');
				chrome.storage.local.remove("inputCache");
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

