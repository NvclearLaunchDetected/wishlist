var mongoose = require('mongoose'),
    schema = require('./schema'),
    db = mongoose.createConnection('localhost', 'wish'),
    err_code = require('./err_code');


var Item = db.model('Item', schema.item),
    User = db.model('User', schema.user);

exports.getWishList = function(req, res){
    var market = req.query.market;
    var market_item_id = req.query.market_item_id;

    // 조회 조건
    var query = {};

    if (market != undefined)
    {
      query.market = market;
    }
    if( market_item_id != undefined)
    {
      query.market_item_id = market_item_id;
    }

    var itemFindCallback = function(err, items){
      if(err){
          console.log(err);
          res.json({
            err : {
              code : err_code.CAN_NOT_FIND_ITEM,
              msg : err.message
            }
          });
        }
        else {
          res.json({
            data : items
          });
        }
    };

    Item.find(query, itemFindCallback);
};

exports.getUserList = function(req, res) {
  var userFindCallback = function(err, user){
    if (err){
      console.log(err);
      res.json({
        err : {
          code : err_code.CAN_NOT_FIND_USER,
          msg : err.message
        }
      });
    }
    else {
      res.json({
          data : user
      });
    }
  }

  User.findOne(userFindCallback);
};