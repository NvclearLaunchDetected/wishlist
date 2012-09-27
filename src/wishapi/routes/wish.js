var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'wish');

var schema = mongoose.Schema({ 
  market : Number,                                // 마켓정보 ()
  title : String,                                 // 상품명
  price : String,                                 // 가격
  market_item_id : String,                        // 마켓별 상품 아이디
  url : String,                                   // 상품 VIP url
  user_id : mongoose.Schema.Types.ObjectId,        // 사용자 ID
  regDate : { type: Date, default: Date.now }     // 생성일
});

var Item = db.model('Item', schema);

exports.items = function(req, res){
  //token 으로 user_id 조회

  Item.find(function(err, items){
        if(err){
          console.log(err);
          res.json(false);
        }
        else {
          res.json(items);
        }
  });
};

exports.item = function(req, res) {
	var info = req.body;

  // token 으로 user_id 조회

  var item = new Item({
    market : info.market,
    title : info.title,
    price : info.price,
    market_item_id : info.market_item_id,
    url : info.url,
    user_id : mongoose.Types.ObjectId('5062e5f3e62b45a027000003')
  });

  item.save(function(err){
    if(err){
      console.log(err);
      res.json(false);
    }
    else{
      res.json(true);
    }
  });
}

exports.removeItem = function(req, res) {
  var item_id = mongoose.Types.ObjectId(req.params.item_id);
  Item.remove({_id:item_id}, function(err){
    if(err){
      console.log(err);
      res.json(false);
    }
    else{
      res.json(true);
    }
  });
}

exports.isExist = function(req, res){
  var market = req.body.market;
  var market_item_id = req.body.market_item_id;

  Item.findOne({market : market, market_item_id : market_item_id},
    function(err, item){
      if(err){
        console.log(err);
        res.json(null);
      }
      else{
        if(item == null){
          res.json(false);
        }
        else{
          res.json(true);
        }
      }
    });
}