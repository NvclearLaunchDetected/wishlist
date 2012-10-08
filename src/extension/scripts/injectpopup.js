var alreadyInjected = false;

function inject(tabId){
	console.log("inject on " + tabId);
	if(alreadyInjected) return;

	var popup = $(document.createElement('table')).attr("id", "add2wish_k2tw4YzP50x9BemQp").attr("tid", tabId);
	popup.attr('width','518px').attr('border',0).attr('cellpadding',0).attr('cellspacing',0).addClass('wishlist_popup');
	$(document.getElementsByTagName('body')).append(popup);

	chrome.extension.sendMessage({msg: 'getPopupHtml'}, function(res){
		popup.append(res.html);
		alreadyInjected = true;

		//scrapping data
		var scraper = new PageScraper();
		var selectedImageIndex = 0;
		var imageList = scraper.getGenericImageData();

		$('#wishlist_popup_title').val(scraper.getTitle());
		$('#wishlist_popup_price').val(scraper.getPrice());
		$('#wishlist_popup_imagelist_img').attr('src', imageList[selectedImageIndex].src);
		$('#wishlist_popup_imagelist_selected').val(encodeURIComponent(imageList[selectedImageIndex].src));
		$('#wishlist_popup_imagelist_count').text(selectedImageIndex+1 + ' / ' + imageList.length);

		//add event handlers
		$('.wishlist_popup_close').click(function(){
			console.log("un-inject on " + tabId);
			setTimeout(function(){
				$('#add2wish_k2tw4YzP50x9BemQp').remove();
				alreadyInjected = false;
			},0)
		})

		$('#wishlist_popup_imagelist_prev').click(function(){
			if(selectedImageIndex>0) selectedImageIndex--;
			$('#wishlist_popup_imagelist_img').attr('src', imageList[selectedImageIndex].src);
			$('#wishlist_popup_imagelist_selected').val(encodeURIComponent(imageList[selectedImageIndex].src));
			$('#wishlist_popup_imagelist_count').text(selectedImageIndex+1 + ' / ' + imageList.length);
		})

		$('#wishlist_popup_imagelist_next').click(function(){
			if(selectedImageIndex<imageList.length) selectedImageIndex++;
			$('#wishlist_popup_imagelist_img').attr('src', imageList[selectedImageIndex].src);
			$('#wishlist_popup_imagelist_selected').val(encodeURIComponent(imageList[selectedImageIndex].src));
			$('#wishlist_popup_imagelist_count').text(selectedImageIndex+1 + ' / ' + imageList.length);
		})

		$('#wishlist_popup_addtowishlist').click(function(){
			var form_data = $('#wishlist_popup_form').serializeJSON();
			form_data.url = document.location.href;
			addToWishlist(form_data);
		})
	});
}

function addToWishlist(data){
	chrome.extension.sendMessage({msg: 'addToWishlist', arg:data}, function(res){
		//{ err : {code : int, msg : string}, data : { ... } } 
		if(res.err){
			alert(res.err.msg);
			return;
		}

		if(!res.data){
			alert('unknown error!!');
			return;
		}

		alert('added');
	})
}

(function($) {
$.fn.serializeJSON = function() {

   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};
})(jQuery);