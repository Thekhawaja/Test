var newrelic  = require('newrelic');
// Create the http handler
var http = require('http');
 
// Set the http protocol to have 10 sockets
http.globalAgent.maxSockets = 1000;

// Dependencies
var express = require('express');
var cons = require('consolidate');

var settings = require('./conf/app_settings.js').settings;
var clientSession = require('./vroozi_modules/client-session');
var systemStatus = require('./vroozi_modules/system-status');
var common = require('./vroozi_modules/common');
var logger = require('./vroozi_modules/log-settings');
var test_clientSession = require('./vroozi_modules/test-client-session');
var translator = require('./vroozi_modules/file-translator');
var errorController = require('./vroozi_modules/error-controller');


landingPageTestService = require('./models/landing-page');
landingPageService = require('./controllers/live/landingPageService');
helpPageService = require('./controllers/live/helpService');
autoSuggestService = require('./controllers/live/autoSuggestService');
test_landingPageService = require('./controllers/test/landingPageService');
announcementService = require('./models/announcement');
headerDataService = require('./controllers/live/headerDataService');
test_headerDataService = require('./controllers/headerDataService');
test_shoppingCartService = require('./controllers/test/shoppingCartService');
shoppingCartBundleService = require('./controllers/live/shoppingCartBundleService');
test_shoppingCartBundleService = require('./controllers/test/shoppingCartBundleService');

shoppingCartQuoteService = require('./controllers/live/shoppingCartQuoteService');
test_shoppingCartQuoteService = require('./controllers/test/shoppingCartQuoteService');

test_productService = require('./controllers/test/productService');
productService = require('./controllers/live/productService');
shoppingCartService = require('./controllers/live/shoppingCartService');
searchService = require('./controllers/live/searchService');
test_searchService = require('./controllers/test/searchService');
test_myListsService = require('./controllers/test/myListsService');
myListsService = require('./controllers/live/myListsService');
reviewsService = require('./controllers/live/reviewsService');
imageDownloadService = require('./controllers/live/imageDownloadService');
savedSearchService = require('./controllers/live/savedSearchService');
test_savedSearchService = require('./controllers/test/savedSearchService');
catalogsService = require('./controllers/live/catalogsService');
test_catalogsService = require('./controllers/test/catalogsService');
punchoutService = require('./controllers/live/punchoutService');
compareService = require('./controllers/live/compareService');
test_compareService = require('./controllers/test/compareService');
purchaseRequest = require('./controllers/live/purchase/purchase-request');
messageCenter = require('./controllers/live/messageCenter');

categoryTreeService      =  require('./controllers/live/categoryTreeService');
test_categoryTreeService = require('./controllers/test/categoryTreeService');
supplierService = require('./controllers/live/supplierService');

var argv = require('optimist')
    .usage('Usage: $0 -port [num] -appStart [num] -gitHash [string]')
    .default('port', 3001)
    .default('appStart', new Date().getTime())
    .default('gitHash', '0000000')
    .argv;

var port = argv.port;
settings.appStart = parseInt(argv.appStart);
settings.gitHash = argv.gitHash; 

var testControllers = [];
testControllers.push(test_shoppingCartService, test_productService, test_searchService, test_myListsService, test_compareService);

// Init
var app = express();

// Custom Configuration
appMode = settings.appMode;  // prod or test

// Application Configuration
var oneHour = 3600000;
var oneDay = 86400000;
var oneWeek = 604800000;
var oneMonth = 2630000000;
var oneYear = 31557600000;


app.configure(function () {
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(app.router);
    app.set("views", __dirname + '/views');
    app.set("view options", {layout: false});
    app.set('view engine', 'html');
    app.engine(".html", cons.hogan);
    app.use(express.static(__dirname + '/public', { maxAge: oneWeek }));
    app.use(function(err, req, res, next){
        console.log("test..3");
        console.log( "UNCAUGHT EXCEPTION " );
        console.log( "[Inside 'uncaughtException' event] " + err.stack || err.message );
        var lang='eng';
        res.render('error.' + lang + '.html');
    });

});

// initialize template system
translator.initialize();

app.get('/health-check',function(req,res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('OK');
    }
);

app.get('/system-status', systemStatus.controller);

if (appMode == "prod") {
    app.get('*', clientSession.handler);
    app.post('*', clientSession.handler);
    app.put('*', clientSession.handler);
    app.delete('*', clientSession.handler);
}else if (appMode == "test") {
    app.get('*', test_clientSession.handler);
    app.post('*', test_clientSession.handler);
    app.put('*', test_clientSession.handler);
    app.delete('*', test_clientSession.handler);
}else{
    app.get('*', errorController.handler);
    app.post('*', errorController.handler);
    app.put('*', errorController.handler);
    app.delete('*', errorController.handler);
}


// -------------------------------------------------------------------------------------------------------
// Shopper end points start
// -------------------------------------------------------------------------------------------------------

app.put('/announcements/:id',announcementService.archive);

app.get('/landingpage-content', function(req,res) {
    var serviceName = "landingPageService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.data(req,res);
});


app.post('/FILLIN', function(req,res) {
    var serviceName = "punchoutService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.punchout(req,res);
});

app.post('/FILLIN/sid/:supplierid', function(req,res) {
    var serviceName = "punchoutService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.punchout(req,res);
});

app.post('/FILLIN/sid/:supplierid/ccid/:ccid', function(req,res) {
    var serviceName = "punchoutService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.punchout(req,res);
});

app.post('/FILLIN/iif/:iif', function(req,res) {
    var serviceName = "punchoutService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.punchout(req,res);
});

app.post('/FILLIN/sid/:supplierid/iif/:iif', function(req,res) {
    var serviceName = "punchoutService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.punchout(req,res);
});

app.post('/FILLIN/sid/:supplierid/ccid/:ccid/iif/:iif', function(req,res) {
    var serviceName = "punchoutService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.punchout(req,res);
});

function initializeController(req, res, serviceName) {
    if (appMode=="test") {
        serviceName = 'test_' + serviceName;
    }
    var service = this[serviceName];
    service.initialize(req,res,"false");
}


app.get('/shopping-cart-initialize',function(req,res) {
    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        initializeController(req, res, serviceName);
    }
});

app.get('/shopping-cart-header',function(req,res) {
    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.returnShoppingCart(req,res);
});

app.get('/shopping-cart',function(req,res) {
    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.returnCartData(req,res);
});

app.post('/shopping-cart',function(req,res) {

    if (typeof req.body.ids == undefined || !req.body.ids) {
        res.json({"status":"400"});
        return;
    }

    console.log("session: " + req.session);

    console.log(req.body.ids);

    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.addCartData(req,res);
});

app.post('/shopping-cart-add',function(req,res) {

	if (typeof req.body.id == undefined || !req.body.id) {
	    res.json({"status":"400"});
	    return;
	}
	
	console.log(req.body.id);
	
	var serviceName = "shoppingCartService";
	if (appMode=="test") {
	    serviceName = "test_"+serviceName;
	}
	
	var service = this[serviceName];
	service.addCartItem(req,res);
});


app.post('/shopping-cart-add-bundle',function(req,res) {

    if (typeof req.body.id == undefined || !req.body.id) {
        res.json({"status":"400"});
        return;
    }

    console.log(req.body.id);

    var serviceName = "shoppingCartBundleService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.addCartBundleItem(req,res);
});
app.post('/shopping-cart-add-quote',function(req,res) {

    if (typeof req.body.id == undefined || !req.body.id) {
        res.json({"status":"400"});
        return;
    }

    console.log(req.body.id);

    var serviceName = "shoppingCartQuoteService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.addCartQuoteItem(req,res);
});
app.post('/my-list-add',function(req,res) {

    if (typeof req.body.id == undefined || !req.body.id) {
        res.json({"status":"400"});
        return;
    }

    console.log(req.body.id);

    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.addItemToMyList(req,res);
});

app.post('/shopping-cart-delete-bundle',function(req,res) {

    if (typeof req.query.ids == undefined || !req.query.ids) {
        res.json({"status":"400"});
        return;
    }

    console.log(req.query.ids);

    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.deleteCartBundleData(req,res);

});

app.post('/shopping-cart-delete-quote',function(req,res) {

    if (typeof req.query.ids == undefined || !req.query.ids) {
        res.json({"status":"400"});
        return;
    }

    console.log(req.query.ids);

    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.deleteCartQuoteData(req,res);

});

app.post('/shopping-cart-delete',function(req,res) {

    if (typeof req.query.ids == undefined || !req.query.ids) {
        res.json({"status":"400"});
        return;
    }

    console.log(req.query.ids);

    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.deleteCartData(req,res);
});

app.post('/shopping-cart-move-bundle/:destListId',function(req,res) {
    if (typeof req.params.destListId == undefined || !req.params.destListId) {
        res.json({"status":"400"});
        return;
    }
    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    console.log('Move Shopping cart items to list: '+req.params.destListId);

    var service = this[serviceName];
    service.moveBundle(req,res);
});

app.post('/shopping-cart-move-quote/:destListId',function(req,res) {
    if (typeof req.params.destListId == undefined || !req.params.destListId) {
        res.json({"status":"400"});
        return;
    }
    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    console.log('Move Shopping cart items to list: '+req.params.destListId);

    var service = this[serviceName];
    service.moveQuote(req,res);
});
app.post('/shopping-cart-move/:destListId',function(req,res) {
	if (typeof req.params.destListId == undefined || !req.params.destListId) {
        res.json({"status":"400"});
        return;
    }
    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

	console.log('Move Shopping cart items to list: '+req.params.destListId);

    var service = this[serviceName];
    service.moveItems(req,res);
});

app.put('/shopping-cart/:id',function(req,res) {

    if (typeof req.params.id == undefined || !req.params.id) {
        res.json({"status":"400"});
        return;
    }

    console.log(req.params.id);

    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.updateCartData(req,res);

});

app.get('/continue-shopping',function(req,res) {
    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.openProductDetailsPage(req,res);

});


app.get('/bundle-products',function(req,res) {

    if (typeof req.param.id == undefined || !req.param.id) {
        res.json({"status":"400"});
        return;
    }

    console.log(req.param.id);
    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.openBundledProductDetailsPage(req,res);

});

app.post('/shopping-cart-copy-items-from-list/:listId',function(req,res) {
	if (typeof req.params.listId == undefined || !req.params.listId) {
        res.json({"status":"400"});
        return;
    }
    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

	console.log('Copy List items from list: '+req.params.listId+' to shopping cart');

    var service = this[serviceName];
    service.copyItemsToCart(req,res);
});
app.post('/shopping-cart-copy-quote-from-list/:listId',function(req,res) {
    if (typeof req.params.listId == undefined || !req.params.listId) {
        res.json({"status":"400"});
        return;
    }
    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    console.log('Copy List items from list: '+req.params.listId+' to shopping cart');

    var service = this[serviceName];
    service.copyQuoteToCart(req,res);
});

app.post('/shopping-cart-copy-bundels-from-list/:listId',function(req,res) {
    if (typeof req.params.listId == undefined || !req.params.listId) {
        res.json({"status":"400"});
        return;
    }
    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    console.log('Copy List items from list: '+req.params.listId+' to shopping cart');

    var service = this[serviceName];
    service.copyBundleToCart(req,res);
});

app.get('/checkout',function(req,res) {

    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.checkout(req,res);
});

app.post('/checkoutCapture',function(req,res) {

    console.log("post data");

});

app.get('/catalogs/:id',function(req,res) {

    if (typeof req.params.id == undefined || !req.params.id) {
        res.json({"status":"400"});
        return;
    }

    console.log("get catalog: "+req.params.id);

    var serviceName = "catalogsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.getCatalog(req,res);

});

app.get('/products/:itemId',function(req,res) {

    if (typeof req.params.itemId == undefined || !req.params.itemId) {
        res.json({"status":"400"});
        return;
    }

    console.log(req.params.itemId);
    var serviceName = "productService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.returnProductDetails(req,res);

});

app.get('/cart-products/:id',function(req,res) {

    if (typeof req.params.id == undefined || !req.params.id) {
        res.json({"status":"400"});
        return;
    }

    console.log(req.params.id);
    var serviceName = "productService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.returnCartProductDetails(req,res);

});

app.get('/external-products',function(req,res) {

    if (typeof req.query.id == undefined || !req.query.id) {
        res.json({"status":"400"});
        return;
    }

    console.log(req.query.id);

    var serviceName = "productService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.externalProductDetails(req,res);

});

app.get('/product-attachments',function(req,res) {

    if (typeof req.query.id == undefined || !req.query.id) {
        res.json({"status":"400"});
        return;
    }

    console.log(req.query.id);

    var serviceName = "productService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.getProductAttachments(req,res);

});

app.get('/product-reviews',function(req,res) {

    if (typeof req.query.id == undefined || !req.query.id) {
        res.json({"status":"400"});
        return;
    }

    console.log(req.query.id);

    var serviceName = "productService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.getProductReviews(req,res);

});

app.post('/product-reviews',function(req,res) {

    if (typeof req.query.id == undefined || !req.query.id) {
        res.json({"status":"400"});
        return;
    }

    if (typeof req.body.title == undefined || !req.body.title || typeof req.body.summary == undefined || !req.body.summary || typeof req.body.rating == undefined || !req.body.rating) {
        res.json({"status":"400"});
        return;
    }

    console.log(req.query.id);

    var serviceName = "productService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.submitProductReview(req,res);

});


app.get('/bg-searchstatus', function(req,res) {
    var serviceName = "searchService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.checkBgSearchStatus(req,res);
});

app.get('/product-offers',function(req,res) {

//    if (typeof req.query.keyword == undefined || !req.query.keyword) {
//        res.json({"status":"400"});
//        return;
//    }

    var serviceName = "searchService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.returnSearchResults(req,res);

});

app.post('/saved-searches',function(req,res) {

    if (typeof req.body.searchName == undefined || !req.body.searchName || typeof req.body.searchQuery == undefined || !req.body.searchQuery) {
        res.json({"status":"400"});
        return;
    }

    var serviceName = "savedSearchService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.saveNamedSearch(req,res);

});
app.get('/saved-searches',function(req,res) {

	var serviceName = "savedSearchService";
	if (appMode=="test") {
	    serviceName = "test_"+serviceName;
	}

	var service = this[serviceName];
	service.getSavedSearches(req,res);

});

app.delete('/saved-searches/:searchName',function(req,res) {
	if (typeof req.params.searchName == undefined || !req.params.searchName) {
	    res.json({"status":"400"});
	    return;
	}

	var serviceName = "savedSearchService";
	if (appMode=="test") {
	    serviceName = "test_"+serviceName;
	}

	var service = this[serviceName];
	service.deleteNamedSearch(req,res);

});

app.get('/recent-searches',function(req,res) {
	var serviceName = "savedSearchService";
	if (appMode=="test") {
	    serviceName = "test_"+serviceName;
	}

	var service = this[serviceName];
	service.getRecentSearches(req,res);

});




// My list endpoints
app.get('/my-lists-initialize',function(req,res) {
    var serviceName = "myListsService";
    if (appMode=="test") {
        initializeController(req, res, serviceName);
    }
//
//    var service = this[serviceName];
//    service.initialize(req,res,"false");
});

app.get('/my-lists',function(req,res) {
    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.returnMyListNames(req,res);
});

app.get('/all-lists',function(req,res) {
    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.returnAllListNames(req,res);
});

app.get('/my-lists/:listId',function(req,res) {
	if (typeof req.params.listId == undefined || !req.params.listId) {
        res.json({"status":"400"});
        return;
    }
	console.log('Get List: '+req.params.listId);

    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.returnMyListData(req,res);
});

app.post('/my-lists',function(req,res) {
    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.addMyList(req,res);
});

app.put('/my-lists/:listId',function(req,res) {
    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    console.log('Update My List: '+req.params.name);

    var service = this[serviceName];
    service.updateMyList(req,res);
});

app.delete('/my-lists/:listId',function(req,res) {
    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    console.log('Delete My List: '+req.params.name);

    var service = this[serviceName];
    service.deleteMyList(req,res);
});

app.delete('/my-lists/listtype/:listtype',function(req,res) {
    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    console.log('Delete My List: '+req.params.listtype);

    var service = this[serviceName];
    service.deleteMyListByType(req,res);
});

app.post('/my-lists-new-item/:itemId',function(req,res) {
	if (typeof req.params.itemId == undefined || !req.params.itemId) {
		res.json({"status":"400"});
		return;
	}
    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.addMyListWithItem(req,res);
});

app.post('/reviews',function(req,res) {
    var serviceName = "reviewsService";

    var service = this[serviceName];
    service.addReviewWithItem(req,res);
});

app.post('/deleteReview', function(req,res){
    var serviceName = "reviewsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.deleteReview(req,res);
});

app.post('/my-lists-items/:listId',function(req,res) {
    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    console.log('Add My List items in: '+req.params.listId);

    var service = this[serviceName];
    service.addMyListItems(req,res);
});

app.put('/my-lists-items/:id',function(req,res) {
	if (typeof req.params.id == undefined || !req.params.id) {
		res.json({"status":"400"});
		return;
	}
    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    console.log('Update My List item quantity: '+req.params.listId);

    var service = this[serviceName];
    service.updateMyListItemQty(req,res);
});

app.post('/my-lists-items-delete',function(req,res) {
    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

	console.log('Delete My List items from list: ');

    var service = this[serviceName];
    service.deleteMyListItems(req,res);
});

app.post('/my-lists-bundle-delete/:id',function(req,res) {
    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    console.log('Delete My List items from list: ');

    var service = this[serviceName];
    service.deleteMyListBundle(req,res);
});
app.post('/my-lists-quote-delete/:id',function(req,res) {
    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    console.log('Delete My List items from list: ');

    var service = this[serviceName];
    service.deleteMyListQuote(req,res);
});


app.post('/my-lists-items-move-quote/:listId/:destListId',function(req,res) {
    if (typeof req.params.listId == undefined || !req.params.listId
        || typeof req.params.destListId == undefined || !req.params.destListId) {
        res.json({"status":"400"});
        return;
    }
    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    console.log('Move List items from list: '+req.params.listId+' to list: '+req.params.destListId);

    var service = this[serviceName];
    service.moveListQuote(req,res);
});

app.post('/my-lists-items-move-bundle/:listId/:destListId',function(req,res) {
    if (typeof req.params.listId == undefined || !req.params.listId
        || typeof req.params.destListId == undefined || !req.params.destListId) {
        res.json({"status":"400"});
        return;
    }
    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    console.log('Move List items from list: '+req.params.listId+' to list: '+req.params.destListId);

    var service = this[serviceName];
    service.moveListBundle(req,res);
});

app.post('/my-lists-items-move/:listId/:destListId',function(req,res) {
	if (typeof req.params.listId == undefined || !req.params.listId
			|| typeof req.params.destListId == undefined || !req.params.destListId) {
        res.json({"status":"400"});
        return;
    }
    var serviceName = "myListsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

	console.log('Move List items from list: '+req.params.listId+' to list: '+req.params.destListId);

    var service = this[serviceName];
    service.moveListItems(req,res);
});

// Announcements endpoints
app.get('/announcements',function(req,res) {
	if (typeof req.session.unitId == undefined || !req.session.unitId) {
        res.json({"status":"400"});
        return;
    }
    var serviceName = "landingPageService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

	var service = this[serviceName];
	service.getAnnouncements(req,res);
});

app.delete('/announcements/:id',function(req,res) {
    if (typeof req.session.unitId == undefined || !req.session.unitId) {
        res.json({"status":"400"});
        return;
    }
    var serviceName = "landingPageService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.deleteAnnouncement(req,res);
});

// Information endpoints
app.get('/information',function(req,res) {
    if (typeof req.session.unitId == undefined || !req.session.unitId) {
        res.json({"status":"400"});
        return;
    }
    var serviceName = "landingPageService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.getInformation(req,res);
});

app.get('/suppliers',function(req,res) {
	if (typeof req.session.unitId == undefined || !req.session.unitId) {
        res.json({"status":"400"});
        return;
    }
    var serviceName = "landingPageService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

	var service = this[serviceName];
	service.getSuppliers(req,res);
});

app.get('/welcomeMessages',function(req,res) {
	if (typeof req.session.unitId == undefined || !req.session.unitId) {
        res.json({"status":"400"});
        return;
    }
    console.log("session: " + req.session);
    var serviceName = "landingPageService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

	var service = this[serviceName];
	service.getWelcomeMessages(req,res);
});

app.get('/help',function(req,res) {
    if (typeof req.session.unitId == undefined || !req.session.unitId) {
        res.json({"status":"400"});
        return;
    }
    console.log("session: " + req.session);
    var serviceName = "helpPageService";

    var service = this[serviceName];
    service.getHelpContent(req,res);
});

app.get('/autoSuggest',function(req,res) {
    if (typeof req.session.unitId == undefined || !req.session.unitId) {
        res.json({"status":"400"});
        return;
    }
    console.log("Keyword: " + req.query.keyword);
    var serviceName = "autoSuggestService";

    var service = this[serviceName];
    service.getAutoSuggest(req,res);
});

// serve static image resources
app.get(/\/(image|icons|attachments)\/(.+)/,function(req,res) {
    console.log("session: " + req.session);
    var serviceName = "imageDownloadService";

	var service = this[serviceName];
	service.download(req,res);
});

app.get('/header-content',function(req,res) {
	if (typeof req.session.unitId == undefined || !req.session.unitId) {
        res.json({"status":"400"});
        return;
    }

    var serviceName = "headerDataService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

	var service = this[serviceName];
	service.GET(req,res);
});

// product compare endpoints
app.get('/compare',function(req,res) {
    var serviceName = "compareService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.getCompareItemDetails(req,res);
});

app.get('/compare-items',function(req,res) {
    var serviceName = "compareService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.getCompareItemsShort(req,res);
});

app.post('/compare',function(req,res) {
    var serviceName = "compareService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.addCompareItems(req,res);
});

app.post('/compare-delete',function(req,res) {
    var serviceName = "compareService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }
    var service = this[serviceName];
    service.deleteCompareItems(req,res);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
    var lang,
    logoutLink ='';

    if (typeof req.session.language == 'undefined') {
      lang = 'eng';
    } else {
      lang = req.session.language;
    }

    if (req.session.userType == "CLIENT_LOGIN") {
        logger.debug("SAP USER");
    } else {
        logger.debug("NON-SAP USER");
        logoutLink = 'logoutUrl';
    }
    res.render('index.' + lang + '.html', {
      appStart: settings.appStart,
      release: settings.release,
      logoutUrl: settings.logoutUrl,
      logOutPlaceHolder: logoutLink,
      lang: lang
    })
});

app.get('/shopper', function (req, res) {
    var logoutLink = '';
    var suppliersURI = '';
    var companyURI = '';
    var contentURI = '';
    var eReqURI = '';
    var homeURI = '';
    var lang;

    if (typeof req.session.language == 'undefined') {
      lang = 'eng';
    } else {
      lang = req.session.language;
    };

    if (req.session.userType == 'VROOZI_LOGIN') {
        logoutLink = 'logoutUrl';
        suppliersURI = settings.adminUIHost + ":" + settings.adminUIPort + settings.adminUIPath + settings.suppliersURI;
        companyURI = settings.adminUIHost + ":" + settings.adminUIPort + settings.adminUIPath + settings.companyURI;
        contentURI = settings.adminUIHost + ":" + settings.adminUIPort + settings.adminUIPath + settings.contentURI;
        homeURI = settings.adminUIHost + ":" + settings.adminUIPort + settings.adminUIPath + settings.homeURI;
        eReqURI = settings.eReqPath;
    }
    res.render('index.' + lang + '.html', {
        appStart: settings.appStart,
        release: settings.release,
        logoutUrl: settings.logoutUrl,
        logOutPlaceHolder: logoutLink,
        suppliersURI: suppliersURI,
        companyURI: companyURI,
        contentURI: contentURI,
        homeURI: homeURI,
        eReqURI: eReqURI,
        lang: lang
    })
});

app.get('/shopper-lite', function(req, res){
    var lang,
    logoutLink ='';

    if (typeof req.session.language == 'undefined') {
      lang = 'eng';
    } else {
      lang = req.session.language;
    };

    if (req.session.userType == "CLIENT_LOGIN") {
        logger.debug("SAP USER");
    } else {
        logger.debug("NON-SAP USER");
        logoutLink = 'logoutUrl';
    }
    res.render('lite.' + lang + '.html', {
        appStart: settings.appStart,
        release: settings.release,
        logoutUrl: settings.logoutUrl,
        logOutPlaceHolder: logoutLink,
        lang: lang
    })
});

app.get('/shopper-test', function(req, res){
    res.render('shoppertest', {
        appStart: settings.appStart,
        release: settings.release
    })
});

app.get('/session-page.html', function(req, res){
    var lang;
    if (typeof req.session == 'undefined') {
        req.session = {};
    }
    if (typeof req.session.language == 'undefined') {
        lang = 'eng';
    } else {
        lang = req.session.language;
    }
    res.render('expiry.' + lang + '.html', {
        appStart: settings.appStart,
        release: settings.release
    })
});

app.get('/categoryTreeService',function(req,res) {
	var serviceName = "categoryTreeService";
	if (appMode=="test") {
	    serviceName = "test_"+serviceName;
	}

	var service = this[serviceName];
	service.returnCategoryTree(req,res);

});

app.get('/expiry', function(req, res){
  var lang;
  if (typeof req.session.language == 'undefined') {
    lang = 'eng';
  } else {
    lang = req.session.language;
  };
  res.render('expiry.' + lang + '.html', {
    appStart: settings.appStart,
    release: settings.release
  })
});

app.post('/remove-all-list-items',function(req,res) {
    var serviceName = "shoppingCartService";
    if (appMode=="test") {
    serviceName = "test_"+serviceName;
    }

    console.log('Delete My List items from list: ');
    var service = this[serviceName];
    service.removeAllItems(req,res);
});

// -------------------------------------------------------------------------------------------------------
// Purchase manager End points
// -------------------------------------------------------------------------------------------------------
app.get('/orders-overview',purchaseRequest.overview);
app.get('/purchase-request',purchaseRequest.create);
//app.post('/add-line-item',purchaseRequest.save);
//app.get('/purchase-request-preview',purchaseRequest.preview);
//app.get('/get-line-items',purchaseRequest.items);
app.get('/get-orders',purchaseRequest.orders);
//app.put('/update-order',purchaseRequest.updateOrder);
//app.get('/view-order',purchaseRequest.viewOrder);

app.get('/view-order/:orderNumber',function(req,res) {
	if (typeof req.params.orderNumber == undefined || !req.params.orderNumber) {
	    res.json({"status":"400"});
	    return;
	}
    var serviceName = "purchaseRequest";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }
    var service = this[serviceName];
    service.getPurchaseOrder(req,res);
});

app.post('/purchase-order',function(req,res) {
    var serviceName = "purchaseRequest";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }
    var service = this[serviceName];
    service.createPurchaseOrder(req,res);
});

app.get('/purchase-order/:orderNumber',function(req,res) {
	if (typeof req.params.orderNumber == undefined || !req.params.orderNumber) {
	    res.json({"status":"400"});
	    return;
	}
    var serviceName = "purchaseRequest";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }
    var service = this[serviceName];
    service.getPurchaseOrder(req,res);
});

app.put('/purchase-order/:orderNumber',function(req,res) {
	if (typeof req.params.orderNumber == undefined || !req.params.orderNumber) {
	    res.json({"status":"400"});
	    return;
	}
    var serviceName = "purchaseRequest";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }
    var service = this[serviceName];
    service.updatePurchaseOrder(req,res);
});

app.get('/purchase-order/:orderNumber/addresses',function(req,res) {
	if (typeof req.params.orderNumber == undefined || !req.params.orderNumber) {
	    res.json({"status":"400"});
	    return;
	}
    var serviceName = "purchaseRequest";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }
    var service = this[serviceName];
    service.getPurchaseOrderAddresses(req,res);
});

app.put('/purchase-order/:orderNumber/addresses',function(req,res) {
	if (typeof req.params.orderNumber == undefined || !req.params.orderNumber) {
	    res.json({"status":"400"});
	    return;
	}
    var serviceName = "purchaseRequest";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }
    var service = this[serviceName];
    service.updatePurchaseOrderAddresses(req,res);
});

app.get('/purchase-order/:orderNumber/accounting',function(req,res) {
	if (typeof req.params.orderNumber == undefined || !req.params.orderNumber) {
	    res.json({"status":"400"});
	    return;
	}
    var serviceName = "purchaseRequest";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }
    var service = this[serviceName];
    service.getPurchaseOrderAccounting(req,res);
});

app.put('/purchase-order/:orderNumber/accounting',function(req,res) {
	if (typeof req.params.orderNumber == undefined || !req.params.orderNumber) {
	    res.json({"status":"400"});
	    return;
	}
    var serviceName = "purchaseRequest";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }
    var service = this[serviceName];
    service.updatePurchaseOrderAccounting(req,res);
});

app.get('/purchase-order-items/:orderNumber',function(req,res) {
	if (typeof req.params.orderNumber == undefined || !req.params.orderNumber) {
	    res.json({"status":"400"});
	    return;
	}
    var serviceName = "purchaseRequest";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }
    var service = this[serviceName];
    service.getPurchaseOrderItems(req,res);
});

app.put('/purchase-order-items/:orderNumber',function(req,res) {
	if (typeof req.params.orderNumber == undefined || !req.params.orderNumber) {
	    res.json({"status":"400"});
	    return;
	}
    var serviceName = "purchaseRequest";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }
    var service = this[serviceName];
    service.addPurchaseOrderItems(req,res);
});

app.post('/notInCat', function(req,res) {
    var serviceName = "shoppingCartService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.addShoppingItem(req,res);
});

app.get('/suppliers-all', function(req,res) {
    var serviceName = "supplierService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.getSuppliers(req,res);
});

app.get('/currency-codes', function(req,res) {
    var serviceName = "supplierService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.getCurrencyCodes(req,res);
});

app.get('/category-codes', function(req,res) {
    var serviceName = "catalogsService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.getMaterialGroupMappings(req,res);
});

app.get('/uom-mappings', function(req,res) {
    var serviceName = "landingPageService";
    if (appMode=="test") {
        serviceName = "test_"+serviceName;
    }

    var service = this[serviceName];
    service.getUomMappings(req,res);
});

// -------------------------------------------------------------------------------------------------------
// App error logging
// -------------------------------------------------------------------------------------------------------


// -------------------------------------------------------------------------------------------------------
// App error logging
// -------------------------------------------------------------------------------------------------------

app.listen(port);

if (appMode == "test") {
    console.log("Running in test mode...");
    var dummyReq, dummyRes;

    for (var i=0; i<testControllers.length; i++) {
        var service = testControllers[i];
        service.initialize(dummyReq, dummyRes, "true");
    }
}



