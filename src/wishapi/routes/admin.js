var mongoose = require('mongoose'),
    schema = require('./schema'),
    db = mongoose.createConnection('localhost', 'wish'),
    err_code = require('./err_code');


var Item = db.model('Item', schema.item),
    User = db.model('User', schema.user);

exports.getWishList = function(req, res){
    var market = req.query.market;
    var market_item_id = req.query.market_item_id;
    var page_size = req.query.ps;
    var page_no = req.params.page_no;

    // 조회 조건
    var query = {};

    if (market != undefined){
      query.market = market;
    }
    if( market_item_id != undefined){
      query.market_item_id = market_item_id;
    }

    var itemCountCallback = function(err, count){
      if(err){
        console.log(err);
        res.json({
          err : {
            code : err_code.CAN_NOT_COUNT_ITEM,
            msg : err.message
          }
        });
      }
      else{
        // range 조건
        var range = {sort:{reg_date:-1}};

        page_size = (page_size == undefined)?10:page_size;
        range.limit = page_size;

        if(page_no != undefined){
          range.skip = page_no * page_size;
        }
        else {
          page_no = 0;
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
                t : count,
                p : page_no,
                s : page_size,
                items : items
              });
            }
        };

        //var select = "market title price market_item_id comments url imageurl reg_date";

        Item.find(query, null, range, itemFindCallback);
      }
      
    };

    Item.count(query, itemCountCallback);
};

exports.getUserList = function(req, res) {
  var userFindCallback = function(err, users){
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
      res.json(users);
    }
  }

  User.find(userFindCallback);
};