exports.list = function(req, res){
  res.json({ 
  	t: 99, // wishlist에 저장된 전체 건 수
  	p: 0, // 현재 목록 페이지 인덱스 (0 ~ )
  	d: [ // wish 목록
  		{
  			wid: 21390459435, // wish id (unique)
  			s: 1, // site id (1:G마켓, 2:옥션, 3:11st, 4:인터파크, ... )
  			u:'http://item.gmarket.co.kr/detailview.aspx?gdno=012345678', // 상품의 실제 VIP url
  			t: '보솜이 물티슈 젤 잘 나가요 우헤헤', // 상품명
  			p: 5500, // 상품 가격
  			c: 237494, // 카탈로그 ID (About.co.kr)
  			px: [ // 카탈로그 매칭이 된 상품의 경우, 상위 3개 최저가 상품의 간략 정보
  				{
  					s: 3, // site id
  					u:'http://itempage3.auction.co.kr/detailview.aspx?itemno=A12345678', // 상품의 실제 VIP url
  					p: 6230 // 상품 가격
  				},
  				{ s: 7,
  					u:'http://itempage3.auction.co.kr/detailview.aspx?itemno=A12345678',
  					p: 6230
  				}
  			]
  		}
  	]
  });
};

exports.item = function(req, res) {
	res.json({});
}