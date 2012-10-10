var maxRequestLength = 4096;

var PageScraper = function() {
  this.itemData = {};
  this.itemData = this.getGenericItemData();
};

PageScraper.prototype.getGenericItemData = function(){
  var itemData = {"unverified" : true};
  itemData.title = this.getTitle();
  itemData.price = this.getPrice();
  itemData.imageArray = this.getGenericImageData();
  return itemData;
};

PageScraper.prototype.getPrice = function() {
    var startTime = new Date().getTime();
    var nodes = [];
    var nonZeroRe = /[1-9]/;
    var priceFormatRe = /((?:\$|USD|\&pound\;|\&\#163\;|\&\#xa3\;|\u00A3|\&yen\;|\uFFE5|\&\#165\;|\&\#xa5\;|\u00A5|eur|\&\#8364\;|\&\#x20ac\;)\s*\d[0-9\,\.]*)/gi;
    var textNodeRe = /textnode/i;
    var emRe = /em/;
    var priceRangeRe = /^(\s|to|\d|\.|\$|\-|,)+$/; 
    var priceBonusRe = /club|total|price|sale|now|brightred/i;
    var outOfStockRe = /soldout|currentlyunavailable|outofstock/i;
    var tagRe = /^(h1|h2|h3|b|strong|sale)$/i;
    var anchorTagRe = /^a$/i;

    var penRe = /original|header|items|under|cart|more|nav|upsell/i;
    
    var last = "";
    var lastNode;
    var outOfStockIndex = -1;
    var foundPositivePriceBeforeOOSMsg = 0;

    var performOutOfStockCheck = function(domainStr) {
       var blacklist = new Array("toysrus.com", "babiesrus.com", "walmart.com");

       for (var i = 0; i < blacklist.length; i++) {
         var regex = new RegExp("^(?:www\.)?" + blacklist[i], "i");
         if (regex.test(domainStr)) {
           return false;
         } 
       }

       return true;
    };

    var getParents = function(node) {
        var parents = [];
        var traverse = node;
        while(traverse.parentNode) {
        parents.push(traverse.parentNode);
        traverse = traverse.parentNode;
        }
        return parents;
    };
    
    var findMutualParent = function(first,second) {

        var firstParents = getParents(first);
        var secondParents = getParents(second);

        for(var i = 0; i < firstParents.length; i++) {
        for(var j = 0; j < secondParents.length; j++) {
            if(firstParents[i] === secondParents[j]) {
                return firstParents[i];
                }
            }
        }
        return undefined;
    };
    
    var getStyleFunc = function(node) {
        if(document.defaultView && document.defaultView.getComputedStyle) {
            var computedStyle = document.defaultView.getComputedStyle(node,null);
            return function(propertyName) {
                return computedStyle.getPropertyValue(propertyName);
                };
        } else {
            return function(propertyName) {

                var mapper = {
                    "font-size" : "fontSize",
                    "font-weight" : "fontWeight",
		    "text-decoration" : "textDecoration"
                };
                
                return node.currentStyle[ mapper[propertyName] ? mapper[propertyName] : propertyName ];
                };
        }
    };
    
    
    var getWalker = function() {
        if(document.createTreeWalker) {
        return document.createTreeWalker(document.body,
                                       NodeFilter.SHOW_TEXT,
                                       function(node) {
                                           return NodeFilter.FILTER_ACCEPT;
                                       },
                                       false
                                      );
    
        } else {


        return {
            q : [],
            intialized : 0,
            currentNode : undefined,
            nextNode : function() {
                if(!this.initialized) {
                    this.q.push(document.body);
                    this.initialized = true;
                }
                
                while(this.q.length) {
                    var working = this.q.pop();
                    if(working.nodeType == 3) {
                        this.currentNode = working;
                        return true;
                    } else if(working.childNodes) {


                        if(working.style && 
                           (working.style.visibility == "hidden" || 
                            working.style.display == "none")) {
                            continue;
                        }

                        var children = new Array(working.childNodes.length);
                        for(var i = 0; i < working.childNodes.length; i++) {
                            children[i] = working.childNodes[i];
                        }
                        children.reverse();
                        this.q = this.q.concat(children);
                    }
                }
                return false;
            }
        };
        }
    };

    var getFontSizePx = function(styleFunc) {

        var fontSize = styleFunc("font-size") || "";
        var sizeFactor = emRe.test(fontSize) ? 16 : 1;

        fontSize = fontSize.replace(/px|em|pt/,"");
        fontSize -= 0;

        if(!isNaN(fontSize)) {
            return fontSize * sizeFactor;
        } else {
            return 0;
        }
    };

    var getOffset = function(node) {

	var offset = node.offsetTop;

	while(node.offsetParent) {
	    node = node.offsetParent;
	    offset += node.offsetTop;
	}

	return offset;
    };

    var getScore = function(node, index) {

        var domNode = node.node;
        var styledNode = domNode.nodeType == 3 ? domNode.parentNode : domNode;

        var price = node.price;
        var content = "";

        if(domNode.nodeType == 3) {
            content = domNode.data;
        } else {
            content = domNode.innerText || domNode.textContent;
        }
    
        var score = 0;
        var getStyle = getStyleFunc(styledNode);
	
	var fontWeight = getStyle("font-weight");

        if(getStyle("font-weight") == "bold") {
            score += 1;
        } 

       if(!styledNode.offsetWidth && !styledNode.offsetHeight ||
           getStyle("visibility") == "hidden" ||
           getStyle("display") == "none") {
                           score -= 100;
        }

        var parentsChildrenContent = (domNode.parentNode.innerText || domNode.parentNode.textContent).replace(/\s/g,"");
	var strippedContent = content.replace(/\s+/g,"");
	


            if(!nonZeroRe.test(price)) {
                score -= 100;
            }

	var strippedContentNoPrice = strippedContent.replace(/price|our/ig,"");
        if(strippedContentNoPrice.length < price.length * 2 + 4) {
	    score += 10;
	}

	if(priceRangeRe.test(strippedContent)) {
	    score += 2;
	}

	if(price.indexOf(".") != -1) {
	    score += 2;
	}

	score -= Math.abs(getOffset(styledNode) / 500);

        score += getFontSizePx(getStyle);
       
        if (penRe.test(content)) { score-=4; }
        if (priceBonusRe.test(content)) { score++; }
        domNode = styledNode;

        var parentsWalked = 0;

        while (domNode !== null &&
	       domNode != document.body &&
               parentsWalked++ < 4 ) {


	    if(parentsWalked !== 0) {
		getStyle = getStyleFunc(domNode);
	    }

            if(getStyle("text-decoration") == "line-through") {
		 score -=100;
            }



            for(var i = 0; i < domNode.childNodes.length; i++) {

                if(domNode.childNodes[i].nodeType == 3) {
                    
                    var tnode = domNode.childNodes[i];
                    
                    if(tnode.data) {
                        if(priceBonusRe.test(tnode.data)) {
                            score += 1;
                        }
                        
                        if(penRe.test(tnode.data)) {
                            score -= 1;
                        }
                    }
                }
            }

	    if(anchorTagRe.test(domNode.tagName)) {
		score -=5 ;
	    }
            if (priceBonusRe.test(domNode.getAttribute('class') || 
                                  domNode.getAttribute('className'))) {
                score+=1;
            }

            if (priceBonusRe.test(domNode.id)) {
                score+=1;
            }

            if (tagRe.test(domNode.tagName)) {
                score += 1;
            }

            if (penRe.test(domNode.tagName)) {
                score -= 1;
            }

            if (penRe.test(domNode.id)) {
                score -= 2;
            }
            
            if (penRe.test(domNode.getAttribute('class') ||
                           domNode.getAttribute('className'))) {
                score -= 2;
            }

            domNode = domNode.parentNode;

        }
        
	
        score -= content.length / 100;

        score -= index / 5;

        return score;

    };

    walker = getWalker();


    while(walker.nextNode() && nodes.length < 100) {

        if( nodes.length % 100 === 0 ) {
            if( new Date().getTime() - startTime > 1500 ) {
                return;
            }
        }

        var node = walker.currentNode;
    
        var text = node.data.replace(/\s/g,"");
        priceFormatRe.lastIndex = 0;
        var priceMatch = text.match(priceFormatRe);
        
        //If OutofStockIndex has not been set and we found a OOS string then
        // we set the index to number of price matches found before this match
        if((outOfStockIndex < 0) && outOfStockRe.test(text) && performOutOfStockCheck(document.domain)) {
             outOfStockIndex = nodes.length;
        }	
        if(priceMatch) {

           if (priceMatch[0].match(/\.$/g) && walker.nextNode()) {
             var nextNode = walker.currentNode;
             if (nextNode && nextNode.data) {
               var nextPrice = nextNode.data.replace(/\s/g,"");
               if (nextPrice && isNaN(nextPrice)) {
                 nextPrice = "00";
               }
               priceMatch[0] += nextPrice;
             }
           } else if (priceMatch[0].match(/\,$/g)) {
             priceMatch[0] = priceMatch[0].substring(0, priceMatch[0].length - 1);
           }
          
           nodes.push(
             {
                "node" : node,
                "price" : priceMatch[0]
             }
           );
           text = "";
        } else if( last !== "" && text !== "") {
           priceMatch = (last + text).match(priceFormatRe);
           if(priceMatch) {
             var mutual = findMutualParent(lastNode,node);
             nodes.push({"node" : mutual, "price" : priceMatch[0]});
           }
        }
    
        lastNode = node;
        last = text;
    }


    var max = undefined;
    var maxNode = undefined;

    for(var i = 0; i < nodes.length; i++) {
        var score = getScore(nodes[i], i);
        //Trying to see if we found a positive price before we found a OOS match
        if((i < outOfStockIndex) && (score > 0)) {
           foundPositivePriceBeforeOOSMsg = 1;
         }
        if(max === undefined || score > max) {
         max = score;
         maxNode = nodes[i];
        }
    }

    if(maxNode && ((outOfStockIndex < 0) || foundPositivePriceBeforeOOSMsg)) {
     return maxNode.price;
    }
}
;

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
      return imageArray;
};

PageScraper.prototype.getElementsByClassName = function(className, elem) {
      elem = elem || document;
      var matches = [];
      if (document.getElementsByClassName) {
        try {
          var elems = elem.getElementsByClassName(className);
          for(var i = 0; i < elems.length; i++) {
            matches.push(elems[i]);
          }
        }
        catch (err) {
            matches = this.getElementsByClassNameFallback(className, elem);           
        }
        return matches;
      }
      else if(document.evaluate) {
        var node;
        var elems = document.evaluate(".//*[contains(concat(' ', @class, ' '),' " + className + " ')]",
                       elem, null, 0, null);
        while (node = elems.iterateNext()) {
          matches.push(node);
        }
        return matches;
      }
      else {
        matches = this.getElementsByClassNameFallback(className, elem);
        return matches;
      }
};

PageScraper.prototype.getElementsByClassNameFallback = function(className, elem) {
      var matches = [],
          elems = elem.getElementsByTagName("*"),
          regex = new RegExp("(^|\\s)" + className + "(\\s|$)");

       for(var i = 0; i < elems.length; i++) {
          if(regex.test(elems[i].className)) {
            matches.push(elems[i]);
          }
        }

      return matches;
};

PageScraper.prototype.extractValue = function(elem) {
      if (elem.nodeName == "IMG" || elem.nodeName == "IFRAME") {
        return elem.src;
      } else if (elem.nodeName == "INPUT") {
        return elem.value;
      }
      return elem.innerHTML;
};

PageScraper.prototype.getTitle = function() {
  var title = window.document.title;
  if(typeof title != "string") {
    return "";
  }
    
  title = title.replace(/\s+/g,' ');
  title = title.replace(/^\s*|\s*$/g,'');
  
  //사이트별 title 패턴...
  return title;
};

var scraper = new PageScraper();
var urlparser = new URLParser();
function getProductInfo(){
  var marketInfo = urlparser.parse(document.location.href) || {} ;
  return { title: scraper.getTitle(), 
    price: scraper.getPrice(), 
    imageList: scraper.getGenericImageData(),
    market: Markets.getCode(marketInfo.market),
    market_item_id: marketInfo.itemno,
    url: document.location.href
  };
}