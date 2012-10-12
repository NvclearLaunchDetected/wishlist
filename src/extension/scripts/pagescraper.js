var urlparser = new URLParser();
var maxRequestLength = 4096;

var PageScraper = function() {
};

PageScraper.prototype.getGenericItemData = function(){
  var itemData = {};
  itemData.title = this.getTitle();
  itemData.price = this.getPrice();
  itemData.imageArray = this.getGenericImageData();
  return itemData;
};

PageScraper.prototype.getPrice = function() {
    var info = urlparser.parse(window.location.href);
    if(info && info.market == 'auction'){
      var pricereg = /.*\('SellPrice',(.*)\..*/;
      price_tokens = pricereg.exec($('#SellPrice').attr('flashvars'));
      if(price_tokens.length > 1) return price_tokens[1];
    }

    if(info && info.market == 'gmarket'){
      var dc_price_elm = $('#dc_price');
      if(dc_price_elm && dc_price_elm.length){
        var dc_price = dc_price_elm.text();
        var commentIncluded = dc_price.match(/<!--\s*.*\s*.*-->\s*(\d*)/);
        if(commentIncluded && commentIncluded.length > 1){
          dc_price = commentIncluded[1];
        }
        
        dc_price = dc_price.replace(',','');
        dc_price = dc_price.replace('원','');
        return dc_price;
      }
      
      if(price_tokens.length > 1) return price_tokens[1];
    }

    return 0;
};

PageScraper.prototype.sortImage = function(a, b){
	return (b.height*b.width) - (a.height*a.width);
}

PageScraper.prototype.getGenericImageData = function(includeSrc) {
      var imgs = document.getElementsByTagName('img');
      var imageArray = [];
      for (var i=0;i<imgs.length;i++) {
        if (imgs[i].src.length > maxRequestLength) {
           continue;
        }
        var pixelCount = imgs[i].height * imgs[i].width;
        var squareness = 1;
        if (imgs[i].id && imgs[i].id == '__uwl_img_copy__'){
           continue;
        }
        if (imgs[i].id && imgs[i].id == 'uwl_logo'){
           continue;
        }
        
        if (imgs[i].height > imgs[i].width && imgs[i].height > 0) {
          squareness = imgs[i].width / imgs[i].height;
        } else if (imgs[i].width > imgs[i].height && imgs[i].width > 0) {
          squareness = imgs[i].height / imgs[i].width;
        }

        if (pixelCount > 1000 && squareness > 0.5 
            || (includeSrc && imgs[i].src == includeSrc)) {
          var imageIndex = imageArray.length;
          imageArray[imageIndex] = {};
          imageArray[imageIndex].src = imgs[i].src;
          imageArray[imageIndex].height = imgs[i].height;
          imageArray[imageIndex].width = imgs[i].width;
        }
      }
      
      var sortFunc= function(a,b) {
          if (includeSrc) {
             if (a.src == includeSrc && b.src != includeSrc) {
                return -1;
             }
             if (a.src != includeSrc && b.src == includeSrc) {
                return 1;
             }
          }
          return PageScraper.prototype.sortImage(a, b);
      };
      imageArray.sort(sortFunc);

      var info = urlparser.parse(window.location.href);
      if(info.market == 'gmarket'){
        if(!$('#GoddsImageElem').length) return imageArray;

        imageArray[0] = { src: $('#GoddsImageElem').attr('src')}
      }

      if(info.market == 'auction'){
        if(!$('#ucImageNavigator_himgBig1').length) return imageArray;

        imageArray[0] = { src: $('#ucImageNavigator_himgBig1').attr('src')}
      }

      return imageArray;
};

PageScraper.prototype.getTitle = function() {
  
  //사이트별 title 패턴...
  var info = urlparser.parse(window.location.href);
  if(info && info.market == 'auction'){
    if($('#hdivItemTitle') && $('#hdivItemTitle').text()) 
      return $('#hdivItemTitle').text();
  }

  if(info && info.market == 'gmarket'){
    if($('#gd_nm') && $('#gd_nm').val()) 
      return $('#gd_nm').val()
  }
    

  var title = window.document.title;
  if(typeof title != "string") {
    return "";
  }

  title = title.replace(/\s+/g,' ');
  title = title.replace(/^\s*|\s*$/g,'');
  

  return title;
};


function getProductInfo(){
  var scraper = new PageScraper();
  var marketInfo = urlparser.parse(window.location.href) || {} ;
  return { title: scraper.getTitle(), 
    price: scraper.getPrice(), 
    imageList: scraper.getGenericImageData(),
    market: Markets.getCode(marketInfo.market),
    market_item_id: marketInfo.itemno,
    url: window.location.href
  };
}