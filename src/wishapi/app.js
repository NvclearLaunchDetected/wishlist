/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , wish = require('./routes/wish')
  , admin = require('./routes/admin');

var app = express();

app.configure(function(){
  //app.set('port', 80);
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//app.get('/', routes.index);

/**
 * WishList
*/ 
app.get('/wishlist', wish.getWishList);
app.get('/wishlist/:page_no', wish.getWishList);
app.post('/wishlist', wish.addItem);
app.del('/wishlist/:item_id', wish.removeItem);
app.post('/wishlist/:item_id/share',wish.shareItem);
//app.get('/catalog/list', catalog.list);

/**
* User
*/
app.post('/user/auth', user.authorization);


app.get('/admin/user', admin.getUserList);
app.get('/admin/wishlist/:page_no', admin.getWishList);
app.get('/admin/wishlist', admin.getWishList);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
