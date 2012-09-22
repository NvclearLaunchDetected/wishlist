
/**
 * 가격 비교 정보 조회
 * parameter
 *    - c : 카탈로그 ID
 *    - m : 결과 목록의 최대 결과
 */
exports.list = function(req, res){
	res.json({
		t: 99, // wishlist에 저장된 전체 건 수
		p: 0, // 현재 목록 페이지 인덱스 (0 ~ )
		d: [ // wish 목록
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
	});
};