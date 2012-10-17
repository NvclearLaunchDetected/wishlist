var Markets = {
	codes: {
		'unknown': 0,
		'auction': 1,
		'gmarket': 2,
		'11st': 3,
		'gsshop': 4,
		'hyundaihmall': 5,
		'cjmall': 6,
		'lotteimall': 7,
		'interpark': 9,
		'lotte': 10,
		'dnshop': 12,
		'shinsegae': 13,
		'akmall': 14
	},

	logoUrls: [
		'img/empty.jpeg',
		'img/auction.jpeg',
		'img/gmarket.gif',
		'img/11st.png',
		'img/interpark.gif',
		'img/cjmall.gif',
		'img/lotte.com.gif',
		'img/lotteimall.gif'
	],

	logoUrls2: {
		'0': '',
		'1': 'http://i.iabout.kr/w/mall/1/201206/01/634741657009249317.GIF',
		'2': 'http://i.iabout.kr/w/mall/2/201206/01/634741658333197932.GIF',
		'3': 'http://i.iabout.kr/w/mall/3/201206/01/634741655623111212.GIF',
		'4': 'http://i.iabout.kr/w/mall/4/201206/01/634741658676958932.GIF',
		'5': 'http://i.iabout.kr/w/mall/5/201206/01/634741658921654262.GIF',
		'6': 'http://i.iabout.kr/w/mall/6/201206/01/634741657983260243.GIF',
		'7': 'http://i.iabout.kr/w/mall/7/201206/01/634741656292976397.GIF',
		'8': '',
		'9': 'http://i.iabout.kr/w/mall/9/201206/01/634741657235975322.GIF',
		'10': 'http://i.iabout.kr/w/mall/10/201206/01/634741656058655091.GIF',
		'11': '',
		'12': 'http://i.iabout.kr/w/mall/12/201206/01/634741655829680322.GIF',
		'13': 'http://i.iabout.kr/w/mall/13/201206/01/634741656549390852.GIF',
		'14': 'http://i.iabout.kr/w/mall/14/201206/01/634741657760282931.GIF'
	},

	getCode: function(market){
		if(!market)  return this.codes['unknown'];

		return this.codes[market.toLowerCase()] || this.codes['unknown'];
	},

	getMarket: function(code){
	 	for(var m in this.codes){
	 		if(code == this.codes[m]) return m;
	 	}		
	 	return 'unknown';
	},

	getLogoUrl: function(code){
		return this.logoUrls2[code];
	}
}