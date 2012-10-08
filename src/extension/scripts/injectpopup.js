var alreadyInjected = false;

function inject(){
	if(alreadyInjected) return;

	var popup = $(document.createElement('table'));
	popup.attr('width','518px').attr('border',0).attr('cellpadding',0).attr('cellspacing',0).addClass('wishlist_popup');
	$(document.getElementsByTagName('body')).append(popup);

	chrome.extension.sendMessage('getPopupHtml', function(res){
		popup.append(res.html);
		alreadyInjected = true;

		//scrapping data
		
		var scraper = new PageScraper();
		var selectedImageIndex = 0;
		var imageList = scraper.getGenericImageData();

		$('#wishlist_popup_title').val(scraper.getTitle());
		$('#wishlist_popup_price').val(scraper.getPrice());
		$('#wishlist_popup_imagelist_img').attr('src', imageList[selectedImageIndex].src);
		$('#wishlist_popup_imagelist_count').text(selectedImageIndex+1 + ' / ' + imageList.length);

		//add event handlers
		$('.wishlist_popup .close').click(function(){
			setTimeout(function(){
				$('.wishlist_popup').remove();
				alreadyInjected = false;				
			},0)
		})

		$('#wishlist_popup_imagelist_prev').click(function(){
			if(selectedImageIndex>0) selectedImageIndex--;
			$('#wishlist_popup_imagelist_img').attr('src', imageList[selectedImageIndex].src);
			$('#wishlist_popup_imagelist_count').text(selectedImageIndex+1 + ' / ' + imageList.length);
		})

		$('#wishlist_popup_imagelist_next').click(function(){
			if(selectedImageIndex<imageList.length) selectedImageIndex++;
			$('#wishlist_popup_imagelist_img').attr('src', imageList[selectedImageIndex].src);
			$('#wishlist_popup_imagelist_count').text(selectedImageIndex+1 + ' / ' + imageList.length);
		})
	});
}

