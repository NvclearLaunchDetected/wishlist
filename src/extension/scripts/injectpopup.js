var alreadyInjected = false;

function inject(){
	if(alreadyInjected) return;

	var popup = $(document.createElement('table'));
	popup.attr('width','518px').attr('border',0).attr('cellpadding',0).attr('cellspacing',0).addClass('wishlist_popup');
	$(document.getElementsByTagName('body')).append(popup);

	chrome.extension.sendMessage('getPopupHtml', function(res){
		popup.append(res.html);
		alreadyInjected = true;
		//add event handlers

		$('.wishlist_popup .close').click(function(){
			setTimeout(function(){
				$('.wishlist_popup').remove();
				alreadyInjected = false;				
			},0)
		})
	});
}

